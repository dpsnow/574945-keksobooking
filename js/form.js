'use strict';
(function () {
  var offerRoomsMatchForm = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0'],
  };
  var minPriceType = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };
  var messageSuccess = document.querySelector('.success');
  var adForm = document.querySelector('.ad-form');
  var submitButtonForm = adForm.querySelector('.ad-form__submit');
  var resetButtonForm = adForm.querySelector('.ad-form__reset');

  function roomGuestMatch() {
    var capacityValue = adForm.capacity.value;
    var roomValue = adForm.rooms.value;
    var guestMatch = offerRoomsMatchForm[roomValue];
    var resultMatch = false;
    guestMatch.forEach(function (item) {
      if (item === capacityValue) {
        resultMatch = true;
      }
    });

    if (!resultMatch) {
      adForm.capacity.style.boxShadow = '0 0 2px 2px #8e1700';
      adForm.capacity.setCustomValidity('Количество гостей превышает количество комнат');
    } else {
      adForm.capacity.style.boxShadow = '';
      adForm.capacity.setCustomValidity('');
    }
  }

  function onSubmitCheckValid() {
    roomGuestMatch();
    if (!adForm.title.checkValidity()) {
      adForm.title.style.boxShadow = '0 0 2px 2px #8e1700';
    }
    if (!adForm.price.checkValidity()) {
      adForm.price.style.boxShadow = '0 0 2px 2px #8e1700';
    }
  }

  // ======================================================
  // Замена минимальной цены в зависимости от типа объекта
  adForm.type.addEventListener('change', function () {
    adForm.price.min = minPriceType[adForm.type.value];
  });
  adForm.price.addEventListener('focus', function () {
    adForm.price.min = minPriceType[adForm.type.value];
    adForm.price.style.boxShadow = '';
  });

  // Синхронизация времени checkIn и checkOut
  adForm.timein.addEventListener('change', function () {
    adForm.timeout.value = adForm.timein.value;
  });
  adForm.timeout.addEventListener('change', function () {
    adForm.timein.value = adForm.timeout.value;
  });

  // Проверка соответсвия комнат и гостей при изменении комнат или гостей
  adForm.capacity.addEventListener('change', function () {
    roomGuestMatch();
  });
  adForm.rooms.addEventListener('change', function () {
    roomGuestMatch();
  });

  adForm.title.addEventListener('change', function () {
    adForm.title.style.boxShadow = '';
  });

  adForm.addEventListener('submit', function () {
    if (adForm.checkValidity()) {
      onShowSuccess();
    } else {
      // evt.preventDefault();
      onSubmitCheckValid();
    }
  });

  function onShowSuccess() {
    messageSuccess.classList.toggle('hidden', false);
    setTimeout(function () {
      onHideSuccess();
    }, 10000);
    document.addEventListener('keydown', onHideSuccessEscPress);
  }

  function onHideSuccess() {
    document.removeEventListener('keydown', onHideSuccessEscPress);
    messageSuccess.classList.toggle('hidden', true);
  }

  function onHideSuccessEscPress(evt) {
    window.util.isEscEvent(evt, onHideSuccess);
  }

  window.form = {
    disabled: function (params) {
      Array.prototype.forEach.call(adForm, function (item) {
        item.disabled = params;
      });
      if (params) {
        adForm.reset(); // удалить введенные данные в форму
        submitButtonForm.removeEventListener('click', onSubmitCheckValid);
        resetButtonForm.removeEventListener('click', window.page.deactivate);
        adForm.price.style.boxShadow = '';
        adForm.title.style.boxShadow = '';
        adForm.capacity.style.boxShadow = '';
      } else {
        submitButtonForm.addEventListener('click', onSubmitCheckValid);
        resetButtonForm.addEventListener('click', window.page.deactivate);
      }
    }
  };
})();
