angular.module('intrn')
    .directive('intrnApplyForJobModal', function () {
        return {
            scope: {
                close: '&intrnClose',
                jobId: '@intrnJobIdData',
                applicantId: '@intrnApplicantIdData'
            },
            templateUrl: 'templates/Components/ApplyForJobModal/ApplyForJobModal.html',
            controller: ['$scope', '$q', 'Enums', 'Blob', 'Applicant', 'Error', function ($scope, $q, Enums, Blob, Applicant, Error) {
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

                $scope.upload = function (fileType, uri, file) {
                    return Blob.uploadBase64Url(uri, {
                        filename: file.name,
                        applicant: $scope.applicant._id || $scope.applicant,
                        applicantFileType: fileType
                    }).then(function () {
                    }, Error.handle);
                };

                $scope.onSelectChallenge = function (file) {
                    $scope.challengeFile = file;
                };

                $scope.onLoadChallenge = function (uri) {
                    $scope.challengeUri = uri;
                };

                $scope.onSelectResume = function (file) {
                    $scope.resumeFile = file;
                };

                $scope.onLoadResume = function (uri) {
                    $scope.resumeUri = uri;
                };
            }]
        }
    });