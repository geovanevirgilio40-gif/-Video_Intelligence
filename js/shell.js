// Estrutura da aplicação: menu lateral, navegação móvel e aviso de demonstração.
window.VI = window.VI || {};

VI.shell = (function () {
  const h = VI.h;

  function navLink(item, className, pageId, labelNode) {
    return h(
      "a",
      { class: className, href: item.href, "aria-current": item.id === pageId ? "page" : null, title: item.label },
      VI.icon(item.icon, 18),
      labelNode
    );
  }

  function buildSidebar(pageId, session) {
    const groups = ["operacao", "controlo"].map(function (group) {
      return h(
        "div",
        { class: "nav-group" },
        h(
          "ul",
          null,
          VI.nav.filter(function (i) { return i.group === group; }).map(function (item) {
            return h("li", null, navLink(item, "nav-link", pageId, h("span", { class: "nav-label" }, item.label)));
          })
        )
      );
    });

    return h(
      "aside",
      { class: "sidebar" },
      h("div", { class: "sidebar-head" }, VI.ui.logo("light")),
      h("nav", { class: "sidebar-nav", "aria-label": "Navegação principal" }, groups),
      h(
        "div",
        { class: "sidebar-foot" },
        h(
          "div",
          { class: "user-info" },
          h("p", { class: "user-name" }, session.user.name),
          h("p", { class: "user-role" }, VI.roleLabels[session.user.role] || "")
        ),
        h(
          "button",
          { type: "button", class: "icon-btn", title: "Sair", onclick: VI.session.signOut },
          VI.icon("log-out", 18),
          h("span", { class: "visually-hidden" }, "Sair")
        )
      )
    );
  }

  function buildBottomNav(pageId, session) {
    const primary = VI.nav.filter(function (i) { return i.primaryMobile; });
    const secondary = VI.nav.filter(function (i) { return !i.primaryMobile; });
    let sheetRoot = null;
    let trigger = null;

    function closeSheet() {
      if (!sheetRoot) return;
      sheetRoot.remove();
      sheetRoot = null;
      document.removeEventListener("keydown", onKey);
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    }

    function onKey(event) {
      if (event.key === "Escape") closeSheet();
    }

    function openSheet() {
      const closeBtn = h(
        "button", { type: "button", class: "icon-btn", onclick: closeSheet },
        VI.icon("x", 20), h("span", { class: "visually-hidden" }, "Fechar")
      );
      sheetRoot = h(
        "div",
        { class: "sheet-root" },
        h("button", { type: "button", class: "sheet-backdrop", "aria-label": "Fechar menu", onclick: closeSheet }),
        h(
          "div",
          { class: "sheet", role: "dialog", "aria-modal": "true", "aria-label": "Mais secções" },
          h("div", { class: "sheet-head" }, h("h2", null, "Mais secções"), closeBtn),
          h(
            "ul",
            { class: "sheet-list" },
            secondary.map(function (item) {
              return h("li", null, navLink(item, "sheet-link", pageId, item.label));
            })
          ),
          h(
            "div",
            { class: "sheet-user" },
            h(
              "div",
              { class: "user-info" },
              h("p", { class: "user-name" }, session.user.name),
              h("p", { class: "user-role" }, VI.roleLabels[session.user.role] || "")
            ),
            h("button", { type: "button", class: "btn-text", onclick: VI.session.signOut }, VI.icon("log-out", 16), "Sair")
          )
        )
      );
      document.body.append(sheetRoot);
      trigger.setAttribute("aria-expanded", "true");
      document.addEventListener("keydown", onKey);
      closeBtn.focus();
    }

    trigger = h(
      "button",
      { type: "button", class: "tab", "aria-haspopup": "dialog", "aria-expanded": "false", onclick: openSheet },
      VI.icon("more", 20),
      h("span", null, "Mais")
    );

    return h(
      "nav",
      { class: "bottom-nav", "aria-label": "Navegação principal" },
      h(
        "ul",
        null,
        primary.map(function (item) {
          return h("li", null, navLink(item, "tab", pageId, h("span", null, item.shortLabel || item.label)));
        }),
        h("li", null, trigger)
      )
    );
  }

  async function start(pageId) {
    const session = await VI.session.require();
    if (!session) return null;

    const main = h("main", { id: "conteudo", class: "main" });
    const body = h(
      "div",
      { class: "shell-body" },
      session.demo
        ? h(
            "div",
            { class: "demo-banner" },
            VI.icon("shield-alert", 16),
            h("p", null, h("strong", null, "Modo de demonstração. "), "Sem autenticação real e com dados fictícios.")
          )
        : null,
      h("header", { class: "mobile-header" }, VI.ui.logo()),
      main
    );

    document.body.append(
      h("a", { class: "skip-link", href: "#conteudo" }, "Saltar para o conteúdo"),
      buildSidebar(pageId, session),
      body,
      buildBottomNav(pageId, session)
    );
    document.body.classList.remove("is-loading");
    return { main: main, session: session };
  }

  return { start: start };
})();
