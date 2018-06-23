'use strict';
(function () {
  var limitArea = { // 180, 680
    TOP: 130,
    BOTTOM: 630
  };
  var sectionMap = document.querySelector('.map');
  var pinMain = sectionMap.querySelector('.map__pin--main');
  var pinMainStart = {
    top: '375px',
    left: '570px',
  };
  var pinMainWidth = pinMain.offsetWidth;
  var pinMainHeight = pinMain.offsetHeight;
  var pinMainNeedle = 16;

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var pinMainCoords = {
        x: moveEvt.clientX - sectionMap.offsetLeft,
        y: moveEvt.clientY + window.scrollY,
        MIN_Y: limitArea.TOP - pinMainHeight / 2 - pinMainNeedle,
        MAX_Y: limitArea.BOTTOM - pinMainHeight / 2 - pinMainNeedle
      };

      pinMain.style.left = (pinMainCoords.x - pinMainWidth / 2) + 'px';
      if (pinMainCoords.y <= pinMainCoords.MIN_Y) {
        pinMain.style.top = (pinMainCoords.MIN_Y - pinMainHeight / 2) + 'px';
      } else {
        if (pinMainCoords.y >= pinMainCoords.MAX_Y) {
          pinMain.style.top = (pinMainCoords.MAX_Y - pinMainHeight / 2) + 'px';
        } else {
          pinMain.style.top = (pinMainCoords.y - pinMainHeight / 2) + 'px';
        }
      }
      window.form.setAddress();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.form.setAddress();
      sectionMap.removeEventListener('mousemove', onMouseMove);
      sectionMap.removeEventListener('mouseup', onMouseUp);
    }

    sectionMap.addEventListener('mousemove', onMouseMove);
    sectionMap.addEventListener('mouseup', onMouseUp);
  });

  window.pinMain = {
    // Сброс маркера
    reset: function () {
      pinMain.style.left = pinMainStart.left;
      pinMain.style.top = pinMainStart.top;
    }
  };

})();
