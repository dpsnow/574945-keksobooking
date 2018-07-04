'use strict';
(function () {
  var AMOUNT_OFFER = 5;
  var filtersMap = document.querySelector('.map__filters');

  var dataOffer = [];
  var selectedFeatures = {};

  var housingPrice = {
    LOW: 10000,
    HIGH: 50000
  };

  /**
   * Переключение доступности фильтров.
   * @param {Boolean} value - Значение disabled.
   */
  function disabledFilters(value) {
    Array.prototype.forEach.call(filtersMap.children, function (child) {
      window.utils.disabledNode(child, value);
      if (child.classList.contains('map__features')) {
        Array.prototype.forEach.call(child.children, function (item) {
          window.utils.disabledNode(item, value);
        });
      }
    });
  }

  /**
   * Проверка соответствия объявления фильтру.
   * @param {Object} item - Данные объявления.
   * @param {Node} filter - Фильтр по которому проходит проверка.
   * @return {Boolean} Результат проверки.
   */
  function filterOnce(item, filter) {
    if (filter.value !== 'any') {
      switch (filter.id) {
        case 'housing-price':
          switch (filter.value) {
            case 'low': return item.offer.price < housingPrice.LOW;
            case 'middle': return item.offer.price >= housingPrice.LOW && item.offer.price < housingPrice.HIGH;
            case 'high': return item.offer.price >= housingPrice.HIGH;
            default: return false;
          }
        case 'housing-features':
          for (var feature in selectedFeatures) {
            if (Object.prototype.hasOwnProperty.call(selectedFeatures, feature)) {
              if (selectedFeatures[feature] === true && !item.offer.features.includes(feature)) {
                return false;
              }
            }
          }
          return true;
        default:
          var newfilterName = filter.name.slice(filter.name.indexOf('-') + 1);
          return filter.value === item.offer[newfilterName].toString();
      }
    } else {
      return true;
    }
  }


  /**
   * Получение отфильтрованных данных объявлений.
   * @param {Array} array - Исходный массив с даннными.
   * @return {Array} Новый массив.
   */
  function filterOffers(array) {
    return array.
      filter(function (item) {
        return filterOnce(item, filtersMap['housing-type'])
          && filterOnce(item, filtersMap['housing-price'])
          && filterOnce(item, filtersMap['housing-rooms'])
          && filterOnce(item, filtersMap['housing-guests'])
          && filterOnce(item, filtersMap['housing-features']);
      });
  }

  function onChangeFilter(evt) {
    if (evt.target.name === 'features') {
      selectedFeatures[evt.target.value] = evt.target.checked;
    }
    window.utils.debounce(renderNewPins);
  }

  function renderNewPins() {
    window.card.onClose();
    window.pins.delete();
    window.pins.render(filterOffers(dataOffer), AMOUNT_OFFER);
  }

  window.filters = {
    activate: function (loadData) {
      dataOffer = loadData;
      disabledFilters(false);
      filtersMap.addEventListener('change', onChangeFilter);
    },
    deactivate: function () {
      filtersMap.reset();
      selectedFeatures = {};
      disabledFilters(true);
      filtersMap.removeEventListener('change', onChangeFilter);
    }
  };
})();
