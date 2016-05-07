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

                function turnerGet() {
                    Turner.get()
                            .success(function (data) {
                                $scope.turner = data;
                                $scope.loading = false;
                            });
                }

                // GET =====================================================================
                turnerGet();

                $scope.createTurner = function () {
                    // validate the formData to make sure that something is there
                    // if form is empty, nothing will happen
                    if ($scope.formData.text !== undefined) {
                        $scope.loading = true;

                        // call the create function from our service (returns a promise object)
                        var original = $scope.formData.text;

                        // POST =============================================================
                        Turner.post(original)
                                // if successful creation, call our get function to get all the new todos
                                .success(function (data) {
                                    //console.log(data);

                                    //read your writes instead of turnerGet();
                                    if (typeof $scope.turner.unshift !== 'undefined') {
                                        $scope.turner.unshift(data); // prepend new data to $scope.turner
                                    } else {
                                        $scope.turner = [data];
                                        console.log($scope.turner);
                                    }
                                    $scope.loading = false;
                                    $scope.activeMsg = 0;
                                    $scope.formData = {}; // clear the form so our user is ready to enter another
                                });
                    }
                };

                $scope.setText = function (index) {
                    if (typeof ($scope.turner) !== 'undefined') {
                        if ($scope.turner.length > 1) {
                            return $scope.turner[$scope.activeMsg].turned_text;
                        } else if ($scope.turner.length !== 0) {
                            if (typeof $scope.turner[0] !== 'undefined') {
                                return $scope.turner[0].turned_text;
                            } else {
                                return $scope.turner.turned_text;
                            }
                        }
                    }
                };

                $scope.refresh = function () {
//                    console.log("refresh")
//                    console.log("Active Message = " + $scope.activeMsg)
//                    console.log("Max messages = " + $scope.turner.length)

                    $scope.$apply(function () {
                        $scope.activeMsg++;

                        if ($scope.activeMsg >= $scope.turner.length) {
                            $scope.activeMsg = 0;
                        }
                    }
                    );
                };

                setInterval($scope.refresh, 3000);
            }]);
