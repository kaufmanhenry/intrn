angular.module('intrn')
    .directive('intrnAdminJobComponent', function () {
        return {
            scope: {
                job: '=intrnJobData',
                onChange: '&intrnOnChangeLoad',
                expired: '@intrnJobExpired',
                selectJob: '&intrnSelectJob'
            },
            templateUrl: 'templates/Components/AdminJob/AdminJob.html',
            controller: ['$scope', '$q', '$timeout', '$uibModal', 'Job', 'Actions', 'Blob', 'POST_EXPIRATION', 'Error',
                function ($scope, $q, $timeout, $uibModal, Job, Actions, Blob, POST_EXPIRATION, Error) {
                    $q.all([
                        Job.get({job_id: $scope.job._id || $scope.job}, function (a) {
                            $scope.job = a;
                        }).$promise,
                        Job.queryApplicants({job_id: $scope.job._id || $scope.job}, function (a) {
                            $scope.job.applicants = a;
                        }).$promise,
                        Blob.resource.queryJobs({job_id: $scope.job._id || $scope.job}, function (a) {
                            $scope.blob = a[0];
                        }).$promise
                    ]).then(function () {
                        var tempDate = new Date($scope.job.jobCreatedTime);
                        tempDate.setDate(tempDate.getDate() + POST_EXPIRATION);
                        $scope.expirationTime = tempDate;
                    }, Error.handle);

                    $scope.removeJob = function () {
                        return Actions.openConfirmModal(
                            'Are you sure you want to delete this post?',
                            'This cannot be undone and you will lose all of your applicants and posting challenges!',
                            'danger',
                            'Remove the post!',
                            false,
                            function () {
                                Job.remove({job_id: $scope.job._id}, function () {
                                    $timeout($scope.onChange());
                                }, Error.handle);
                            }, function () {
                            });
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

                    $scope.clickJob = function () {
                        $scope.selectJob({job: $scope.job});
                    }
                }]
        };
    });