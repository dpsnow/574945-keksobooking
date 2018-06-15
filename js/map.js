'use strict';
var ESC_KEYCODE = 27;
var quantityOffers = 8;
var sectionMap = document.querySelector('.map');

var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinsContainer = sectionMap.querySelector('.map__pins');
var mapPins = [];
var PIN_WEIGHT = 50;
var PIN_HEIGHT = 70;
var filtersContainer = sectionMap.querySelector('.map__filters-container');
var offerCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var pinMain = document.querySelector('.map__pin--main');
var PIN_MAIN_WIDTH = pinMain.offsetWidth;
var PIN_MAIN_HEIGHT = pinMain.offsetHeight;
var addressForm = adForm.address;
var submitButtonForm = adForm.querySelector('.ad-form__submit');
var resetButtonForm = adForm.querySelector('.ad-form__reset');
var currentCardOffer = null;
var messageSuccess = document.querySelector('.success');

var offerTitle = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var offerType = ['palace', 'flat', 'house', 'bungalo'];
var l10nType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var minPriceType = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
};
var offerCheckIn = ['12:00', '13:00', '14:00'];
var offerCheckOut = ['12:00', '13:00', '14:00'];
var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var offerPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var offerRoomsMatchForm = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0'],
};


// Функция случайного числа из диапазона
function getRandomIntegerRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Функция получения массива заданной длинны c перетасовкой.
function getArrayRandomLength(array, length) {
  var shufleArray = array.slice();
  var temporaryValue;
  var randomIndex;

  for (var currentIndex = shufleArray.length - 1; currentIndex > 0; currentIndex--) {
    randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    randomIndex = getRandomIntegerRange(0, currentIndex);
    temporaryValue = shufleArray[currentIndex];
    shufleArray[currentIndex] = shufleArray[randomIndex];
    shufleArray[randomIndex] = temporaryValue;
  }
  shufleArray.length = length;
  return shufleArray;
}

// Функция генерации объекта
function createObject(index) {
  var objectRoom = {
    'author': {
      'avatar': 'img/avatars/user0' + (index + 1) + '.png'
    },

    'offer': {
      'title': offerTitle[index],
      'address': getRandomIntegerRange(300, 900) + ', ' + getRandomIntegerRange(130, 630),
      'price': getRandomIntegerRange(1000, 1000000),
      'type': offerType[getRandomIntegerRange(0, offerType.length - 1)],
      'rooms': getRandomIntegerRange(1, 5),
      'guests': getRandomIntegerRange(1, 35),
      'checkin': offerCheckIn[getRandomIntegerRange(0, offerCheckIn.length - 1)],
      'checkout': offerCheckOut[getRandomIntegerRange(0, offerCheckOut.length - 1)],
      // Случайное кол-во, случаные значения, не должны повторяться
      'features': getArrayRandomLength(offerFeatures, getRandomIntegerRange(1, offerFeatures.length - 1)),
      'description': '',
      // Случ. порядок
      'photos': getArrayRandomLength(offerPhotos, offerPhotos.length)
    },

    'location': {
      'x': getRandomIntegerRange(300, 900),
      'y': getRandomIntegerRange(130, 630),
    }
  };

  return objectRoom;
}

function createListOffers(quantityElements) {
  var listElement = [];
  for (var i = 0; i < quantityElements; i++) {
    listElement[i] = createObject(i);
  }
  return listElement;
}

// Функция создание меток
function renderMapPins(dataOffers, template) {
  var pin;
  dataOffers.forEach(function (item) {
    // Создание копий pin из шаблона
    pin = template.cloneNode(true);
    // Изменение положения метки (pin) на основе location указанного в arr
    pin.style.left = (item.location.x - (PIN_WEIGHT / 2)) + 'px';
    pin.style.top = (item.location.y - PIN_HEIGHT) + 'px';
    // Изменение атрибутов изображения метки на основе указанных в arr
    pin.querySelector('img').src = item.author.avatar;
    pin.querySelector('img').alt = item.offer.title;
    // Отрисовка метки
    pinsContainer.insertBefore(pin, pinMain);
    mapPins[mapPins.length] = pin;
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (currentCardOffer) {
        currentCardOffer.remove();
      }
      currentCardOffer = createCardOffer(item, offerCardTemplate);
      sectionMap.insertBefore(currentCardOffer, filtersContainer);
    });
  });

}

// Создание карточки объявления
function createCardOffer(data, template) {
  var сardOffer = template.cloneNode(true);
  // Изменение текста шаблона объявления на основе указаного объявления
  сardOffer.querySelector('.popup__title').textContent = data.offer.title;
  сardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
  сardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' р/ночь';
  // В задании: В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
  сardOffer.querySelector('.popup__type').textContent = l10nType[data.offer.type];
  сardOffer.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  сardOffer.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  сardOffer.querySelector('.popup__description').textContent = data.offer.description;
  сardOffer.querySelector('.popup__avatar').src = data.author.avatar;
  // Создание новые features
  сardOffer.querySelector('.popup__features').innerHTML = '';
  var feature;
  for (var i = 0; i < data.offer.features.length; i++) {
    feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + data.offer.features[i]);
    сardOffer.querySelector('.popup__features').appendChild(feature);
  }
  // Создание фотографий
  var photoTemplate = сardOffer.querySelector('.popup__photo');
  сardOffer.querySelector('.popup__photos').innerHTML = '';
  var photo;
  for (var j = 0; j < data.offer.photos.length; j++) {
    photo = photoTemplate.cloneNode(true);
    photo.src = data.offer.photos[j];
    сardOffer.querySelector('.popup__photos').appendChild(photo);
  }

  сardOffer.querySelector('.popup__close').addEventListener('click', onCloseOfferCard);
  document.addEventListener('keydown', onPopupEscPress);
  return сardOffer;
}

