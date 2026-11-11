window.VI = window.VI || {};

VI.ApiError = class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
};

VI.http = (function () {
  async function request(method, path, body) {
    const base = (VI.config.apiBaseUrl || "").replace(/\/$/, "");
    if (!base) {
      throw new VI.ApiError("O servidor ainda não está configurado. Defina apiBaseUrl em js/config.js.", 0);
    }

    let response;
    try {
      response = await fetch(base + path, {
        method: method,
        // A sessão deve viver num cookie httpOnly definido pelo backend,
        // nunca em localStorage ou no código do frontend.
        credentials: "include",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      throw new VI.ApiError("Não foi possível contactar o servidor. Verifique a ligação e tente novamente.", 0);
    }

    if (!response.ok) {
      let message = "Ocorreu um erro inesperado.";
      try {
        const data = await response.json();
        // FastAPI devolve erros no campo "detail".
        if (data && typeof data.detail === "string") message = data.detail;
      } catch (err) {
        /* resposta sem corpo JSON */
      }
      throw new VI.ApiError(message, response.status);
    }

    if (response.status === 204) return undefined;
    return response.json();
  }

  return {
    get: function (path) { return request("GET", path); },
    post: function (path, body) { return request("POST", path, body); },
    put: function (path, body) { return request("PUT", path, body); },
    patch: function (path, body) { return request("PATCH", path, body); },
    delete: function (path) { return request("DELETE", path); },
  };
})();

VI.errorMessage = function (err) {
  return err instanceof VI.ApiError ? err.message : "Ocorreu um erro inesperado.";
};
