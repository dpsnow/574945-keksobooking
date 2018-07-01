'use strict';
(function () {
  var AMOUNT_OFFER = 5;
  var filtersMap = document.querySelector('.map__filters');

  var dataOffer = [];
  window.selectedFeatures = {
    'wifi': null,
    'dishwasher': null,
    'parking': null,
    'washer': null,
    'elevator': null,
    'conditioner': null
  };

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
    console.log('evt.target', evt.target);
    console.log('evt.target.name', evt.target.name);
    console.log('evt.target.value', evt.target.value);
    if (evt.target.name === 'features') {
      window.selectedFeatures[evt.target.value] = evt.target.checked;
    }
    window.utils.debounce(renderNewOffer);
  }

  function renderNewOffer() {
    window.card.onClose();
    window.pins.delete();
    window.pins.render(filterOffers(dataOffer), AMOUNT_OFFER);
  }

  function checkFilterForAny(item, filter, callback) {
    console.log('f(checkFilterForAny) --- Проверяем фильтр: ', filter.name);
    if (filter.value !== 'any') {
      console.log('filter', filter);
      return callback(item, filter);
    } else {
      console.log('f(checkFilterForAny) --- ВЫХОД! Фильтр: ' + filter.name + ' = any');
      return true;
    }
  }

  function filterOnce(item, filter, i) {

    console.log('f(filterOnce) --- ПУСК!-----------------');
    console.log('filter', filter);
    console.log('filter.name', filter.name);
    console.log('filter.id', filter.id);
    console.log('объявление: [', i, '] - ', item);
    switch (filter.id) {
      case 'housing-price':
        console.log('ЦЕНА! Фильтр: ', filter.name, ' = ', filter.value);
        switch (filter.value) {
          case 'low': return item.offer.price < housingPrice.LOW;
          case 'middle': return item.offer.price >= housingPrice.LOW && item.offer.price < housingPrice.HIGH;
          case 'high': return item.offer.price >= housingPrice.HIGH;
          default: return false;
        }
      case 'housing-features':
        console.log('ФИЧИ!', filter);
        for (var feature in window.selectedFeatures) {
          if (Object.prototype.hasOwnProperty.call(window.selectedFeatures, feature)) {
            if (window.selectedFeatures[feature] === true && !item.offer.features.includes(feature)) {
              console.log('Фича: ', feature, ' = ', window.selectedFeatures[feature]);
              return false;
            }
          }
        }
        return true;
      default:
        console.log('DEFAULT! Фильтр: ', filter.name, ' = ', filter.value);
        // console.log('item.offer.', item.offer);
        var newfilterName = filter.name.slice(filter.name.indexOf('-') + 1);
        console.log('item.offer[newfilterName]', item.offer[newfilterName]);
        return filter.value === item.offer[newfilterName].toString();
    }
  }


  function filterOffers(dataOffer) {
    console.log('===================================');
    console.log('Проверка фильтров');
    console.log('dataOffer', dataOffer);

    return dataOffer.
      filter(function (item, i) {
        console.log('===================================');
        console.log(i, 'ая - ПРОВЕРКА ПО ТИПУ ЖИЛЬЯ');
        return checkFilterForAny(item, filtersMap['housing-type'], filterOnce);
      }).
      filter(function (item, i) {
        console.log('===================================');
        console.log(i, 'ая - ПРОВЕРКА ПО ЦЕНЕ ЖИЛЬЯ');
        return checkFilterForAny(item, filtersMap['housing-price'], filterOnce);
      }).
      filter(function (item, i) {
        console.log('===================================');
        console.log(i, 'ая - ПРОВЕРКА ПО КОМНАТАМ');
        return checkFilterForAny(item, filtersMap['housing-rooms'], filterOnce);
      }).
      filter(function (item, i) {
        console.log('===================================');
        console.log(i, 'ая - ПРОВЕРКА ПО ГОСТЯМ');
        return checkFilterForAny(item, filtersMap['housing-guests'], filterOnce);
      }).
      filter(function (item, i) {
        console.log('===================================');
        console.log(i, 'ая - ПРОВЕРКА ПО ФИЧАМ');
        return filterOnce(item, filtersMap['housing-features'], i);
      });
  }

  function addListener() {
    filtersMap['housing-type'].addEventListener('change', onChangeFilter);
    filtersMap['housing-price'].addEventListener('change', onChangeFilter);
    filtersMap['housing-rooms'].addEventListener('change', onChangeFilter);
    filtersMap['housing-guests'].addEventListener('change', onChangeFilter);
    filtersMap['features'].forEach(function (item) {
      if (item.nodeName === 'INPUT') {
        item.addEventListener('change', onChangeFilter);
      }
    });
  }

  function removeListener() {
    filtersMap['housing-type'].removeEventListener('change', onChangeFilter);
    filtersMap['housing-price'].removeEventListener('change', onChangeFilter);
    filtersMap['housing-rooms'].removeEventListener('change', onChangeFilter);
    filtersMap['housing-guests'].removeEventListener('change', onChangeFilter);
    filtersMap['features'].forEach(function (item) {
      if (item.nodeName === 'INPUT') {
        item.removeEventListener('change', onChangeFilter);
      }
    });
  }


  window.filters = {
    activate: function (loadData) {
      dataOffer = loadData;
      hideFilters(false);
      addListener();
    },
    deactivate: function () {
      filtersMap.reset();
      hideFilters(true);
      removeListener();
    }
  };
})();
