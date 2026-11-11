// DADOS FICTÍCIOS. Só são usados com demoMode: true em js/config.js.
window.VI = window.VI || {};

VI.mocks = {
  dashboardSummary: async function () {
    await new Promise(function (resolve) { setTimeout(resolve, 450); });

    const minutesAgo = function (m) { return new Date(Date.now() - m * 60000).toISOString(); };
    const dayFormat = new Intl.DateTimeFormat("pt-PT", { weekday: "short" });
    const values = [9, 14, 11, 18, 7, 3, 12];
    const searchesByDay = values.map(function (value, i) {
      const date = new Date();
      date.setDate(date.getDate() - (values.length - 1 - i));
      return { label: dayFormat.format(date).replace(".", ""), value: value };
    });

    return {
      isDemo: true,
      cameras: { total: 24, online: 19, offline: 5 },
      recordings: 1386,
      searches: { total: 148, processing: 3 },
      pendingReview: 12,
      searchesByDay: searchesByDay,
      recentActivity: [
        { id: "a1", type: "search", description: "Iniciou uma pesquisa em 6 câmaras", actor: "Operador A", at: minutesAgo(8) },
        { id: "a2", type: "review", description: "Marcou um resultado como inconclusivo", actor: "Revisor B", at: minutesAgo(41) },
        { id: "a3", type: "upload", description: "Carregou uma gravação de 42 min", actor: "Operador A", at: minutesAgo(130) },
        { id: "a4", type: "camera", description: 'Registou a câmara "Entrada norte"', actor: "Administrador", at: minutesAgo(310) },
        { id: "a5", type: "review", description: "Confirmou 2 resultados", actor: "Revisor B", at: minutesAgo(1500) },
        { id: "a6", type: "access", description: "Iniciou sessão", actor: "Operador C", at: minutesAgo(1620) },
      ],
    };
  },
};
