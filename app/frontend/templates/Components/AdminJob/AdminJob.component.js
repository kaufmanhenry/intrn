angular.module('intrn')
    .directive('intrnAdminJobComponent', function () {
        return {
            scope: {
                job: '=intrnJobData',
                onChange: '&intrnOnChangeLoad',
                expired: '@intrnJobExpired'
            },
            templateUrl: 'templates/Components/AdminJob/AdminJob.html',
            controller: ['$scope', '$q', '$timeout', '$uibModal', 'Job', 'Error', function ($scope, $q, $timeout, $uibModal, Job, Error) {
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

                $scope.viewApplication = function (applicant) {
                    return $uibModal.open({
                        animation: true,
                        template: '<intrn-apply-for-job-modal intrn-close="close()" intrn-job-id-data="{{job._id}}"  intrn-applicant-id-data="{{applicant._id}}"></intrn-apply-for-job-modal>',
                        controller: ['$uibModalInstance', '$scope', function ($uibModalInstance, scope) {
                            scope.job = $scope.job;
                            scope.applicant = applicant;

                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss();
                            };
                        }],
                        scope: $scope
                    });
                };

                $scope.relist = function () {
                    //Update the created At
                    $scope.job.jobCreatedTime = new Date();

                    Job.save($scope.job, function () {
                        $timeout($scope.onChange());
                    }, Error.handle);
                };
            }]
        };
    });