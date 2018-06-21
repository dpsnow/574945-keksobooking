'use strict';
(function () {
  // FIXME: главный маркер используется для отрисовки обычных
  var pinMain = document.querySelector('.map__pin--main');
  // FIXME: используется для маркеров(pin.js), карточек(card-offer.js) и главого маркера (pin-main.js)
  var sectionMap = document.querySelector('.map');
  var filtersMap = document.querySelector('.map__filters');

  function hideFilters(value) {
    Array.prototype.forEach.call(filtersMap.children, function (child) {
      disabledNode(child, value);
      if (child.classList.contains('map__features')) {
        Array.prototype.forEach.call(child.children, function (item) {
          disabledNode(item, value);
        });
      }
    });
  }

  function disabledNode(elem, value) {
    elem.disabled = value;
    elem.style.cursor = value ? 'default' : '';
  }

  window.map = {
    activate: function () {
      pinMain.removeEventListener('mousedown', window.page.activate);
      sectionMap.classList.toggle('map--faded', false);
      hideFilters(false); // активировать фильтры
      // window.pins.renderAll(window.listOffers);
    },
    deactivate: function () {
      pinMain.addEventListener('mousedown', window.page.activate);
      sectionMap.classList.toggle('map--faded', true);
      hideFilters(true); // спрятать фильтры
      window.pins.deleteAll(); // удалить все метки на карте
      window.pinMain.reset(); // вернуть главную метку в центр
      window.card.onClose(); // закрыть карточку объявления
    }
  };
})();
