'use strict';
(function () {
  var offerRoomsMatchForm = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0'],
  };
  var minPriceType = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var messageSuccess = document.querySelector('.success');
  var adForm = document.querySelector('.ad-form');
  var formValid = true;

  function successSendData() {
    window.backend.upload(showMsgSuccess, window.error.show, new FormData(adForm));
  }

  function showMsgSuccess() {
    messageSuccess.classList.toggle('hidden', false);
    document.addEventListener('keydown', onHideSuccessEscPress);
  }

  function hideMsgSuccess() {
    document.removeEventListener('keydown', onHideSuccessEscPress);
    messageSuccess.classList.toggle('hidden', true);
  }

  function onHideSuccessEscPress(evt) {
    window.utils.isEscEvent(evt, hideMsgSuccess);
  }

  function toggleDisabledForm(value) {
    Array.prototype.forEach.call(adForm, function (child) {
      window.utils.disabledNode(child, value);
      if (child.classList.contains('features')) {
        Array.prototype.forEach.call(child.children, function (item) {
          window.utils.disabledNode(item, value);
        });
      }
    });
  }

  function showErrorField(elem, msg) {
    if (elem.classList.contains('invalid-field')) {
      hideErrorField(elem);
    }
    elem.parentElement.style.position = 'relative';
    elem.classList.add('invalid-field');
    var msgBox = document.createElement('p');
    msgBox.classList.add('invalid-msgBox');
    msgBox.textContent = msg;
    elem.parentElement.appendChild(msgBox);
    elem.addEventListener('focus', onFocusField);
  }

  function hideErrorField(elem) {
    if (elem.classList.contains('invalid-field')) {
      elem.classList.remove('invalid-field');
      elem.parentElement.style.position = '';
      var currentMsgBox = elem.parentElement.querySelector('.invalid-msgBox');
      elem.parentElement.removeChild(currentMsgBox);
    }
  }

  var onFocusField = function (evt) {
    if (evt.target.classList.contains('invalid-field')) {
      formValid = true;
      hideErrorField(evt.target);
    }
  };

  // Отслеживать изменения в комнатах
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
    return resultMatch;
  }

  function checkValidForm() {
    if (!adForm.address.value.length) {
      formValid = false;
      showErrorField(adForm.address, 'Поле не может быть пустым');
    }
    // if (adForm.title.value.length < adForm.title.minLength) {
    if (adForm.title.validity.valueMissing || adForm.title.validity.tooShort) {
      formValid = false;
      showErrorField(adForm.title, 'Заголовок объявления не может быть меньше ' + adForm.title.minLength + ' символов. Не хватает еще ' + (adForm.title.minLength - adForm.title.value.length));
    }
    // if (adForm.price.value < adForm.price.min) {
    if (adForm.price.validity.rangeUnderflow || adForm.title.validity.valueMissing) {
      formValid = false;
      showErrorField(adForm.price, 'Для данного типа жилья минимальная цена за ночь - ' + minPriceType[adForm.type.value] + ' руб.');
    }

    if (!roomGuestMatch()) {
      formValid = false;
      showErrorField(adForm.capacity, 'Количество гостей превышает количество комнат');
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  function onChangePrice() {
    adForm.price.min = minPriceType[adForm.type.value];
    adForm.price.placeholder = minPriceType[adForm.type.value];
  }

  // Отслеживать изменения в времени заезда
  function onChangeCheckIn() {
    adForm.timeout.value = adForm.timein.value;
  }
  function onChangeCheckOut() {
    adForm.timein.value = adForm.timeout.value;
  }


  function changeField() {
    // adForm.title.addEventListener('change', onChangeTitle);

    adForm.type.addEventListener('change', onChangePrice);

    /* adForm.capacity.addEventListener('change', onChangeRooms);
    adForm.rooms.addEventListener('change', onChangeRooms); */

    adForm.timeout.addEventListener('change', onChangeCheckOut);
    adForm.timein.addEventListener('change', onChangeCheckIn);
  }
  changeField();

  function resetValidForm() {
    hideErrorField(adForm.title);
    hideErrorField(adForm.address);
    hideErrorField(adForm.price);
    hideErrorField(adForm.capacity);
  }

  function onSubmitForm(evt) {
    evt.preventDefault();
    checkValidForm();
    if (formValid) {
      successSendData();
      showMsgSuccess();
      window.page.deactivate();
      setTimeout(hideMsgSuccess, 5000);
    }
  }

  function onResetForm() {
    window.page.deactivate();
  }

  window.form = {
    init: function () {
      onChangePrice();
      toggleDisabledForm(false);
      adForm.noValidate = true;
      adForm.addEventListener('submit', onSubmitForm);
      adForm.addEventListener('reset', onResetForm);
    },
    disabled: function () {
      toggleDisabledForm(true);
      resetValidForm(); // удалить ошибки валидации
      adForm.reset(); // удалить введенные данные в форму
      adForm.removeEventListener('submit', onSubmitForm);
      adForm.removeEventListener('reset', onResetForm);

    }
  };
})();
