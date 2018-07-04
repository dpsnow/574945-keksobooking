'use strict';
(function () {
  var error;

  var errorCodeToMsg = {
    '400': 'Неправильный запрос.',
    '404': 'Запрашиваемый ресурс не найден.',
    '403': 'Отказано в доступе.',
    '500': 'Внутренняя ошибка сервера.',
    '504': 'Время запроса истекло.'
  };

  function showError(msg) {
    var node = document.createElement('div');
    node.classList.add('error-box');
    node.textContent = errorCodeToMsg[msg] || msg || 'Произошла ошибка.';
    document.body.insertAdjacentElement('afterbegin', node);
    error = node;
    node.addEventListener('click', window.error.hide);
  }

  window.error = {
    show: function (msg) {
      window.error.hide();
      showError(msg);
    },
    hide: function () {
      if (error) {
        error.remove();
      }
    }
  };
})();
