angular.module('intrn')
    .directive('intrnApplyForJobModal', function () {
        return {
            scope: {
                close: '&intrnClose',
                jobId: '@intrnJobIdData'
            },
            templateUrl: 'templates/Components/ApplyForJobModal/ApplyForJobModal.html',
            controller: ['$scope', '$q', 'Enums', 'Applicant', 'Error', function ($scope, $q, Enums, Applicant, Error) {
                $q.all([
                    Enums.get(function (a) {
                        $scope.enums = a;
                        $scope.schools = a.AllSchools;
                    }).$promise
                ]).then(function () {
                }, Error.handle);

                $scope.apply = function (applicant) {
                    applicant.job = $scope.jobId;
                    Applicant.save(applicant, function () {
                        $scope.close();
                    }, Error.handle);
                };
            }]
        }
    });