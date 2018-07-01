'use strict';
(function () {
  var PIN_ANIMATION = 300; // время анимации метки

  window.page = {
    // Функция перевода страницы в активное состояние
    activate: function () {
      window.backend.load(function (loadData) {
        window.map.init(loadData);
        window.form.init();
        setTimeout(window.utils.onSetAddress, PIN_ANIMATION);
      }, window.error.show);
    },
    // Функция перевода страницы в неактивное состояние
    deactivate: function () {
      window.map.deactivate();
      window.error.hide();
      window.form.disabled(true);
      setTimeout(window.utils.onSetAddress, PIN_ANIMATION);
      window.scroll(0, 0);
    }
  };

  window.page.deactivate();
})();
