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
                        return $http({
                            url: 'http://localhost:5002/williamturner/node',
                            method: "GET",
                            withCredentials: true,
                            headers: {
                                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        });
                    },
                    post: function (original_text) {
                        return $http.post('http://localhost:5002/williamturner/node', {'text': original_text})
                    }
                }
            }])
