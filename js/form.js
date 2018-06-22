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

  var formError = false;
  var messageSuccess = document.querySelector('.success');
  var adForm = document.querySelector('.ad-form');
  var formFooter = adForm.querySelector('.ad-form__element--submit');

  function successSendData() {
    window.backend.upload(showMsgSuccess, window.error.show, new FormData(adForm));
    adForm.reset();
    setTimeout(hideMsgSuccess, 5000);
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

  // ======================================================
  // ======================================================
  // ======================================================

  function checkValidField(elem) {
    var result = true;
    if (!elem.checkValidity()) {
      elem.style.boxShadow = '0 0 2px 2px #8e1700';
      msgTypeError(elem);
      result = false;
    } else {
      elem.style.boxShadow = '';
    }
    return result;
  }

  function resetField(elem) {
    elem.style.boxShadow = '';
  }

  function msgTypeError(elem) {
    switch (true) {
      case (elem.validity.tooShort):
        // return addError('- ' + elem.labels[0].textContent + ':' + elem.validationMessage);
        return addError('- ' + elem.labels[0].textContent + ' меньше ' + elem.minLength + ' символов. Осталось еще ' + (elem.minLength - elem.value.length));
      case (elem.validity.rangeUnderflow):
        return addError('- ' + elem.labels[0].textContent + ' меньше ' + adForm.price.min + '.');
      default:
        return addError('- ' + elem.labels[0].textContent + ' отсутствует.');
    }
  }

  function checkValidForm() {
    // debugger;
    // checkValidField(adForm.title);
    // checkValidField(adForm.price);
    // checkGuestMatch();

    var result1 = checkValidField(adForm.title);
    var result2 = checkValidField(adForm.price);
    var result3 = checkGuestMatch();

    if (result1 && result2 && result3) {
      return true;
    } else {
      return false;
    }
  }

  function resetValidForm() {
    resetField(adForm.title);
    resetField(adForm.price);
    resetField(adForm.capacity);
  }

  function showError() {
    hideError();
    var node = document.createElement('div');
    node.classList.add('ARRRRR');
    node.style = 'padding: 15px 5px; text-align: center; border: 1px solid #b71515; width: 100%; background-color: #f1e9e9;';
    node.style.fontSize = '18px';
    node.textContent = 'Пожалуйста, исправьте:';
    var moreErrors = fragment;
    node.insertBefore(moreErrors, null);
    adForm.insertBefore(node, formFooter);
    formError = node;
  }
  var fragment = document.createDocumentFragment();

  function addError(msg) {
    if (msg) {
      var msgError = document.createElement('span');
      msgError.style.display = 'block';
      msgError.textContent = msg || '';
      fragment.appendChild(msgError);
      return fragment;
    }
    return null;
  }

  function hideError() {
    if (formError) {
      formError.remove();
    }
  }

  function onResetForm() {
    window.page.deactivate();
  }

  function onSubmitForm(evt) {
    // debugger;
    evt.preventDefault();
    if (checkValidForm()) {
      successSendData();
    } else {
      showError();
    }
  }

  // Отслеживать изменения в заголовке
  function onChangeTitle() {
    adForm.title.style.boxShadow = adForm.title.checkValidity() ? '' : '0 0 2px 2px #8e1700';
  }
  // Отслеживать изменения в цене
  function onChangePrice() {
    adForm.price.min = minPriceType[adForm.type.value];
    adForm.price.placeholder = minPriceType[adForm.type.value];
  }

  // Отслеживать изменения в комнатах
  function onChangeRoomGuestMatch() {
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

  function checkGuestMatch() {
    var a = onChangeRoomGuestMatch();
    if (!a) {
      adForm.capacity.style.boxShadow = '0 0 2px 2px #8e1700';
      addError('- Количество гостей превышает количество комнат');
      return false;
    } else {
      adForm.capacity.style.boxShadow = '';
      addError('');
      return true;
    }
  }

  function onChangeRooms() {
    var a = onChangeRoomGuestMatch();
    if (!a) {
      adForm.capacity.style.boxShadow = '0 0 2px 2px #8e1700';
    } else {
      adForm.capacity.style.boxShadow = '';
    }
  }

  // Отслеживать изменения в времени заезда
  function onChangeCheckIn() {
    adForm.timeout.value = adForm.timein.value;
  }
  function onChangeCheckOut() {
    adForm.timein.value = adForm.timeout.value;
  }


  function changeField() {
    adForm.title.addEventListener('change', onChangeTitle);

    adForm.type.addEventListener('change', onChangePrice);

    adForm.capacity.addEventListener('change', onChangeRooms);
    adForm.rooms.addEventListener('change', onChangeRooms);

    adForm.timeout.addEventListener('change', onChangeCheckOut);
    adForm.timein.addEventListener('change', onChangeCheckIn);
  }
  changeField();

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
      hideError();
      resetValidForm();
      adForm.reset(); // удалить введенные данные в форму
      adForm.removeEventListener('submit', onSubmitForm);
      adForm.removeEventListener('reset', onResetForm);

    }
  };
})();
