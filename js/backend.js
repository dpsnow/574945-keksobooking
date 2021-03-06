'use strict';
(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';
  var OK_STATUS = 200;

  /**
   * Создание объект XMLHttpRequest для передачи данных.
   * @param {string} method - HTTP-метод.
   * @param {string} url - Адрес запроса
   * @param {function} onSuccess - Выполняется в случае успешно выполненого запроса.
   * @param {function} onError - Обработка ошибок.
   * @param {Object} data - Передаваемые данные.
   */
  function getXhr(method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === OK_STATUS) {
        if (method === 'POST') {
          onSuccess();
        } else {
          onSuccess(xhr.response);
        }
      } else {
        onError(xhr.status);
      }
    });
    xhr.open(method, url);
    xhr.send(data);
  }

  window.backend = {
    load: function (onLoad, onError) {
      getXhr('GET', URL_LOAD, onLoad, onError);
    },
    upload: function (onLoad, onError, data) {
      getXhr('POST', URL_SEND, onLoad, onError, data);
    }
  };
})();
