'use strict';

(function () {
  var quantityOffers = 8;
  // Функция генерации объекта
  function createObject(index) {
    var locationX = window.util.getRandomIntegerRange(300, 900);
    var locationY = window.util.getRandomIntegerRange(130, 630);
    var objectRoom = {
      'author': {
        'avatar': 'img/avatars/user0' + (index + 1) + '.png'
      },
      'offer': {
        'title': window.dataOffer.title[index],
        'address': locationX + ', ' + locationY,
        'price': window.util.getRandomIntegerRange(1000, 1000000),
        'type': window.dataOffer.type[window.util.getRandomIntegerRange(0, window.dataOffer.type.length - 1)],
        'rooms': window.util.getRandomIntegerRange(1, 5),
        'guests': window.util.getRandomIntegerRange(1, 35),
        'checkin': window.dataOffer.checkIn[window.util.getRandomIntegerRange(0, window.dataOffer.checkIn.length - 1)],
        'checkout': window.dataOffer.checkOut[window.util.getRandomIntegerRange(0, window.dataOffer.checkOut.length - 1)],
        // Случайное кол-во, случаные значения, не должны повторяться
        'features': window.util.getArrayRandomLength(window.dataOffer.features, window.util.getRandomIntegerRange(1, window.dataOffer.features.length - 1)),
        'description': '',
        // Случ. порядок
        'photos': window.util.getArrayRandomLength(window.dataOffer.photos, window.dataOffer.photos.length)
      },
      'location': {
        'x': locationX,
        'y': locationY,
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
  window.listOffers = createListOffers(quantityOffers);
})();
