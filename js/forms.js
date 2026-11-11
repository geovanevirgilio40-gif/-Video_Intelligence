// Formulários de autenticação: validação, erros acessíveis e envio.
window.VI = window.VI || {};

VI.forms = (function () {
  function readValues(form) {
    const values = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      values[el.name] = el.type === "checkbox" ? el.checked : el.value;
    });
    return values;
  }

  function fieldError(form, name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }

  function setFieldError(form, name, message) {
    const input = form.elements[name];
    const box = fieldError(form, name);
    if (!input || !box) return;
    if (message) {
      box.textContent = message;
      box.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", box.id);
    } else {
      box.textContent = "";
      box.hidden = true;
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function setupPasswordToggles(root) {
    root.querySelectorAll("[data-toggle-password]").forEach(function (button) {
      const input = root.querySelector("#" + button.dataset.togglePassword);
      const icon = function (visible) {
        button.replaceChildren(VI.icon(visible ? "eye-off" : "eye", 16));
        button.setAttribute("aria-label", visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe");
      };
      icon(false);
      button.addEventListener("click", function () {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon(show);
      });
    });
  }

  /**
   * options.validate(values) -> { campo: "mensagem" }
   * options.submit(values, ctx) -> Promise; ctx.showSuccess(mensagem) substitui o formulário.
   */
  function bind(form, options) {
    const alertBox = form.querySelector("[data-form-alert]");
    const successBox = document.querySelector("[data-success]");
    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;

    setupPasswordToggles(form);

    function showAlert(message) {
      alertBox.querySelector(".alert-body").textContent = message;
      alertBox.hidden = false;
    }

    function setLoading(loading) {
      button.disabled = loading;
      button.setAttribute("aria-busy", String(loading));
      button.replaceChildren(
        loading ? VI.icon("loader", 16, "spin") : document.createTextNode(""),
        document.createTextNode(label)
      );
    }

    form.addEventListener("input", function (event) {
      if (event.target.name) setFieldError(form, event.target.name, null);
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      alertBox.hidden = true;

      const values = readValues(form);
      const errors = options.validate(values);
      const names = Object.keys(values);
      names.forEach(function (name) { setFieldError(form, name, errors[name] || null); });

      const firstInvalid = names.find(function (name) { return errors[name]; });
      if (firstInvalid) {
        form.elements[firstInvalid].focus();
        return;
      }

      setLoading(true);
      try {
        await options.submit(values, {
          showSuccess: function (message) {
            form.hidden = true;
            successBox.querySelector(".alert-body").textContent = message;
            successBox.hidden = false;
          },
        });
      } catch (err) {
        showAlert(VI.errorMessage(err));
      } finally {
        setLoading(false);
      }
    });
  }

  return { bind: bind };
})();
