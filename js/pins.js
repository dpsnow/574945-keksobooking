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

  /**
   * Создание метки объявления.
   * @param {Object} offer - Данные объявления
   * @param {Node} template - Шаблон для метки
   * @return {Node} Метка объявления
   */
  function createPinOffer(offer, template) {
    var pin = template.cloneNode(true);
    pin.style.left = (offer.location.x - (PIN_WIDTH / 2)) + 'px';
    pin.style.top = (offer.location.y - PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = offer.author.avatar;
    pin.querySelector('img').alt = offer.offer.title;
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      activatePin(pin);
      window.card.onOpen(offer);
    });
    return pin;
  }

  /**
   * Перевод метки в активное состояние.
   * @param {Node} elem - Выбранная метка.
   */
  function activatePin(elem) {
    deactivatePin();
    activePin = elem;
    elem.classList.add('map__pin--active');
  }

  /**
   * Перевод метки в неактивное состояние.
   */
  function deactivatePin() {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  }

  window.pins = {
    /**
   * Отрисовка заданного количества меток на основе переданных данных.
   * @param {Array} offers - Данные объявлений.
   * @param {Number} amount - Максимальное количество отображаемых меток.
   */
    render: function (offers, amount) {
      if (offers.length === 0) {
        window.error.show('Нет подходящих объявлений.');
      } else {
        window.error.hide();
        var fragment = document.createDocumentFragment();
        var pinOffer;
        window.utils.getArrayRandomLength(offers, amount).forEach(function (item) {
          pinOffer = createPinOffer(item, mapPinTemplate);
          fragment.appendChild(pinOffer);
          pinsMap.push(pinOffer);
        });
        pinsContainer.insertBefore(fragment, pinMain);
      }
    },
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
