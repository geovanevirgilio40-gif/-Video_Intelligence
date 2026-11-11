// Página "Visão geral".
window.VI = window.VI || {};

VI.dashboard = (function () {
  const h = VI.h;
  const fmt = VI.format;

  const activityIcons = { search: "search", review: "user-check", upload: "film", camera: "video", access: "log-in" };

  function cameraPanel(cameras, isDemo) {
    const pct = cameras.total > 0 ? (cameras.online / cameras.total) * 100 : 0;
    const bar = h("div", {
      class: "status-bar", role: "img",
      "aria-label": cameras.online + " online e " + cameras.offline + " offline, num total de " + cameras.total,
    }, h("div", { style: "width:" + pct + "%" }));

    return h(
      "section", { class: "panel", "aria-labelledby": "cameras-title" },
      h("h2", { id: "cameras-title", class: "panel-label" }, "Câmaras registadas"),
      h("p", { class: "big-number tabular" }, fmt.number(cameras.total)),
      bar,
      h(
        "dl", { class: "legend" },
        h("div", null,
          h("dt", null, h("span", { class: "swatch", style: "background:var(--accent)" }), "Online"),
          h("dd", { class: "tabular" }, fmt.number(cameras.online))),
        h("div", null,
          h("dt", null, h("span", { class: "swatch", style: "background:var(--slate-300)" }), "Offline"),
          h("dd", { class: "tabular" }, fmt.number(cameras.offline)))
      ),
      h("p", { class: "panel-note" }, isDemo ? "Estado fictício, sem ligação a câmaras reais." : "Estado reportado pelo servidor.")
    );
  }

  function reviewPanel(pending) {
    return h(
      "section", { class: "panel panel-review", "aria-labelledby": "review-title" },
      h("div", null,
        h("h2", { id: "review-title", class: "panel-label" }, "Resultados por rever"),
        h("p", { class: "big-number tabular" }, String(pending)),
        h("p", null, "Cada correspondência precisa de revisão humana. Uma pontuação de similaridade não comprova identidade.")),
      h("a", { class: "btn btn-primary", href: "resultados.html" }, "Abrir resultados", VI.icon("arrow-right", 16))
    );
  }

  function statTile(label, value, icon, hint) {
    return h(
      "div", { class: "stat" },
      h("div", { class: "stat-top" }, h("p", null, label), VI.icon(icon, 16)),
      h("p", { class: "big-number tabular" }, fmt.number(value)),
      hint ? h("p", { class: "stat-hint" }, hint) : null
    );
  }

  function searchesChart(points) {
    const max = Math.max.apply(null, points.map(function (p) { return p.value; }).concat(1));
    const summary = points.map(function (p) { return p.label + ": " + p.value; }).join(", ");

    return h(
      "section", { class: "panel", "aria-labelledby": "chart-title" },
      h("h2", { id: "chart-title" }, "Pesquisas nos últimos 7 dias"),
      h("p", { class: "chart-note" }, "O dia mais recente aparece a azul."),
      h(
        "div", { class: "bars", role: "img", "aria-label": "Pesquisas nos últimos 7 dias. " + summary },
        points.map(function (p, i) {
          const height = Math.max((p.value / max) * 100, 3);
          return h(
            "div", { class: "bar-col" },
            h("span", { class: "bar-value tabular" }, String(p.value)),
            h("div", { class: "bar-track" },
              h("div", { class: "bar" + (i === points.length - 1 ? " is-today" : ""), style: "height:" + height + "%" })),
            h("span", { class: "bar-label" }, p.label)
          );
        })
      )
    );
  }

  function activityFeed(items) {
    const content = items.length === 0
      ? h("div", { style: "margin-top:16px" },
          VI.ui.emptyState({ icon: "search", title: "Sem atividade recente", description: "As pesquisas e revisões aparecem aqui." }))
      : h("ul", { class: "activity" }, items.map(function (item) {
          return h(
            "li", null,
            h("span", { class: "activity-icon" }, VI.icon(activityIcons[item.type] || "info", 16)),
            h("div", { class: "activity-text" },
              h("p", null, item.description),
              h("p", { class: "activity-meta" },
                h("span", null, item.actor),
                h("time", { datetime: item.at }, fmt.relative(item.at))))
          );
        }));

    return h("section", { class: "panel", "aria-labelledby": "activity-title" },
      h("h2", { id: "activity-title" }, "Atividade recente"), content);
  }

  function content(data) {
    return h(
      "div", { class: "stack" },
      h("div", { class: "grid-3" },
        h("div", { class: "span-2" }, cameraPanel(data.cameras, data.isDemo)),
        reviewPanel(data.pendingReview)),
      h("div", { class: "grid-stats" },
        statTile("Gravações disponíveis", data.recordings, "film"),
        statTile("Pesquisas realizadas", data.searches.total, "search"),
        statTile("Pesquisas em processamento", data.searches.processing, "loader",
          data.searches.processing > 0 ? "A decorrer neste momento" : "Nenhuma a decorrer")),
      h("div", { class: "grid-3" },
        h("div", { class: "span-2" }, searchesChart(data.searchesByDay)),
        activityFeed(data.recentActivity))
    );
  }

  function loadingView() {
    return h(
      "div", { class: "stack", role: "status", "aria-label": "A carregar a visão geral" },
      h("div", { class: "grid-3" }, h("div", { class: "span-2" }, VI.ui.skeleton("")), VI.ui.skeleton("")),
      h("div", { class: "grid-stats" }, VI.ui.skeleton(""), VI.ui.skeleton(""), VI.ui.skeleton("")),
      h("div", { class: "grid-3" }, h("div", { class: "span-2" }, VI.ui.skeleton("")), VI.ui.skeleton(""))
    );
  }

  function render(main) {
    const header = VI.ui.pageHeader("Visão geral", "Estado das câmaras, gravações e pesquisas.");
    const body = h("div");
    main.append(header.el, body);

    async function load() {
      const loading = loadingView();
      loading.querySelectorAll(".skeleton").forEach(function (s, i) { s.style.height = i < 2 ? "208px" : i < 5 ? "112px" : "256px"; });
      body.replaceChildren(loading);
      try {
        const data = await VI.dashboardService.getSummary();
        if (data.isDemo) header.badgeSlot.replaceChildren(VI.ui.demoBadge());
        body.replaceChildren(content(data));
      } catch (err) {
        body.replaceChildren(VI.ui.errorState(VI.errorMessage(err), load));
      }
    }
    load();
  }

  return { render: render };
})();
