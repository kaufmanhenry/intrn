angular.module('intrn')
    .directive('intrnCompanyView', function () {
        return {
            templateUrl: 'templates/Views/Company/Company.html',
            controller: ['$scope', '$q', '$routeParams', 'User', 'Company', 'Error',
                function ($scope, $q, $routeParams, User, Company, Error) {
                    $scope.load = function () {
                        $q.all([
                            Company.get($routeParams, function (a) {
                                $scope.company = a;
                            }).$promise,
                            Company.queryJobs($routeParams, function (a) {
                                $scope.jobs = a;
                            }).$promise
                        ]).then(function () {

                        }, Error.handle);
                    };

                    $scope.load();
                }]
        };
    });