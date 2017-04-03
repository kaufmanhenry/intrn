angular.module('intrn')
    .directive('intrnCompanyView', function () {
        return {
            templateUrl: 'templates/Views/Company/Company.html',
            controller: ['$scope', '$q', '$routeParams', 'Actions', 'User', 'Company', 'Job', 'POST_EXPIRATION', 'Error',
                function ($scope, $q, $routeParams, Actions, User, Company, Job, POST_EXPIRATION, Error) {
                    $scope.load = function () {
                        $q.all([
                            Company.get($routeParams, function (a) {
                                $scope.company = a;
                            }).$promise,
                            Company.queryJobs($routeParams, function (a) {
                                $scope.jobs = a;
                            }).$promise
                        ]).then(function () {
                            var timeInMs = POST_EXPIRATION * 24 * 60 * 60 * 1000;
                            var currentTime = new Date().getTime();

                            $scope.currentJobs = $scope.jobs.filter(function (a) {
                                return currentTime - new Date(a.jobCreatedTime) < timeInMs;
                            });

                            $scope.expiredJobs = $scope.jobs.filter(function (a) {
                                return currentTime - new Date(a.jobCreatedTime) >= timeInMs;
                            });
                        }, Error.handle);
                    };

                    $scope.load();

                    $scope.deleteOldPosts = function () {
                        return Actions.openConfirmModal(
                            'Are you sure you want to remove all of your old job postings?',
                            '',
                            'remove',
                            'Remove Old Posts',
                            false,
                            function () {
                                $scope.expiredJobs.forEach(function (a) {
                                    Job.remove({job_id: a._id}, function () {
                                        $scope.load();
                                    }, Error.handle)
                                });
                            }, function () {
                            });
                    };

                    $scope.deleteAllPosts = function () {
                        return Actions.openConfirmModal(
                            'Are you sure you want to remove all of your job postings?',
                            'This cannot be undone and you will lose all of your applicants and posting challenges!',
                            'remove',
                            'Remove Everything',
                            false,
                            function () {
                                $scope.jobs.forEach(function (a) {
                                    Job.remove({job_id: a._id}, function () {
                                        $scope.load();
                                    }, Error.handle)
                                });
                            }, function () {
                            });
                    };

                    $scope.selectJob = function (a) {
                        $scope.selectedJob = a;
                    };
                }]
        };
    });