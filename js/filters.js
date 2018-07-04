'use strict';
(function () {
  var AMOUNT_OFFER = 5;
  var filtersMap = document.querySelector('.map__filters');

  var dataOffer = [];
  window.selectedFeatures = {};

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

  function onChangeFilter(evt) {
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
    if (filter.value !== 'any') {
      return callback(item, filter);
    } else {
      return true;
    }
  }

  function filterOnce(item, filter) {
    switch (filter.id) {
      case 'housing-price':
        switch (filter.value) {
          case 'low': return item.offer.price < housingPrice.LOW;
          case 'middle': return item.offer.price >= housingPrice.LOW && item.offer.price < housingPrice.HIGH;
          case 'high': return item.offer.price >= housingPrice.HIGH;
          default: return false;
        }
      case 'housing-features':
        for (var feature in window.selectedFeatures) {
          if (Object.prototype.hasOwnProperty.call(window.selectedFeatures, feature)) {
            if (window.selectedFeatures[feature] === true && !item.offer.features.includes(feature)) {
              return false;
            }
          }
        }
        return true;
      default:
        var newfilterName = filter.name.slice(filter.name.indexOf('-') + 1);
        return filter.value === item.offer[newfilterName].toString();
    }
  }


  function filterOffers(array) {
    return array.
      filter(function (item) {
        return checkFilterForAny(item, filtersMap['housing-type'], filterOnce)
          && checkFilterForAny(item, filtersMap['housing-price'], filterOnce)
          && checkFilterForAny(item, filtersMap['housing-rooms'], filterOnce)
          && checkFilterForAny(item, filtersMap['housing-guests'], filterOnce)
          && filterOnce(item, filtersMap['housing-features']);
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
      window.selectedFeatures = {}; // сброс выбранных фич
      hideFilters(true);
      removeListener();
    }
  };
})();
