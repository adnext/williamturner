'use strict';

/**
 * @ngdoc function
 * @name angularApp.service:Turner
 * @description
 * # TurnerService
 * Controller of the angularApp
*/

angular.module('turnerService', [])

	// super simple service
	// each function returns a promise object
	.factory('Turner', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/turner');
			},
			post : function(original_text) {
                return $http.post('/api/turner', { "text": original_text });
            }
		}
	}]);