// Функция расчета положения метки относительно карты и размеров.
function setAddress() {
  var positionPin = {};
  positionPin.x = Math.round(pinMain.offsetLeft + PIN_MAIN_WIDTH / 2);
  positionPin.y = Math.round(pinMain.offsetTop + PIN_MAIN_HEIGHT);
  addressForm.value = positionPin.x + ', ' + positionPin.y;

  addressForm.readOnly = true;
}

function onCloseOfferCard(evt) {
  evt.preventDefault();
  currentCardOffer.remove();
  document.removeEventListener('keydown', onPopupEscPress);
}

function onPopupEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onCloseOfferCard(evt);
  }
}

function deleteMapPins() {
  mapPins.forEach(function (item) {
    item.remove();
  });
}

function disabledForm(params) {
  Array.prototype.forEach.call(adForm, function (item) {
    item.disabled = params;
  });
}

// Функция перевода страницы в активное состояние
function activatePage() {
  pinMain.removeEventListener('mouseup', activatePage);
  sectionMap.classList.toggle('map--faded', false);
  adForm.classList.toggle('ad-form--disabled', false);
  disabledForm(false);
  renderMapPins(listOffers, mapPinTemplate);
  setAddress();
}

// Функция перевода страницы в неактивное состояние
function deactivatePage() {
  disabledForm(true);
  sectionMap.classList.toggle('map--faded', true);
  adForm.classList.toggle('ad-form--disabled', true);
  // Удалить введенные данные в форму
  adForm.reset();
  var mainPinDefaultX = Math.round(pinMain.offsetLeft + PIN_MAIN_WIDTH / 2);
  var mainPinDefaultY = Math.round(pinMain.offsetTop + PIN_MAIN_HEIGHT / 2);
  addressForm.value = mainPinDefaultX + ', ' + mainPinDefaultY;
  if (currentCardOffer) {
    currentCardOffer.remove();
  }
  deleteMapPins();
  pinMain.addEventListener('mouseup', activatePage);
}

// Работа с формой
function onShowSuccess() {
  messageSuccess.classList.toggle('hidden', false);
  setTimeout(function () {
    onHideSuccess();
  }, 10000);
  document.addEventListener('keydown', onHideSuccessEscPress);
}

function onHideSuccess() {
  document.removeEventListener('keydown', onHideSuccessEscPress);
  messageSuccess.classList.toggle('hidden', true);
}

function onHideSuccessEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onHideSuccess();
  }
}

function roomGuestMatch() {
  var capacityValue = adForm.capacity.value;
  var roomValue = adForm.rooms.value;
  var guestMatch = offerRoomsMatchForm[roomValue];
  var resultMatch = false;
  guestMatch.forEach(function (item) {
    if (item === capacityValue) {
      resultMatch = true;
    }
  });

  if (!resultMatch) {
    adForm.capacity.style.boxShadow = '0 0 2px 2px #8e1700';
    adForm.capacity.setCustomValidity('Количество гостей превышает количество комнат');
  } else {
    adForm.capacity.style.boxShadow = '';
    adForm.capacity.setCustomValidity('');
  }
}

function onSubmitCheckValid() {
  roomGuestMatch();
  if (!adForm.title.checkValidity()) {
    adForm.title.style.boxShadow = '0 0 2px 2px #8e1700';
  }
  if (!adForm.price.checkValidity()) {
    adForm.price.style.boxShadow = '0 0 2px 2px #8e1700';
  }
}

// ======================================================
// Замена минимальной цены в зависимости от типа объекта
adForm.type.addEventListener('change', function () {
  adForm.price.min = minPriceType[adForm.type.value];
});
adForm.price.addEventListener('focus', function () {
  adForm.price.min = minPriceType[adForm.type.value];
  adForm.price.style.boxShadow = '';
});

// Синхронизация времени checkIn и checkOut
adForm.timein.addEventListener('change', function () {
  adForm.timeout.value = adForm.timein.value;
});
adForm.timeout.addEventListener('change', function () {
  adForm.timein.value = adForm.timeout.value;
});

// Проверка соответсвия комнат и гостей при изменении комнат или гостей
adForm.capacity.addEventListener('change', function () {
  roomGuestMatch();
});
adForm.rooms.addEventListener('change', function () {
  roomGuestMatch();
});

adForm.title.addEventListener('change', function () {
  adForm.title.style.boxShadow = '';
});


var listOffers = createListOffers(quantityOffers);

deactivatePage();
pinMain.addEventListener('mouseup', setAddress);
pinMain.addEventListener('mouseup', activatePage);

submitButtonForm.addEventListener('click', onSubmitCheckValid);
resetButtonForm.addEventListener('click', deactivatePage);

adForm.addEventListener('submit', function () {
  if (adForm.checkValidity()) {
    onShowSuccess();
  } else {
    // evt.preventDefault();
    onSubmitCheckValid();
  }
});
