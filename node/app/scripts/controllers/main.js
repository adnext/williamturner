'use strict'

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp') // eslint-disable-line 
        .controller('MainCtrl', ['$scope', '$http', 'Turner', function ($scope, $http, Turner) {
                $scope.formData = {};
                $scope.turner = [];
                $scope.loading = true;
                $scope.activeMsg = 0;
                
                //@Important url of the DB server
                var url = 'http://localhost:5002/williamturner/node';

                function defaultErrorHandler(err) {
                    console.log(err);
                }

                function turnerGet() {
                    Turner.get(url)
                            .success(function (data) {
                                $scope.turner = data;
                                $scope.loading = false;
                            }).error(function (err) {
                        defaultErrorHandler(err);
                    });
                }

                // GET =====================================================================
                turnerGet();

                // call the create function from our service (returns a promise object)
                $scope.createTurner = function () {
                    // validate the formData to make sure that something is there
                    // if form is empty, nothing will happen
                    if ($scope.formData.text !== undefined) {
                        $scope.loading = true;
                        var original = $scope.formData.text;

                        // POST =============================================================
                        Turner.post(url, original)
                                // if successful creation, read your writes
                                .success(function (data) {
                                    // console.log(data)

                                    // read your writes instead of turnerGet()
                                    if (typeof $scope.turner.unshift !== 'undefined') {
                                        $scope.turner.unshift(data); // prepend new data to $scope.turner
                                    } else {
                                        $scope.turner = [data];
//                                        console.log($scope.turner);
                                    }
                                    $scope.loading = false;
                                    $scope.activeMsg = 0;
                                    $scope.formData = {}; // clear the form so our user is ready to enter another
                                }).error(function (err) {
                            defaultErrorHandler(err);
                        });
                    }
                };

                $scope.setText = function (index) {
                    if (typeof $scope.turner !== 'undefined') { // if there is an turner object or array
                        if ($scope.turner.length > 1) { // if there is an turner array with several elements
                            return $scope.turner[$scope.activeMsg].turned_text;
                        } else if ($scope.turner.length !== 0) { // if there is an turner object or array with one element
                            if (typeof $scope.turner[0] !== 'undefined') {  // if array
                                return $scope.turner[0].turned_text;
                            } else {
                                return $scope.turner.turned_text;
                            }
                        }
                    }
                    return "";
                };

                $scope.refresh = function () {
//                    console.log("refresh");
//                    console.log("Active Message = " + $scope.activeMsg);
//                    console.log("Max messages = " + $scope.turner.length);

                    $scope.$apply(function () {
                        $scope.activeMsg++;

                        if ($scope.activeMsg >= $scope.turner.length) {
                            $scope.activeMsg = 0;
                        }
                    });
                };

                setInterval($scope.refresh, 3000);
            }]);
