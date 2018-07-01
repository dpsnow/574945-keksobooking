'use strict';
(function () {
  var AMOUNT_OFFER = 5;
  var PIN_MAIN_NEEDLE = 16;
  var sectionMap = document.querySelector('.map');
  var pinMain = sectionMap.querySelector('.map__pin--main');
  var filtersMap = sectionMap.querySelector('.map__filters');
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
    MIN_LEFT: limitMapArea.LEFT - pinMain.offsetWidth / 2,
    MAX_LEFT: limitMapArea.RIGHT - pinMain.offsetWidth / 2,
    START_TOP: pinMain.style.top,
    START_LEFT: pinMain.style.left
  };
  var dataOffer = [];
  var defaultValueFilters = {
    'type': 'any',
    'price': 'any',
    'rooms': 'any',
    'guests': 'any',
    'features': {
      'wifi': false,
      'dishwasher': false,
      'parking': false,
      'washer': false,
      'elevator': false,
      'conditioner': false
    }
  };

  window.selectedFilters = {};

  var housingPrice = {
    LOW: 10000,
    HIGH: 50000
  };

  function hideFilters(value) {
    Array.prototype.forEach.call(filtersMap.children, function (child) {
      window.utils.disabledNode(child, value);
      if (child.classList.contains('map__features')) {
        Array.prototype.forEach.call(child.children, function (item) {
          window.utils.disabledNode(item, value);
        });
      }
    });
  }

  // записать выбранные фиильтры
  function onChangeFilter(evt) {
    if (evt.target.name === 'features') {
      window.selectedFilters.features[evt.target.value] = evt.target.checked;
    } else {
      var newName = evt.target.name.slice(evt.target.name.indexOf('-') + 1);
      window.selectedFilters[newName] = evt.target.value;
    }
    window.utils.debounce(renderNewOffer);
  }

  function renderNewOffer() {
    window.card.onClose();
    window.pins.delete();
    window.pins.render(filterOffers(dataOffer), AMOUNT_OFFER);
  }

  function checkFilterForAny(item, filter, callback) {
    if (window.selectedFilters[filter] !== 'any') {
      console.log('ПУСК!==============');
      return callback(item, filter);
    } else {
      console.log('================ВЫХОД! Фильтр: ' + filter + ' = any');
      return true;
    }
  }

  function filterOnce(item, filter) {
    console.log('объявление:  - ', item);
    if (window.selectedFilters[filter] !== 'any') {
      switch (filter) {
        case 'price':
          console.log('ЦЕНА! Фильтр: ', filter, ' = ', window.selectedFilters[filter]);
          switch (window.selectedFilters[filter]) {
            case 'low': return item.offer.price < housingPrice.LOW;
            case 'middle': return item.offer.price >= housingPrice.LOW && item.offer.price < housingPrice.HIGH;
            case 'high': return item.offer.price >= housingPrice.HIGH;
            default: return false;
          }
        case 'features':
          console.log('ФИЧИ!', filter);
          for (var feature in window.selectedFilters.features) {
            if (Object.prototype.hasOwnProperty.call(window.selectedFilters.features, feature)) {
              if (window.selectedFilters.features[feature] === true && !item.offer.features.includes(feature)) {
                console.log('Фича: ', feature, ' = ', window.selectedFilters.features[feature]);
                return false;
              }
            }
          }
          return true;
        default:
          console.log('DEFAULT! Фильтр: ', filter, ' = ', window.selectedFilters[filter]);
          return window.selectedFilters[filter] === item.offer[filter].toString();
      }
    } else {
      console.log('ВЫХОД! Фильтр: ' + filter + ' = any');
      return true;
    }
  }


  function filterOffers(dataOffer) {
    console.log('===================================');
    console.log('Проверка фильтров');
    console.log('dataOffer', dataOffer);

    return dataOffer.
      filter(function (item) {
        return checkFilterForAny(item, 'type', filterOnce);
      }).
      filter(function (item) {
        return checkFilterForAny(item, 'price', filterOnce);
      }).
      filter(function (item) {
        return checkFilterForAny(item, 'rooms', filterOnce);
      }).
      filter(function (item) {
        return checkFilterForAny(item, 'guests', filterOnce);
      }).
      filter(function (item, i) {
        return filterOnce(item, 'features', i);
      });
  }

  filtersMap['housing-type'].addEventListener('change', onChangeFilter);
  filtersMap['housing-price'].addEventListener('change', onChangeFilter);
  filtersMap['housing-rooms'].addEventListener('change', onChangeFilter);
  filtersMap['housing-guests'].addEventListener('change', onChangeFilter);
  filtersMap['features'].forEach(function (item) {
    item.addEventListener('change', onChangeFilter);
  });


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
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      sectionMap.removeEventListener('mousemove', onMouseMove);
      sectionMap.removeEventListener('mouseup', onMouseUp);
    }

    sectionMap.addEventListener('mousemove', onMouseMove);
    sectionMap.addEventListener('mouseup', onMouseUp);
  }

  window.pinMain = { // Сброс маркера
    reset: function () {
      pinMain.style.left = PinMainParam.START_LEFT;
      pinMain.style.top = PinMainParam.START_TOP;
    }
  };

  window.map = {
    init: function (loadData) {
      pinMain.addEventListener('mousedown', onPinMainMousedown);
      pinMain.removeEventListener('mousedown', window.page.activate);
      pinMain.addEventListener('mousemove', window.utils.onSetAddress);
      sectionMap.classList.toggle('map--faded', false);
      dataOffer = loadData;
      window.pins.render(window.utils.getArrayRandomLength(loadData, AMOUNT_OFFER));
      hideFilters(false); // активировать фильтры
    },
    deactivate: function () {
      pinMain.addEventListener('mousedown', onPinMainMousedown);
      pinMain.addEventListener('mousedown', window.page.activate);
      pinMain.removeEventListener('mousemove', window.utils.onSetAddress);
      sectionMap.classList.toggle('map--faded', true);
      hideFilters(true); // спрятать фильтры
      window.pins.delete(); // удалить все метки на карте
      window.pinMain.reset(); // вернуть главную метку в центр
      window.card.onClose(); // закрыть карточку объявления
      filtersMap.reset();
      window.selectedFilters = defaultValueFilters;
    }
  };
})();
