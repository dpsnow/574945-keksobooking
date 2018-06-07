'use strict';

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
var offerCheckInOut = ['12:00', '13:00', '14:00'];
var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var offerPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


// =====================================================================
// Функция случайного числа (с повтором)
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Функция генерации объекта
function createObject() {
  var objectRoom = {
    'author': {
      // Х Не должны повторяться
      'avatar': 'img/avatars/user0' + getRandomInteger(1, 8) + '.png'
    },

    'offer': {
      // Х Не должны повторяться
      'title': offerTitle[getRandomInteger(0, offerCheckInOut.length - 1)],
      'address': getRandomInteger(300, 900) + ', ' + getRandomInteger(130, 630),
      'price': getRandomInteger(1000, 1000001),
      'type': offerType[getRandomInteger(0, offerType.length - 1)],
      'rooms': getRandomInteger(1, 5),
      'guests': getRandomInteger(1, 35),
      'checkin': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length - 1)],
      'checkout': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length - 1)],
      // Х Случайное кол-во, случаные значения, не должны повторяться
      'features': ['parking', 'washer', 'wifi', 'conditioner', 'elevator'],
      'description': '',
      // Х Случ. порядок
      'photos': ['http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    },

    'location': {
      'x': getRandomInteger(300, 900),
      'y': getRandomInteger(130, 630),
    }
  };

  return objectRoom;
}


function changedAttrsElement(options) {
  for (var i = 0; i < options.length; i++) {
    options[i].element[options[i].name] = options[i].value;
  }
}

