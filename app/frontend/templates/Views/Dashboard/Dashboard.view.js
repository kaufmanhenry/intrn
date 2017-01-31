angular.module('intrn')
    .directive('intrnDashboardView', function () {
        return {
            templateUrl: 'templates/Views/Dashboard/Dashboard.html',
            controller: ['$scope', '$q', '$routeParams', 'User', 'Error', function ($scope, $q, $routeParams, User, Error) {
                $q.all([
                    User.get($routeParams, function (a) {
                        $scope.user = a;
                    }).$promise
                ]).then(function () {

                }, Error.handle);
            }]
        };
    });