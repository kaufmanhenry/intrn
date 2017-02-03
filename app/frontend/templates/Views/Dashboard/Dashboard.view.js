angular.module('intrn')
    .directive('intrnDashboardView', function () {
        return {
            templateUrl: 'templates/Views/Dashboard/Dashboard.html',
            controller: ['$scope', '$q', '$routeParams', 'User', 'Company', 'Error',
                function ($scope, $q, $routeParams, User, Company, Error) {
                    $scope.load = function () {
                        $q.all([
                            User.get($routeParams, function (a) {
                                $scope.user = a;
                            }).$promise,
                            User.queryCompanies($routeParams, function (a) {
                                $scope.companies = a;
                            }).$promise
                        ]).then(function () {

                        }, Error.handle);
                    };

                    $scope.load();

                    $scope.createCompany = function (newCompany) {
                        newCompany.users = [];
                        newCompany.users.push($scope.user._id);
                        Company.save(newCompany, function () {
                            newCompany.name = '';
                            $scope.load();
                        }, Error.handle);
                    };
                }]
        };
    });