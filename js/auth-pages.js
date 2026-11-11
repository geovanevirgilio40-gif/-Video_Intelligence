// Ligação dos formulários de autenticação (entrar, criar conta, recuperar palavra-passe).
window.VI = window.VI || {};

VI.authPages = {
  start: function () {
    VI.ui.hydrate(document);
    document.querySelectorAll("[data-demo-only]").forEach(function (el) {
      el.hidden = !VI.config.demoMode;
    });

    const page = document.body.dataset.page;
    const form = document.querySelector("form[data-form]");

    if (page === "entrar") {
      VI.forms.bind(form, {
        validate: VI.validation.login,
        submit: async function (values) {
          await VI.authService.login({ email: values.email, password: values.password });
          location.assign(VI.session.safeNext());
        },
      });
    }

    if (page === "criar-conta") {
      VI.forms.bind(form, {
        validate: VI.validation.register,
        submit: async function (values, ctx) {
          await VI.authService.register({ name: values.name, email: values.email, password: values.password });
          // A mensagem final deve refletir o fluxo definido no backend (aprovação, confirmação de email, etc.).
          ctx.showSuccess("Pedido de criação de conta enviado. Quando o acesso estiver disponível, poderá entrar.");
        },
      });
    }

    if (page === "recuperar-palavra-passe") {
      VI.forms.bind(form, {
        validate: VI.validation.emailOnly,
        submit: async function (values, ctx) {
          await VI.authService.requestPasswordReset(values.email);
          // Resposta neutra: não revela se o email existe.
          ctx.showSuccess("Se o email estiver registado, enviámos as instruções para recuperar a palavra-passe.");
        },
      });
    }
  },
};
