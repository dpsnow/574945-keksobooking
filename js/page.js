'use strict';
(function () {
  // FIXME: используется для маркеров(pin.js), карточек(card-offer.js) и главого маркера (pin-main.js)
  var sectionMap = document.querySelector('.map');
  // FIXME: форма (form.js)
  var adForm = document.querySelector('.ad-form');

  // FIXME: главный маркер используется для отрисовки обычных
  var pinMain = document.querySelector('.map__pin--main');

  window.page = {
    // Функция перевода страницы в активное состояние
    activate: function () {
      pinMain.removeEventListener('mousedown', window.page.activate);
      sectionMap.classList.toggle('map--faded', false);
      adForm.classList.toggle('ad-form--disabled', false);
      window.form.disabled(false);
      window.pinList.render(window.listOffers);
      window.pinMain.setAddress();
    },
    // Функция перевода страницы в неактивное состояние
    deactivate: function () {
      pinMain.addEventListener('mousedown', window.page.activate);
      window.form.disabled(true);
      sectionMap.classList.toggle('map--faded', true);
      adForm.classList.toggle('ad-form--disabled', true);
      window.pinMain.reset(); // вернуть главную метку в центр
      window.cardOffer.close(); // закрыть карточку объявления
      window.pinList.delete(); // удалить все метки на карте
    }
  };

  window.page.deactivate();
})();
