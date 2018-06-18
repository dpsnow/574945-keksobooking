'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  // FIXME: используется для маркеров(pin.js), карточек(card-offer.js) и главого маркера (pin-main.js)
  var sectionMap = document.querySelector('.map');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsContainer = sectionMap.querySelector('.map__pins');
  var pinsMap = [];

  // FIXME: главный маркер используется для отрисовки обычных (вставить до)
  var pinMain = document.querySelector('.map__pin--main');

  function createPinOffer(dataOffer, template) {
    // Создание копий pin из шаблона
    var pin = template.cloneNode(true);
    // Изменение положения метки (pin) на основе location указанного в arr
    pin.style.left = (dataOffer.location.x - (PIN_WIDTH / 2)) + 'px';
    pin.style.top = (dataOffer.location.y - PIN_HEIGHT) + 'px';
    // Изменение атрибутов изображения метки на основе указанных в arr
    pin.querySelector('img').src = dataOffer.author.avatar;
    pin.querySelector('img').alt = dataOffer.offer.title;
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (window.currentOffer) {
        window.currentOffer = null;
      }
      window.currentOffer = dataOffer;
      window.cardOffer.open();
    });
    return pin;
  }
  window.pinList = {
    render: function (dataOffers) {
      var pinOfferList = document.createDocumentFragment();
      var pinOffer;
      dataOffers.forEach(function (item) {
        pinOffer = createPinOffer(item, mapPinTemplate);
        pinOfferList.appendChild(pinOffer);
        pinsMap[pinsMap.length] = pinOffer;
      });
      // Отрисовка меток
      pinsContainer.insertBefore(pinOfferList, pinMain);
    },
    // удалить все метки на карте
    delete: function () {
      if (pinsMap.length !== 0) {
        pinsMap.forEach(function (item) {
          item.remove();
        });
      }
    }
  };

})();