function changeTextContent(options) {
  for (var i = 0; i < options.length; i++) {
    options[i].element.textContent = options[i].text;
  }
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
// Функция изменения атрибутов шаблона через setAttribute
/* function changedAttrsElement(element, options) {
  for (var i = 0; i < options.length; i++) {
    element.setAttribute([options[i].name], options[i].value);
  }
}*/


// =====================================================================
// =====================================================================
// =====================================================================
// функцию генерации случайных данных,
// функцию создания DOM-элемента на основе JS-объекта,
// функцию заполнения блока DOM-элементами на основе массива JS-объектов

// 1.Создайте массив, состоящий из 8 сгенерированных JS объектов
// 2.На основе данных, созданных в первом пункте, отрисуйте в блок .map__pins, сгенерированные DOM-элементы соответствующие меткам на карте, и заполните их данными из массива.Для вставки элементов используйте DocumentFragment
// 3.Из сгенерированного массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент

// 1 -- Создать массив объектов из объявлений (offer)
var quantityElements = 8;
var listOffers = [];
for (var i = 0; i < quantityElements; i++) {
  listOffers[i] = createObject();
}
// DOM узел для работы с шаблонами
var sectionMap = document.querySelector('.map');

// 2 -- Создание меток на карте (pin)
var MapPinsList = document.createDocumentFragment();
// Шаблон указателя (pin)
var MapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var PIN_WEIGHT = 50;
var PIN_HEIGHT = 70;
var pin;
for (i = 0; i < listOffers.length; i++) {
  // Создание копий pin из шаблона
  pin = MapPinTemplate.cloneNode(true);
  // Изменение положения метки (pin) на основе location (offer)
  pin.style.left = listOffers[i].location.x - PIN_WEIGHT / 2 + 'px';
  pin.style.top = listOffers[i].location.y - PIN_HEIGHT + 'px';

/*
  Не работает, pin.style.top !== pin[style.top],
                      должно быть pin[style][top]

  changedAttrsElement(pin, [
    {
      name: 'style.left',
      value: listOffers[i].location.x + 'px'
    },
    {
      name: 'style.top',
      value: listOffers[i].location.y + 'px'
    }
  ]);
*/

  // Изменение атрибутов элемента (pin) на основе объекта объявление(offer)
  changedAttrsElement([
    {
      element: pin.querySelector('img'),
      name: 'src',
      value: listOffers[i].author.avatar
    }, {
      element: pin.querySelector('img'),
      name: 'alt',
      value: listOffers[i].offer.title
    }
  ]);
  // Добавление сгенирированной метки в DocumentFragment
  MapPinsList.appendChild(pin);
}
// Отрисовка сгенерированных меток (pin) в блок .map__pins
var parentDiv = sectionMap.querySelector('.map__pins');
parentDiv.insertBefore(MapPinsList, document.querySelector('.map__pin--main'));

// 3 -- Cоздание карточки объявления (offer) на основе случайного объекта из списка
// Выбор случайного объекта объявления(offer)
var exampleOffer = listOffers[getRandomInteger(0, listOffers.length - 1)];
console.log('exampleOffer: ', exampleOffer);

// Создание шаблона карточки
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

// Создание копии карточки объявления из шаблона
var mapCard = mapCardTemplate.cloneNode(true);
// console.log('mapCard: ', mapCard);

// Изменение текста шаблона объявления на основе случайного объявления (exampleOffer)
changeTextContent([
  {
    element: mapCard.querySelector('.popup__title'),
    text: exampleOffer.offer.title
  },
  {
    element: mapCard.querySelector('.popup__text--address'),
    text: exampleOffer.offer.address
  },
  {
    element: mapCard.querySelector('.popup__text--price'),
    text: exampleOffer.offer.price + ' р/ночь'
  },
  {
    element: mapCard.querySelector('.popup__type'),
    text: searchMatch(exampleOffer.offer.type, offerType, offerTypeRenamed)
  },
  {
    element: mapCard.querySelector('.popup__text--capacity'),
    text: exampleOffer.offer.rooms + ' комнаты для ' + exampleOffer.offer.guests + ' гостей'
  },
  {
    element: mapCard.querySelector('.popup__text--time'),
    text: 'Заезд после ' + exampleOffer.offer.checkin + ', выезд до ' + exampleOffer.offer.checkout
  },
  {
    element: mapCard.querySelector('.popup__description'),
    text: exampleOffer.offer.description
  }
]);
// Изменение аватарки
changedAttrsElement([{
  element: mapCard.querySelector('.popup__avatar'),
  name: 'src',
  value: exampleOffer.author.avatar
}]);

// Выбор нужных feature.
var featuresList = mapCard.querySelector('.popup__features').children;
var match;

for (i = 0; i < featuresList.length; i++) {
  // Проверка есть ли шаблоне нужные feature из объявления (exampleOffer)
  for (var j = 0; j < exampleOffer.offer.features.length; j++) {
    match = featuresList[i].classList.contains('popup__feature--' + exampleOffer.offer.features[j]);
    if (match === true) {
      console.log('===========Совпадение найдено. : ', featuresList[i]);
      break;
    }
  }
  if (match === false) {
    console.log('===Совпадений не найдено. Удаляем: ', featuresList[i]);
    featuresList[i].remove();
  }
}

// Создание фотографий
var photoList = document.createDocumentFragment();
// Шаблон фотографии
var photoTemplate = mapCard.querySelector('.popup__photo');
var photo;
for (i = 0; i < exampleOffer.offer.photos.length; i++) {
  photo = photoTemplate.cloneNode(true);
  changedAttrsElement([
    {
      element: photo,
      name: 'src',
      value: exampleOffer.offer.photos[i]
    }
  ]);
  // Добавление сгенирированной метки в DocumentFragment
  photoList.appendChild(photo);
}
// Отрисовка сгенерированных фото
photoTemplate.remove();
var photoDiv = mapCard.querySelector('.popup__photos');
photoDiv.appendChild(photoList);

// Отрисовка созданой карточки объявления в блок .map перед блоком.map__filters-container
console.log('mapCard:', mapCard);
sectionMap.insertBefore(mapCard, sectionMap.querySelector('.map__filters-container'));

console.log('--------------------------------');
