'use strict';
(function () {
  var AMOUNT_OFFER = 5;
  var PIN_MAIN_NEEDLE = 16;
  var sectionMap = document.querySelector('.map');
  var pinMain = sectionMap.querySelector('.map__pin--main');
  var limitMapArea = { // 180, 680
    TOP: 130,
    BOTTOM: 630,
    LEFT: 0,
    RIGHT: sectionMap.offsetWidth
  };
  var PinMainParam = {
    WIDTH: pinMain.offsetWidth,
    HEIGHT: pinMain.offsetHeight + PIN_MAIN_NEEDLE,
    MIN_TOP: limitMapArea.TOP - (pinMain.offsetHeight + PIN_MAIN_NEEDLE),
    MAX_TOP: limitMapArea.BOTTOM - (pinMain.offsetHeight + PIN_MAIN_NEEDLE),
    MIN_LEFT: Math.floor(limitMapArea.LEFT - pinMain.offsetWidth / 2),
    MAX_LEFT: Math.floor(limitMapArea.RIGHT - pinMain.offsetWidth / 2),
    START_TOP: pinMain.style.top,
    START_LEFT: pinMain.style.left
  };

  function onPinMainMousedown(evt) {
    evt.preventDefault();
    pinMain.removeEventListener('mousemove', window.page.activate);
    var pinMainPosition = {
      currentLeft: evt.clientX,
      currentTop: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: pinMainPosition.currentLeft - moveEvt.clientX,
        y: pinMainPosition.currentTop - moveEvt.clientY
      };
      pinMainPosition = {
        currentLeft: moveEvt.clientX,
        currentTop: moveEvt.clientY
      };
      var newLeft = pinMain.offsetLeft - shift.x;
      var newTop = pinMain.offsetTop - shift.y;
      newTop = (newTop < PinMainParam.MIN_TOP) ? PinMainParam.MIN_TOP : newTop;
      newTop = (newTop > PinMainParam.MAX_TOP) ? PinMainParam.MAX_TOP : newTop;
      newLeft = (newLeft < PinMainParam.MIN_LEFT) ? PinMainParam.MIN_LEFT : newLeft;
      newLeft = (newLeft > PinMainParam.MAX_LEFT) ? PinMainParam.MAX_LEFT : newLeft;
      pinMain.style.left = newLeft + 'px';
      pinMain.style.top = newTop + 'px';
      window.utils.onSetAddress();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      sectionMap.removeEventListener('mousemove', onMouseMove);
      sectionMap.removeEventListener('mouseup', onMouseUp);
    }

    sectionMap.addEventListener('mousemove', onMouseMove);
    sectionMap.addEventListener('mouseup', onMouseUp);
  }

  function resetPinMain() {
    pinMain.style.left = PinMainParam.START_LEFT;
    pinMain.style.top = PinMainParam.START_TOP;
  }

  function onEnterPress(evt) {
    window.utils.isEnterEvent(evt, window.page.activate);
  }

  window.map = {
    init: function (loadData) {
      pinMain.removeEventListener('mousedown', window.page.activate);
      document.removeEventListener('keydown', onEnterPress);
      sectionMap.classList.toggle('map--faded', false);
      window.pins.render(loadData, AMOUNT_OFFER);
      window.filters.activate(loadData);
    },
    deactivate: function () {
      pinMain.addEventListener('mousedown', onPinMainMousedown);
      pinMain.addEventListener('mousedown', window.page.activate);
      document.addEventListener('keydown', onEnterPress);
      sectionMap.classList.toggle('map--faded', true);
      window.pins.delete();
      resetPinMain();
      window.card.onClose();
      window.filters.deactivate();
    }
  };
})();
