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
  var photoBox = adForm.querySelector('.ad-form__photo');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview').firstElementChild;
  var avatarDefault = {
    SRC: avatarPreview.getAttribute('src'),
    WIDTH: avatarPreview.getAttribute('width')
  };
  var photoContainer = adForm.querySelector('.ad-form__photo-container');
  var avatarChooser = adForm.avatar;
  var photoChooser = adForm.images;
  var addedPhotos = [];
  var formValid = true;

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

  function onFocusField(evt) {
    if (evt.target.classList.contains('invalid-field')) {
      formValid = true;
      hideErrorField(evt.target);
    }
  }

  // Проверка кол-ва гостей и комнат
  function checkRoomGuest() {
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
    if (adForm.title.validity.valueMissing || adForm.title.validity.tooShort) {
      formValid = false;
      showErrorField(adForm.title, 'Заголовок объявления не может быть меньше ' + adForm.title.minLength + ' символов. Не хватает еще ' + (adForm.title.minLength - adForm.title.value.length));
    }
    if (!adForm.price.checkValidity()) {
      formValid = false;
      showErrorField(adForm.price, 'Для данного типа жилья мин. цена - ' + minPriceType[adForm.type.value] + ' руб.');
    }
    if (!checkRoomGuest()) {
      formValid = false;
      showErrorField(adForm.capacity, 'Гостей больше чем комнат');
    }
  }

  function changePrice() {
    adForm.price.min = minPriceType[adForm.type.value];
    adForm.price.placeholder = minPriceType[adForm.type.value];
  }

  function onChangeType() {
    formValid = true;
    hideErrorField(adForm.price);
    changePrice();
  }

  // Отслеживать изменения в времени заезда
  function onChangeCheckIn() {
    adForm.timeout.value = adForm.timein.value;
  }
  function onChangeCheckOut() {
    adForm.timein.value = adForm.timeout.value;
  }

  function onChangeRooms() {
    formValid = true;
    hideErrorField(adForm.capacity);
  }

  function addListenerField() {
    adForm.type.addEventListener('change', onChangeType);
    adForm.timeout.addEventListener('change', onChangeCheckOut);
    adForm.timein.addEventListener('change', onChangeCheckIn);
    adForm.rooms.addEventListener('change', onChangeRooms);
    avatarChooser.addEventListener('change', onAvatarChange);
    photoChooser.addEventListener('change', onPhotoChange);
  }

  function removeListenerField() {
    adForm.type.removeEventListener('change', onChangeType);
    adForm.timeout.removeEventListener('change', onChangeCheckOut);
    adForm.timein.removeEventListener('change', onChangeCheckIn);
    adForm.rooms.removeEventListener('change', onChangeRooms);
    avatarChooser.removeEventListener('change', onAvatarChange);
    photoChooser.removeEventListener('change', onPhotoChange);
  }


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
      window.backend.upload(showMsgSuccess, window.error.show, new FormData(adForm));
      showMsgSuccess();
      window.page.deactivate();
      setTimeout(hideMsgSuccess, 5000);
    }
  }

  function onResetForm() {
    window.page.deactivate();
  }

  function showImage(files, callback) {
    Array.from(files).forEach(function (item) {
      var reader = new FileReader();
      if (item.type.includes('image/')) {
        reader.readAsDataURL(item);
        reader.addEventListener('load', function () {
          callback(reader.result);
        });
      }
    });
  }

  function showAvatar(value) {
    avatarPreview.src = value;
    avatarPreview.width = 70;
    avatarPreview.style.width = '70px';
    avatarPreview.style.height = '70px';
    avatarPreview.removeAttribute('height');
  }

  function addPhoto(value) {
    var image = document.createElement('img');
    image.src = value;
    image.classList.add('ad-form__photo');
    image.alt = 'Фотография объявления';
    image.width = 70;
    addedPhotos.push(image);
    photoContainer.insertBefore(image, photoBox);
  }

  function deletePhoto() {
    addedPhotos.forEach(function (item) {
      item.remove();
    });
  }

  function showDefaultAvatar() {
    avatarPreview.src = avatarDefault.SRC;
    avatarPreview.width = avatarDefault.WIDTH;
    avatarPreview.style = '';
  }

  function onAvatarChange(evt) {
    showImage(evt.target.files, showAvatar);
  }
  function onPhotoChange(evt) {
    showImage(evt.target.files, addPhoto);
  }

  window.form = {
    init: function () {
      adForm.classList.toggle('ad-form--disabled', false);
      changePrice();
      addListenerField();
      toggleDisabledForm(false);
      adForm.noValidate = true;
      adForm.addEventListener('submit', onSubmitForm);
      adForm.addEventListener('reset', onResetForm);
    },
    disabled: function () {
      adForm.classList.toggle('ad-form--disabled', true);
      toggleDisabledForm(true);
      resetValidForm(); // удалить ошибки валидации
      adForm.reset(); // удалить введенные данные в форму
      showDefaultAvatar();
      deletePhoto();
      removeListenerField();
      adForm.removeEventListener('submit', onSubmitForm);
      adForm.removeEventListener('reset', onResetForm);
    }
  };
})();
