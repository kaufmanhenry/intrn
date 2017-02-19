angular.module('intrn')
    .directive('intrnJobListingComponent', function () {
        return {
            scope: {
                job: '=intrnJobData'
            },
            templateUrl: 'templates/Components/JobListing/JobListing.html',
            controller: ['$scope', '$uibModal', 'Job', 'Error', function ($scope, $uibModal, Job, Error) {
                $scope.toggleDropdown = function () {
                    $scope.dropdownIsOpen = !$scope.dropdownIsOpen;
                    //Add interest for the job
                    Job.addInterest({job_id: $scope.job._id}, {}, function () {
                    }, Error.handle);
                };

                $scope.applyForJob = function () {
                    return $uibModal.open({
                        animation: true,
                        template: '<intrn-apply-for-job-modal intrn-close="close()" intrn-job-id-data="{{job._id}}"></intrn-apply-for-job-modal>',
                        controller: ['$uibModalInstance', function ($uibModalInstance) {
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
            }]
        }
    });