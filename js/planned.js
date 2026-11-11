// Páginas ainda por construir: mostram o que vão incluir.
window.VI = window.VI || {};

VI.planned = {
  render: function (main, item) {
    const h = VI.h;
    const list = item.planned
      ? h("ul", { class: "planned" }, item.planned.map(function (line) {
          return h("li", null, VI.icon("check", 16), line);
        }))
      : null;

    main.append(
      VI.ui.pageHeader(item.label).el,
      VI.ui.emptyState({
        icon: item.icon,
        title: "Esta secção ainda está por construir",
        description: item.phase ? "Está prevista para a fase " + item.phase + " do desenvolvimento." : "",
        children: list,
      })
    );
  },
};
