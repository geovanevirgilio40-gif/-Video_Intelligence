// Componentes reutilizáveis de interface.
window.VI = window.VI || {};

VI.ui = (function () {
  const h = VI.h;

  function logo(tone) {
    const svg = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">' +
        '<rect width="32" height="32" rx="7" fill="#2F6FED"/>' +
        '<circle cx="15" cy="15" r="7" fill="none" stroke="#fff" stroke-width="2"/>' +
        '<path d="M13.2 11.8v6.4l5-3.2z" fill="#fff"/>' +
        '<path d="M20.5 20.5l4.5 4.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
      "image/svg+xml"
    ).documentElement;
    return h(
      "span",
      { class: "logo" + (tone === "light" ? " logo-light" : "") },
      document.importNode(svg, true),
      h("span", { class: "logo-text" }, "Video Intelligence")
    );
  }

  function demoBadge() {
    return h("span", { class: "badge-demo" }, VI.icon("flask", 14), "Dados fictícios");
  }

  function pageHeader(title, description) {
    const badgeSlot = h("span");
    const el = h(
      "header",
      { class: "page-header" },
      h(
        "div",
        null,
        h("div", { class: "page-title-row" }, h("h1", null, title), badgeSlot),
        description ? h("p", null, description) : null
      )
    );
    return { el: el, badgeSlot: badgeSlot };
  }

  function skeleton(className) {
    return h("div", { class: "skeleton " + (className || ""), "aria-hidden": "true" });
  }

  function emptyState(opts) {
    return h(
      "div",
      { class: "state state-empty" },
      VI.icon(opts.icon, 32),
      h("h2", null, opts.title),
      opts.description ? h("p", null, opts.description) : null,
      opts.children || null
    );
  }

  function errorState(message, onRetry) {
    return h(
      "div",
      { class: "state state-error", role: "alert" },
      VI.icon("alert-circle", 32),
      h("h2", null, "Não foi possível carregar os dados"),
      h("p", null, message),
      onRetry ? h("button", { type: "button", class: "btn btn-secondary", onclick: onRetry }, "Tentar novamente") : null
    );
  }

  // Substitui marcadores estáticos do HTML: <i data-icon="nome"> e <span data-logo="light">.
  function hydrate(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (node) {
      node.replaceWith(VI.icon(node.dataset.icon, Number(node.dataset.size) || 18, node.getAttribute("class") || ""));
    });
    (root || document).querySelectorAll("[data-logo]").forEach(function (node) {
      node.replaceWith(logo(node.dataset.logo));
    });
  }

  return { logo: logo, demoBadge: demoBadge, pageHeader: pageHeader, skeleton: skeleton, emptyState: emptyState, errorState: errorState, hydrate: hydrate };
})();
