angular.module('intrn')
    .directive('intrnAdminJobComponent', function () {
        return {
            scope: {
                job: '=intrnJobData',
                onChange: '&intrnOnChangeLoad'
            },
            templateUrl: 'templates/Components/AdminJob/AdminJob.html',
            controller: ['$scope', '$q', '$timeout', 'Job', 'Error', function ($scope, $q, $timeout, Job, Error) {
                $q.all([
                    Job.get({job_id: $scope.job._id || $scope.job}, function (a) {
                        $scope.job = a;
                    }).$promise,
                    Job.queryApplicants({job_id: $scope.job._id || $scope.job}, function (a) {
                        $scope.applicants = a;
                    }).$promise
                ]).then(function () {

                }, Error.handle);

                $scope.removeJob = function () {
                    Job.remove({job_id: $scope.job._id}, function () {
                        $timeout($scope.onChange());
                    }, Error.handle);
                };
            }]
        };
    });