/*global angular*/
angular.module('intrn')
    .directive('intrnLoginView', function () {
        return {
            templateUrl: 'templates/Views/Login/Login.html',
            controller: ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
                $scope.authenticate = function () {
                    Auth.auth(function () {
                        $location.path('/dashboard');
                    });
                };
            }]
        };
    });