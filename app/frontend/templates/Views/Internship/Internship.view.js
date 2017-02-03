angular.module('intrn')
    .directive('intrnInternshipView', function () {
        return {
            templateUrl: 'templates/Views/Internship/Internship.html',
            controller: ['$scope', '$q', '$routeParams', '$location', 'Job', 'Enums', 'Error',
                function ($scope, $q, $routeParams, $location, Job, Enums, Error) {
                    $scope.load = function () {
                        var promises = [];

                        if ($routeParams.job_id !== 'new') {
                            promises.push(
                                Job.get({job_id: $routeParams.job_id}, function (a) {
                                    $scope.internship = a;
                                }).$promise
                            );
                        }
                        $q.all(promises.concat([
                            Enums.get(function (a) {
                                $scope.enums = a;
                            }).$promise
                        ])).then(function () {
                            if (!$scope.internship) $scope.internship = {};
                        }, Error.handle);
                    };

                    $scope.setProperty = function (a, b) {
                        $scope.internship[b] = a;
                    };

                    $scope.saveJob = function () {
                        $scope.internship.company = $routeParams.company_id;
                        Job.save($scope.internship, function (a) {
                            $location.path('/companies/' + $routeParams.company_id + '/internships/' + a._id);
                        }, Error.handle);
                    };

                    $scope.load();
                }]
        };
    });