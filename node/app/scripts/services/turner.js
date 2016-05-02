'use strict'

/**
 * @ngdoc function
 * @name angularApp.service:Turner
 * @description
 * # TurnerService
 * Controller of the angularApp
*/

angular.module('turnerService', []) // eslint-disable-line 

  // super simple service
  // each function returns a promise object
  .factory('Turner', ['$http', function ($http) {
    return {
      get: function () {
        return $http.get('/williamturner/api/turner/controller/TurnerController.php')
      },
      post: function (original_text) {
        return $http.post('/williamturner/api/turner/controller/TurnerController.php', { 'text': original_text })
      }
    }
  }])
