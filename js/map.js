'use strict';
var quantityOffers = 8;
// DOM узел для работы с шаблонами
var sectionMap = document.querySelector('.map');
// Шаблон указателя (pin)
var MapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var containerForMapPins = sectionMap.querySelector('.map__pins');
var PIN_WEIGHT = 50;
var PIN_HEIGHT = 70;

var mapPinMain = document.querySelector('.map__pin--main');
var сardOfferContainer = sectionMap.querySelector('.map__filters-container');

// Шаблон карточки
var OfferCardTemplate = document.querySelector('template').content.querySelector('.map__card');


// Данные для объекта
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
var offerTypeRenamed = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var offerCheckIn = ['12:00', '13:00', '14:00'];
var offerCheckOut = ['12:00', '13:00', '14:00'];
var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var offerPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];


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
    temporaryValue = shufleArray[currentIndex];
    shufleArray[currentIndex] = shufleArray[randomIndex];
    shufleArray[randomIndex] = temporaryValue;
  }
  shufleArray.length = length;
  return shufleArray;
}

// Функция поиска соответствий
function searchMatch(value, listValue, listMatch) {
  var newValue;
  for (var i = 0; i < listValue.length; i++) {
    if (value === listValue[i]) {
      newValue = listMatch[i];
    }
  }
  return newValue;
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
function createMapPinList(data, template) {
  var MapPinsList = document.createDocumentFragment();
  var pin;
  for (var i = 0; i < data.length; i++) {
    // Создание копий pin из шаблона
    pin = template.cloneNode(true);
    // Изменение положения метки (pin) на основе location указанного в arr
    pin.style.left = data[i].location.x - PIN_WEIGHT / 2 + 'px';
    pin.style.top = data[i].location.y - PIN_HEIGHT + 'px';
    // Изменение атрибутов изображения метки на основе указанных в arr
    pin.querySelector('img').src = data[i].author.avatar;
    pin.querySelector('img').alt = data[i].offer.title;
    // Добавление сгенирированной метки в DocumentFragment
    MapPinsList.appendChild(pin);
  }
  return MapPinsList;
}

// Создание карточки объявления
function createCardOffer(data, template) {
  var сardOffer = template.cloneNode(true);
  // Изменение текста шаблона объявления на основе указаного объявления
  сardOffer.querySelector('.popup__title').textContent = data.offer.title;
  сardOffer.querySelector('.popup__text--address').textContent = data.offer.address;
  сardOffer.querySelector('.popup__text--price').textContent = data.offer.price + ' р/ночь';
  // В задании: В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
  сardOffer.querySelector('.popup__type').textContent = searchMatch(data.offer.type, offerType, offerTypeRenamed);
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
  return сardOffer;
}

function renderElement(parentContainer, element, beforeContainer) {
  parentContainer.insertBefore(element, beforeContainer);
}

// Создание списка объявлений
// Дальше использовать эту переменную для отрисовки элементов, как-будто объявления приходят с сервера
var listOffers = createListOffers(quantityOffers);

// Отрисовка сгенерированных меток (pin) в блок .map__pins
renderElement(
    containerForMapPins,
    createMapPinList(listOffers, MapPinTemplate),
    mapPinMain
);

// Отрисовка случайной карточки объявления в блок перед блоком.map__filters-container
renderElement(
    sectionMap,
    createCardOffer(listOffers[getRandomIntegerRange(0, quantityOffers - 1)], OfferCardTemplate),
    сardOfferContainer
);
