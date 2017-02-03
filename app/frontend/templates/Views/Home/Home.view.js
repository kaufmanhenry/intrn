angular.module('intrn')
    .directive('intrnHomeView', function () {
        return {
            templateUrl: 'templates/Views/Home/Home.html',
            controller: ['$scope', '$q', 'Job', 'Enums', 'Error', function ($scope, $q, Job, Enums, Error) {
                $q.all([
                    Job.query(function (a) {
                        $scope.jobs = a;
                    }).$promise,
                    Enums.get(function (a) {
                        $scope.enums = a;
                    }).$promise
                ]).then(function () {
                }, Error.handle);
            }]
        };
    });