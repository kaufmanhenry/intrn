angular.module('intrn')
    .directive('intrnApplyForJobModal', function () {
        return {
            scope: {
                close: '&intrnClose',
                jobId: '@intrnJobIdData',
                applicantId: '@intrnApplicantIdData'
            },
            templateUrl: 'templates/Components/ApplyForJobModal/ApplyForJobModal.html',
            controller: ['$scope', '$q', 'Enums', 'Applicant', 'Error', function ($scope, $q, Enums, Applicant, Error) {
                var promises = [];

                promises.push(
                    Enums.get(function (a) {
                        $scope.enums = a;
                        $scope.schools = a.AllSchools;
                    }).$promise
                );

                if ($scope.applicantId) {
                    promises.push(
                        Applicant.get({applicant_id: $scope.applicantId}, function (a) {
                            console.log(a);
                            $scope.applicant = a;
                        }).$promise
                    );
                }

                $q.all(promises).then(function () {
                    //If the applicant does not exist, create one
                    if (!$scope.applicant) $scope.applicant = {job: $scope.jobId};
                }, Error.handle);


                $scope.apply = function () {
                    Applicant.save($scope.applicant, function () {
                        $scope.close();
                    }, Error.handle);
                };
            }]
        }
    });