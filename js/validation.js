// Validação apenas para dar feedback imediato. O servidor tem de voltar a validar tudo.
window.VI = window.VI || {};

VI.validation = (function () {
  const PASSWORD_MIN_LENGTH = 12;

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function emailError(value) {
    if (!String(value).trim()) return "Indique o seu email.";
    if (!isEmail(value)) return "Indique um email válido.";
    return null;
  }

  return {
    PASSWORD_MIN_LENGTH: PASSWORD_MIN_LENGTH,

    login: function (v) {
      const errors = {};
      const email = emailError(v.email);
      if (email) errors.email = email;
      if (!v.password) errors.password = "Indique a sua palavra-passe.";
      return errors;
    },

    register: function (v) {
      const errors = {};
      if (v.name.trim().length < 3) errors.name = "Indique o nome completo.";
      const email = emailError(v.email);
      if (email) errors.email = email;

      if (v.password.length < PASSWORD_MIN_LENGTH) {
        errors.password = "Use pelo menos " + PASSWORD_MIN_LENGTH + " caracteres.";
      } else if (!/[a-z]/.test(v.password) || !/[A-Z]/.test(v.password) || !/\d/.test(v.password)) {
        errors.password = "Inclua letras maiúsculas, minúsculas e números.";
      }

      if (!v.confirm) errors.confirm = "Repita a palavra-passe.";
      else if (v.confirm !== v.password) errors.confirm = "As palavras-passe não coincidem.";

      if (!v.accepted) errors.accepted = "Confirme que vai usar apenas gravações autorizadas.";
      return errors;
    },

    emailOnly: function (v) {
      const errors = {};
      const email = emailError(v.email);
      if (email) errors.email = email;
      return errors;
    },
  };
})();
