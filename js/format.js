window.VI = window.VI || {};

(function () {
  const number = new Intl.NumberFormat("pt-PT");
  const relative = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });

  VI.format = {
    number: function (value) {
      return number.format(value);
    },
    relative: function (iso) {
      const diff = (new Date(iso).getTime() - Date.now()) / 1000;
      const abs = Math.abs(diff);
      if (abs < 60) return "agora mesmo";
      if (abs < 3600) return relative.format(Math.round(diff / 60), "minute");
      if (abs < 86400) return relative.format(Math.round(diff / 3600), "hour");
      return relative.format(Math.round(diff / 86400), "day");
    },
  };
})();
