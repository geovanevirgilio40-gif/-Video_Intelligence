// Sessão. Guarda apenas a navegação da interface: a proteção real dos dados é do backend.
window.VI = window.VI || {};

VI.session = (function () {
  const demoUser = { id: "demo", name: "Utilizador de demonstração", email: "demo@exemplo.invalid", role: "admin" };

  function currentFile() {
    return location.pathname.split("/").pop() || "index.html";
  }

  // Só aceita nomes de páginas desta aplicação (evita redirecionamentos para sites externos).
  function safeNext() {
    const next = new URLSearchParams(location.search).get("next");
    return next && /^[a-z0-9-]+\.html$/.test(next) ? next : "index.html";
  }

  async function require() {
    if (VI.config.demoMode) return { user: demoUser, demo: true };
    try {
      const user = await VI.authService.me();
      return { user: user, demo: false };
    } catch (err) {
      location.replace("entrar.html?next=" + encodeURIComponent(currentFile()));
      return null;
    }
  }

  async function signOut() {
    if (!VI.config.demoMode) {
      try {
        await VI.authService.logout();
      } catch (err) {
        /* mesmo com falha de rede, volta ao início de sessão */
      }
    }
    location.assign("entrar.html");
  }

  return { require: require, signOut: signOut, safeNext: safeNext };
})();
