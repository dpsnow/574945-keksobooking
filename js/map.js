'use strict';

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
var offerCheckInOut = ['12:00', '13:00', '14:00'];
var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner', 'description', 'пустая строка'];
var offerPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


// Функция случайного числа (с повтором)
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
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
      'title': offerTitle[getRandomInteger(0, offerCheckInOut.length)],
      'address': getRandomInteger(300, 900) + ', ' + getRandomInteger(130, 630),
      'price': getRandomInteger(1000, 1000000),
      'type': offerType[getRandomInteger(0, offerType.length)],
      'rooms': getRandomInteger(1, 5),
      'guests': getRandomInteger(1, 35),
      'checkin': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length)],
      'checkout': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length)],
      // Х Случайное кол-во, случаные значения, не должны повторяться
      'features': ['parking', 'washer', 'elevator'],
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

// Массив, состоящий из 8 сгенерированных JS объектов
function createOffers(quantityElements) {
  var listElement = [];
  for (var i = 0; i < quantityElements - 1; i++) {
    listElement[i] = createObject();
  }
  return listElement;
}
var listOffers = createOffers(8, createObject());

// Функция создания элемента из шаблона
function createElement(elementTemplate) {
  var element = elementTemplate.cloneNode(true);
  return element;
}

// Функция изменения атрибутов шаблона
// function changedAttrsElement(element, options) {
//   for (var i = 0; i < options.length; i++) {
//     element[options[i].name] = options[i].value;
//   }
// }

function changedAttrsElement(options) {
  for (var i = 0; i < options.length; i++) {
    options[i].element[options[i].name] = options[i].value;
  }
}

// Функция изменения атрибутов шаблона через setAttribute
/* function changedAttrsElement(element, options) {
  for (var i = 0; i < options.length; i++) {
    element.setAttribute([options[i].name], options[i].value);
  }
}*/


// DOM узел для работы с шаблонами
var sectionMap = document.querySelector('.map');

// Шаблон указателя (pin)
var MapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');


// Отрисуйте сгенерированные DOM-элементы в блок .map__pins
var MapPinsList = document.createDocumentFragment();

for (var i = 0; i < listOffers.length; i++) {
  var pin = createElement(MapPinTemplate, listOffers[i]);

  // Не учтены размеры pin
  pin.style.left = listOffers[i].location.x + 'px';
  pin.style.top = listOffers[i].location.y + 'px';

  // Не работает, pin.style.top !== pin[style.top],
  //                    должно быть pin[style][top]

  // changedAttrsElement(pin, [
  //   {
  //     name: 'style.left',
  //     value: listOffers[i].location.x + 'px'
  //   },
  //   {
  //     name: 'style.top',
  //     value: listOffers[i].location.y + 'px'
  //   }
  // ]);

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


  MapPinsList.appendChild(pin);
}

sectionMap.querySelector('.map__pins').appendChild(MapPinsList);

// insertElementBefore(sectionMap, MapPinTemplate, document.querySelector('.map__filters-container'));


// Шаблон карточки
var MapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var MapCard = createElement(MapCardTemplate, listOffers[getRandomInteger(0, listOffers.length)]);

var exampleOffer = listOffers[getRandomInteger(0, listOffers.length)];
console.log(exampleOffer);

changedAttrsElement([
  {
    element: MapCard,
    name: 'style',
    value: 'left: 50px'
  },
  {
    element: MapCard.querySelector('.popup__title'),
    name: 'textContent',
    value: exampleOffer.offer.title
  },
  {
    element: MapCard.querySelector('.popup__text--address'),
    name: 'textContent',
    value: exampleOffer.offer.address
  },
  {
    element: MapCard.querySelector('.popup__text--price'),
    name: 'textContent',
    value: exampleOffer.offer.price + ' р/ночь'
  },
  {
    // Изменить вывод информации, например Бунгало для bungalo
    // value: exampleOffer.offer.type
    element: MapCard.querySelector('.popup__type'),
    name: 'textContent',
    value: nameReplacement(exampleOffer.offer.type)
  },
  {
    element: MapCard.querySelector('.popup__text--capacity'),
    name: 'textContent',
    value: exampleOffer.offer.rooms + ' комнаты для ' + exampleOffer.offer.guests + ' гостей'
  },
  {
    element: MapCard.querySelector('.popup__text--time'),
    name: 'textContent',
    value: 'Заезд после ' + exampleOffer.offer.checkin + ', выезд до ' + exampleOffer.offer.checkout
  },
  {
    // Создать узел типа <li class="popup__feature popup__feature--parking"></li>
    element: MapCard.querySelector('.popup__features'),
    name: 'textContent',
    value: exampleOffer.offer.features
  },
  {
    element: MapCard.querySelector('.popup__description'),
    name: 'textContent',
    value: exampleOffer.offer.description
  },
  {
    // В блок выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
    element: MapCard.querySelector('.popup__photos'),
    name: 'textContent',
    value: exampleOffer.offer.photos
  },
  {
    element: MapCard.querySelector('.popup__avatar'),
    name: 'src',
    value: exampleOffer.author.avatar
  },
]);

sectionMap.insertBefore(MapCard, document.querySelector('.map__filters-container'));

function nameReplacement(changeName) {
  if (changeName == 'bungalo') {
    return 'Бунгало';
  } else {
    return changeName;
  }
}

