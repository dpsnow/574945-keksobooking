'use strict';
(function () {

  // FIXME: форма (form.js)
  var adForm = document.querySelector('.ad-form');
  var PIN_ANIMATION = 300; // время анимации метки

  window.page = {
    activate: function () {
      window.backend.load(window.page.init, window.error.show);
    },
    // Функция перевода страницы в активное состояние
    init: function (dataOffer) {
      adForm.classList.toggle('ad-form--disabled', false);
      // window.backend.load(window.map.init, window.error.show);
      window.map.init(dataOffer);
      window.form.init();
      setTimeout(window.utils.onSetAddress, PIN_ANIMATION);
    },
    // Функция перевода страницы в неактивное состояние
    deactivate: function () {
      adForm.classList.toggle('ad-form--disabled', true);
      window.map.deactivate();
      window.error.hide();
      window.form.disabled(true);
      setTimeout(window.utils.onSetAddress, PIN_ANIMATION);
    }
  };

  window.page.deactivate();
})();
