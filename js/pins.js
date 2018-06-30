'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var sectionMap = document.querySelector('.map');
  var pinMain = document.querySelector('.map__pin--main');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsContainer = sectionMap.querySelector('.map__pins');
  var pinsMap = [];
  var activePin;

  function createPinOffer(offer, template) {
    // Создание копий pin из шаблона
    var pin = template.cloneNode(true);
    // Изменение положения метки (pin) на основе location указанного в arr
    pin.style.left = (offer.location.x - (PIN_WIDTH / 2)) + 'px';
    pin.style.top = (offer.location.y - PIN_HEIGHT) + 'px';
    // Изменение атрибутов изображения метки на основе указанных в arr
    pin.querySelector('img').src = offer.author.avatar;
    pin.querySelector('img').alt = offer.offer.title;
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      activatePin(pin);
      window.card.onOpen(offer);
    });
    return pin;
  }

  function activatePin(elem) {
    deactivatePin();
    activePin = elem;
    elem.classList.add('map__pin--active');
  }

  function deactivatePin() {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  }

  window.pins = {
    render: function (offers) {
      var fragment = document.createDocumentFragment();
      var pinOffer;
      offers.forEach(function (item) {
        pinOffer = createPinOffer(item, mapPinTemplate);
        fragment.appendChild(pinOffer);
        pinsMap.push(pinOffer);
      });
      pinsContainer.insertBefore(fragment, pinMain); // Отрисовка меток
    },
    // удалить все метки на карте
    delete: function () {
      if (pinsMap.length !== 0) {
        pinsMap.forEach(function (item) {
          item.remove();
        });
      }
    },
    makeNotActive: deactivatePin
  };

})();
