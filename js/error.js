'use strict';
(function () {
  var error;

  function textErr(codeErr) {
    switch (codeErr) {
      case 400:
        return 'Неправильный запрос. Статус ответа: ' + codeErr;
      case 404:
        return 'Запрашиваемый ресурс не найден. Статус ответа: ' + codeErr;
      case 403:
        return 'Отказано в доступе. Статус ответа: ' + codeErr;
      case 500:
        return 'Внутренняя ошибка сервера. Статус ответа: ' + codeErr;
      case 504:
        return 'Время запроса истекло. Статус ответа: ' + codeErr;
      default:
        return 'Произошла ошибка. Статус ответа: ' + codeErr;
    }
  }

  function showError(errorCode) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin:0 auto; padding: 5px; text-align: center; vertical-align: middle; background-color: #bd2400; color: white;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.top = 0;
    node.style.fontSize = '18px';
    node.textContent = textErr(errorCode);
    document.body.insertAdjacentElement('afterbegin', node);
    error = node;
  }

  window.error = {
    show: function (errorCode) {
      window.error.hide();
      showError(errorCode);
    },
    hide: function () {
      if (error) {
        error.remove();
      }
    }
  };
})();
