'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 1000;
  var pin = document.querySelector('.map__pin--main');
  var addressField = document.querySelector('.ad-form').address;
  var lastTimeout;

  window.utils = {
    getRandomIntegerRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
    * Получение нового перемешаного массива заданного размера
    * @param {Array} array исходный массив
    * @param {Number} length размер массива
    * @return {Array} Новый массив
    */
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
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    /**
    * Получение координат главного пина, с учетом смещения у псевдоэлемента.
    * @return {Object} Координаты главной метки.
    */
    getAddressPin: function () {
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

    /**
    * Запись координат главного пина в поле формы "Адрес"
    */
    onSetAddress: function () {
      addressField.readOnly = true;
      var coord = window.utils.getAddressPin();
      addressField.value = Math.round(coord.x) + ', ' + Math.round(coord.y);
    },

    /**
    * Переключение доступности узла.
    * @param {Node} elem - Выбранный узел.
    * @param {Boolean} value - Значение disabled.
    */
    disabledNode: function (elem, value) {
      elem.disabled = value;
      elem.style.cursor = value ? 'default' : '';
    },
    debounce: function (fun) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    }
  };
})();
