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
    node.style = 'z-index: 100; margin:0 auto; padding: 5px; text-align: center; vertical-align: middle; background-color: #bd2400; color: white;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.top = 0;
    node.style.fontSize = '18px';
    node.textContent = errorCodeToMsg[msg] || msg || 'Произошла ошибка.';
    document.body.insertAdjacentElement('afterbegin', node);
    error = node;
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
