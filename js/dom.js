// Utilitário para criar elementos sem usar innerHTML com dados dinâmicos (evita XSS).
window.VI = window.VI || {};

VI.h = function (tag, attrs) {
  const el = document.createElement(tag);
  const props = attrs || {};
  Object.keys(props).forEach(function (key) {
    const value = props[key];
    if (value == null || value === false) return;
    if (key === "class") el.className = value;
    else if (key.indexOf("on") === 0 && typeof value === "function") el.addEventListener(key.slice(2), value);
    else if (value === true) el.setAttribute(key, "");
    else el.setAttribute(key, value);
  });
  Array.prototype.slice.call(arguments, 2).flat(Infinity).forEach(function (child) {
    if (child == null || child === false) return;
    el.append(child.nodeType ? child : document.createTextNode(String(child)));
  });
  return el;
};

VI.icon = function (name, size, cls) {
  return VI.icons.el(name, size, cls);
};
