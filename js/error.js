'use strict';
(function () {
  var shownError;
  var errorCodeToMsg = {
    '400': 'Неправильный запрос.',
    '404': 'Запрашиваемый ресурс не найден.',
    '403': 'Отказано в доступе.',
    '500': 'Внутренняя ошибка сервера.',
    '504': 'Время запроса истекло.'
  };

  function showError(msg) {
    var errorBox = document.createElement('div');
    errorBox.classList.add('error-box');
    errorBox.textContent = errorCodeToMsg[msg] || msg || 'Произошла ошибка.';
    document.body.insertAdjacentElement('afterbegin', errorBox);
    shownError = errorBox;
    errorBox.addEventListener('click', window.error.hide);
  }

  window.error = {
    show: function (msg) {
      window.error.hide();
      showError(msg);
    },
    hide: function () {
      if (shownError) {
        shownError.remove();
      }
    }
  };
})();
