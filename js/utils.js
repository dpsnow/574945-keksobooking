'use strict';

(function () {
  var ESC_KEYCODE = 27;


  window.utils = {
    // Функция случайного числа из диапазона
    getRandomIntegerRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    // Функция получения массива заданной длинны c перетасовкой.
    getArrayRandomLength: function (array, length) {
      var shufleArray = array.slice();
      var temporaryValue;
      var randomIndex;

      for (var currentIndex = shufleArray.length - 1; currentIndex > 0; currentIndex--) {
        randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        randomIndex = window.utils.getRandomIntegerRange(0, currentIndex);
        temporaryValue = shufleArray[currentIndex];
        shufleArray[currentIndex] = shufleArray[randomIndex];
        shufleArray[randomIndex] = temporaryValue;
      }
      shufleArray.length = length;
      return shufleArray;
    },
    // Функция првоерки нажания ESC
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    /* NNNgetAddress: function (elem) {
      var metrics = getComputedStyle(elem, '::after');

      var position = metrics.transform.slice(metrics.transform.indexOf('(') + 1, metrics.transform.indexOf(')')).split(',');

      position = +position[position.length - 1];

      var delta = parseFloat(metrics.borderTopWidth);

      var left = parseFloat(elem.style.left) + (elem.offsetWidth / 2);

      var top = position === -30 ? parseFloat(elem.style.top) + elem.offsetHeight / 2 : parseFloat(elem.style.top) + elem.offsetHeight + delta;

      return { x: left, y: top };
    }, */
    getAddressPin: function () {
      var pin = document.querySelector('.map__pin--main');
      var needle = getComputedStyle(pin, '::after');
      var needleHeight = Math.round(parseFloat(needle.borderTopWidth));
      var needleShift = needle.transform.slice(needle.transform.indexOf('(') + 1, needle.transform.indexOf(')')).split(',');
      needleShift = +needleShift[needleShift.length - 1];
      var address = {
        x: parseFloat(pin.style.left) + (pin.offsetWidth / 2),
        y: (needleShift === -30) ? (parseFloat(pin.style.top) + pin.offsetHeight / 2) : (parseFloat(pin.style.top) + pin.offsetHeight + needleHeight + needleShift)
      };
      return address;
    },
    onSetAddress: function () {
      var addressField = document.querySelector('.ad-form').address;
      addressField.readOnly = true;
      var coord = window.utils.getAddressPin();
      addressField.value = Math.round(coord.x) + ', ' + Math.round(coord.y);
    },
    disabledNode: function (elem, value) {
      elem.disabled = value;
      elem.style.cursor = value ? 'default' : '';
    }
  };
})();
