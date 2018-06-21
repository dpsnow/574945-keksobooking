'use strict';

(function () {
  // FIXME: используется для маркеров(pin.js), карточек(card-offer.js) и главого маркера (pin-main.js)
  var sectionMap = document.querySelector('.map');
  var filtersContainer = sectionMap.querySelector('.map__filters-container');
  var offerCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardCurrentOffer = null;

  var l10nType = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  // Создание карточки объявления
  function createCardOffer(data, template) {
    var cardOffer = template.cloneNode(true);
    // Изменение текста шаблона объявления на основе указаного объявления
    cardOffer.querySelector('.popup__title').textContent = data.offer.title;
    cardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
    cardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' р/ночь';
    // В задании: В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
    cardOffer.querySelector('.popup__type').textContent = l10nType[data.offer.type];
    cardOffer.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    cardOffer.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    cardOffer.querySelector('.popup__description').textContent = data.offer.description;
    cardOffer.querySelector('.popup__avatar').src = data.author.avatar;
    // Создание новые features
    cardOffer.querySelector('.popup__features').innerHTML = '';
    var feature;
    for (var i = 0; i < data.offer.features.length; i++) {
      feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + data.offer.features[i]);
      cardOffer.querySelector('.popup__features').appendChild(feature);
    }
    // Создание фотографий
    var photoTemplate = cardOffer.querySelector('.popup__photo');
    cardOffer.querySelector('.popup__photos').innerHTML = '';
    var photo;
    for (var j = 0; j < data.offer.photos.length; j++) {
      photo = photoTemplate.cloneNode(true);
      photo.src = data.offer.photos[j];
      cardOffer.querySelector('.popup__photos').appendChild(photo);
    }
    cardOffer.querySelector('.popup__close').addEventListener('click', window.card.onClose);
    document.addEventListener('keydown', onEscPress);
    return cardOffer;
  }

  function onEscPress(evt) {
    window.util.isEscEvent(evt, window.card.onClose);
  }

  window.card = {
    onOpen: function (offer) {
      if (cardCurrentOffer) {
        cardCurrentOffer.remove();
      }
      cardCurrentOffer = createCardOffer(offer, offerCardTemplate);
      sectionMap.insertBefore(cardCurrentOffer, filtersContainer);
      document.addEventListener('keydown', onEscPress);
    },
    onClose: function () {
      if (cardCurrentOffer) {
        cardCurrentOffer.remove();
      }
      window.pins.makeNotActive();
      document.removeEventListener('keydown', onEscPress);
    }
  };

})();
