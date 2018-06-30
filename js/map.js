'use strict';
(function () {
  var a = [];
  var limitArea = { // 180, 680
    TOP: 130,
    BOTTOM: 630
  };
  var sectionMap = document.querySelector('.map');
  var pinMain = sectionMap.querySelector('.map__pin--main');
  var pinMainStart = {
    top: pinMain.style.top,
    left: pinMain.style.left,
  };
  var pinMainWidth = pinMain.offsetWidth;
  var pinMainHeight = pinMain.offsetHeight;
  var pinMainNeedle = 16;
  var filtersMap = document.querySelector('.map__filters');

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

  window.selectFilters = {
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

  // 'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']

  // записать выбранные фиильтры
  function onChangeFilter(evt) {
    console.log(evt.target);
    console.log('evt.target.name', evt.target.name);
    console.log('evt.target.value', evt.target.value);
    /* if (evt.target.name === 'features') {
      if (evt.target.checked === true) {
        console.log('value', evt.target.value, 'check', evt.target.checked);
        window.selectFilters['features'].push(evt.target.value);
      } else {
        if (window.selectFilters['features'].includes(evt.target.value)) {
          window.selectFilters['features'].splice()
        };
      }
    } else {
      var newName = evt.target.name.slice(evt.target.name.indexOf('-') + 1);
      window.selectFilters[newName] = evt.target.value;
    } */
    if (evt.target.name === 'features') {
      window.selectFilters.features[evt.target.value] = evt.target.checked;
    } else {
      var newName = evt.target.name.slice(evt.target.name.indexOf('-') + 1);
      window.selectFilters[newName] = evt.target.value;
    }

    var b = filtrateOffers(window.dataOffer);

    window.pins.delete();
    window.card.onClose();
    window.pins.render(b);
  }

  function selectFilterType(item, filter, index) {
    var housingPrice = {
      'low': 10000,
      'high': 50000
    };
    console.log('объявление: ', index, ' - ', item);
    switch (filter) {
      case 'price':
        console.log('ЦЕНА! Фильтр: ', filter, ' = ', window.selectFilters[filter]);
        switch (window.selectFilters[filter]) {
          case 'low': return item.offer.price < 10000;
          case 'middle': return item.offer.price >= 10000 && item.offer.price < 50000;
          case 'high': return item.offer.price >= 50000;
          default: return false;
        }
      case 'features':
        console.log('ФИЧИ!', filter);
        console.log('item!', item);
        for (var feature in window.selectFilters.features) {
          if (Object.prototype.hasOwnProperty.call(window.selectFilters.features, feature)) {
            // debugger;

            if (window.selectFilters.features[feature] === true) {
              console.log('Фича: ', feature, ' = ', window.selectFilters.features[feature]);
              if (!item.offer.features.includes(feature)) {
                return false;
              }
            }
          }
        }
        return true;
      default:
        console.log('DEFAULT! Фильтр: ', filter, ' = ', window.selectFilters[filter]);
        return window.selectFilters[filter] === item.offer[filter].toString();
    }
  }


  function filtrateOffers(dataOffer) {
    console.log('===================================');
    console.log('Проверка фильтров');
    console.log('dataOffer', dataOffer);

    window.updateOffers = dataOffer.
      filter(function (item, i) {
        if (window.selectFilters['type'] === 'any') {
          console.log('ВЫХОД! Фильтр: type = any');
          return true;
        } else {
          console.log('Функция возвращает:', selectFilterType(item, 'type', i));
          return selectFilterType(item, 'type', i);
        }
      }).
      filter(function (item, i) {
        if (window.selectFilters['price'] === 'any') {
          console.log('ВЫХОД! Фильтр: price = any');
          return true;
        } else {
          return selectFilterType(item, 'price', i);
        }
      }).
      filter(function (item, i) {
        if (window.selectFilters['rooms'] === 'any') {
          console.log('ВЫХОД! Фильтр: rooms = any');
          return true;
        } else {
          return selectFilterType(item, 'rooms', i);
        }
      }).
      filter(function (item, i) {
        if (window.selectFilters['guests'] === 'any') {
          console.log('ВЫХОД! Фильтр: guests = any');
          return true;
        } else {
          return selectFilterType(item, 'guests', i);
        }
      }).
      filter(function (item, i) { //показать только те где есть фильтр
        return selectFilterType(item, 'features', i);
      });

    return updateOffers;
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

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var pinMainCoords = {
        x: moveEvt.clientX - sectionMap.offsetLeft,
        y: moveEvt.clientY + window.scrollY,
        MIN_Y: limitArea.TOP - pinMainHeight / 2 - pinMainNeedle,
        MAX_Y: limitArea.BOTTOM - pinMainHeight / 2 - pinMainNeedle
      };

      var left = pinMainCoords.x - pinMainWidth / 2;
      var top = pinMainCoords.y - pinMainHeight / 2;


      if (pinMainCoords.y <= pinMainCoords.MIN_Y) {
        top = pinMainCoords.MIN_Y - pinMainHeight / 2;
      }
      if (pinMainCoords.y >= pinMainCoords.MAX_Y) {
        top = pinMainCoords.MAX_Y - pinMainHeight / 2;
      }
      pinMain.style.left = left + 'px';
      pinMain.style.top = top + 'px';
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
      pinMain.style.left = pinMainStart.left;
      pinMain.style.top = pinMainStart.top;
    }
  };

  window.map = {
    init: function (dataOffer) {
      pinMain.removeEventListener('mousedown', window.page.activate);
      sectionMap.classList.toggle('map--faded', false);
      // window.pins.render(dataOffer);
      window.dataOffer = dataOffer.slice(0);
      window.pins.render(dataOffer);
      hideFilters(false); // активировать фильтры
      pinMain.addEventListener('mousedown', onPinMainMousedown);
      pinMain.addEventListener('mousemove', window.utils.onSetAddress);
    },
    deactivate: function () {
      pinMain.removeEventListener('mousedown', onPinMainMousedown);
      pinMain.removeEventListener('mousemove', window.utils.onSetAddress);
      pinMain.addEventListener('mousedown', window.page.activate);
      sectionMap.classList.toggle('map--faded', true);
      hideFilters(true); // спрятать фильтры
      window.pins.delete(); // удалить все метки на карте
      window.pinMain.reset(); // вернуть главную метку в центр
      window.card.onClose(); // закрыть карточку объявления
      filtersMap.reset();
    }
  };
})();
