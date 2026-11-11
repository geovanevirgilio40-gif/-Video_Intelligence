// Arranque das páginas protegidas. O identificador vem de <body data-page="...">.
window.VI = window.VI || {};

VI.main = {
  start: async function () {
    const pageId = document.body.dataset.page;
    const ctx = await VI.shell.start(pageId);
    if (!ctx) return;

    if (pageId === "visao-geral") {
      VI.dashboard.render(ctx.main);
    } else {
      const item = VI.nav.find(function (i) { return i.id === pageId; });
      if (item) VI.planned.render(ctx.main, item);
    }
  },
};
