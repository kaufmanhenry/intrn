angular.module('intrn')
    .controller('Nav', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
        $scope.$on('Authentication', function (event, params) {
            $scope.user = params.user;
        });

        $scope.logout = function () {
            Auth.logout();
            $location.path('/');
        };

        $scope.login = function () {
            Auth.auth(function () {
                $location.path('/dashboard');
            });
        };
    }]);