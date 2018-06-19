'use strict';
(function () {
  // FIXME: используется для маркеров(pin.js), карточек(card-offer.js) и главого маркера (pin-main.js)
  var sectionMap = document.querySelector('.map');
  var pinMain = document.querySelector('.map__pin--main');
  var pinMainWidth = pinMain.offsetWidth;
  var pinMainHeight = pinMain.offsetHeight;
  var pinMainNeedle = 15;
  var coordsMainPin = {};
  var adForm = document.querySelector('.ad-form');
  var addressForm = adForm.address;

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // изменение координат с появлением иголки метки, после нажатия.
    coordsMainPin.y += pinMainNeedle;
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // 180, 680
      var MIN_COORDS_Y = 130;
      var MAX_COORDS_Y = 630;
      coordsMainPin = {
        x: Math.round(moveEvt.clientX - sectionMap.offsetLeft),
        y: Math.round(moveEvt.clientY + window.scrollY + pinMainHeight / 2 + pinMainNeedle)
      };

      if (coordsMainPin.y <= MIN_COORDS_Y) {
        coordsMainPin.y = MIN_COORDS_Y;
      } else {
        if (coordsMainPin.y >= MAX_COORDS_Y) {
          coordsMainPin.y = MAX_COORDS_Y;
        }
      }

      pinMain.style.left = Math.round(coordsMainPin.x - pinMainWidth / 2) + 'px';
      pinMain.style.top = Math.round(coordsMainPin.y - pinMainHeight - pinMainNeedle) + 'px';
      window.pinMain.setAddress();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      sectionMap.removeEventListener('mousemove', onMouseMove);
      sectionMap.removeEventListener('mouseup', onMouseUp);
    }

    sectionMap.addEventListener('mousemove', onMouseMove);
    sectionMap.addEventListener('mouseup', onMouseUp);
  });

  window.pinMain = {
    // Функция расчета положения метки относительно карты и размеров.
    setAddress: function () {
      addressForm.readOnly = true;
      addressForm.value = Math.round(coordsMainPin.x) + ', ' + Math.round(coordsMainPin.y);
    },
    // Сброс перемещений маркера и координат
    reset: function () {
      // Середина карты
      coordsMainPin.x = sectionMap.offsetWidth / 2;
      coordsMainPin.y = sectionMap.offsetHeight / 2 + pinMainHeight / 2;
      // pinMain.style.left = '570px';
      // pinMain.style.top = '375px';
      pinMain.style.left = Math.round(coordsMainPin.x - pinMainWidth / 2) + 'px';
      pinMain.style.top = Math.round(coordsMainPin.y - pinMainHeight / 2) + 'px';
      window.pinMain.setAddress();
    }
  };

})();
