'use strict';
(function () {

  // FIXME: форма (form.js)
  var adForm = document.querySelector('.ad-form');

  window.page = {
    // Функция перевода страницы в активное состояние
    activate: function () {
      adForm.classList.toggle('ad-form--disabled', false);
      window.backend.load(window.pins.renderAll, window.error.show);
      window.map.activate();
      window.form.disabled(false);
      window.form.setAddress();
    },
    // Функция перевода страницы в неактивное состояние
    deactivate: function () {
      adForm.classList.toggle('ad-form--disabled', true);
      window.map.deactivate();
      window.error.hide();
      window.form.disabled(true);
      // window.form.setAddress();
      setTimeout(window.form.setAddress, 300);
    }
  };

  window.page.deactivate();
})();
