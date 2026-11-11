// Camada de serviços: único ponto de comunicação com o backend (FastAPI).
window.VI = window.VI || {};

VI.authService = {
  login: function (input) { return VI.http.post("/auth/login", input); },
  register: function (input) { return VI.http.post("/auth/register", input); },
  requestPasswordReset: function (email) { return VI.http.post("/auth/password-reset", { email: email }); },
  me: function () { return VI.http.get("/auth/me"); },
  logout: function () { return VI.http.post("/auth/logout"); },
};

VI.dashboardService = {
  getSummary: function () {
    // No modo de demonstração nunca se contacta o servidor: tudo é fictício.
    if (VI.config.demoMode) return VI.mocks.dashboardSummary();
    return VI.http.get("/dashboard/summary");
  },
};
