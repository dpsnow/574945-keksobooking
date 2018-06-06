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
var offerTypeRenamed = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var offerCheckInOut = ['12:00', '13:00', '14:00'];
var offerFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner', 'description', 'пустая строка'];
var offerPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


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
      'title': offerTitle[getRandomInteger(0, offerCheckInOut.length)],
      'address': getRandomInteger(300, 900 + 1) + ', ' + getRandomInteger(130, 631),
      'price': getRandomInteger(1000, 1000001),
      'type': offerType[getRandomInteger(0, offerType.length - 1)],
      'rooms': getRandomInteger(1, 5),
      'guests': getRandomInteger(1, 35),
      'checkin': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length - 1)],
      'checkout': offerCheckInOut[getRandomInteger(0, offerCheckInOut.length - 1)],
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



// УБРАТЬ
// Функция создания элемента из шаблона
// function createElement(elementTemplate) {
//   var element = elementTemplate.cloneNode(true);
//   return element;
// }

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






/*
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

*/

// =====================================================================
// функцию генерации случайных данных,
// функцию создания DOM-элемента на основе JS-объекта,
// функцию заполнения блока DOM-элементами на основе массива JS-объектов

// 1.Создайте массив, состоящий из 8 сгенерированных JS объектов
// 2.На основе данных, созданных в первом пункте, отрисуйте в блок .map__pins, сгенерированные DOM-элементы соответствующие меткам на карте, и заполните их данными из массива.Для вставки элементов используйте DocumentFragment
// 3.Из сгенерированного массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент

function worker() {
  // 1 - Создать массив объектов из объявлений (offer)
  var quantityElements = 8;
  var listOffers = [];
  for (var i = 0; i < quantityElements; i++) {
    listOffers[i] = createObject();
  }
  // DOM узел для работы с шаблонами
  var sectionMap = document.querySelector('.map');

  // Создание меток на карте (pin)
  var MapPinsList = document.createDocumentFragment();
  // Шаблон указателя (pin)
  var MapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var PIN_WEIGHT = 50;
  var PIN_HEIGHT = 70;

  for (i = 0; i < listOffers.length; i++) {
    // Создание копий pin из шаблона
    var pin = MapPinTemplate.cloneNode(true);
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

  // Cоздание карточки объявления (offer) на основе случайного объекта из списка
  // Шаблон карточки
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // Создание копии карточки объявления из шаблона
  var MapCard = mapCardTemplate.cloneNode(true);

}

worker();
