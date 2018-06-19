'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
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
        randomIndex = window.util.getRandomIntegerRange(0, currentIndex);
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
  };
})();
