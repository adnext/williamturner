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
                    get: function (url) {
                        return $http({
                            url: url,
                            method: 'GET',
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        })
                    },
                    post: function (url, original_text) {
                        return $http.post(url, {'text': original_text})
                    }
                }
            }])
