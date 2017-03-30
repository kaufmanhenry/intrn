angular.module('intrn')
    .directive('intrnHomeView', function () {
        return {
            templateUrl: 'templates/Views/Home/Home.html',
            controller: ['$scope', '$q', 'Job', 'Enums', 'Error', function ($scope, $q, Job, Enums, Error) {
                //Initiate Filters
                $scope.filters = {
                    roleFilters: [],
                    locationFilters: [],
                    jobFilters: []
                };

                $q.all([
                    Job.query(function (a) {
                        $scope.jobs = a;
                        $scope.filteredJobs = a;
                    }).$promise,
                    Enums.get(function (a) {
                        $scope.enums = a;
                    }).$promise
                ]).then(function () {
                }, Error.handle);

                $scope.setFilter = function (filter, filterText) {
                    var index = $scope.filters[filterText].indexOf(filter.name);
                    if (index >= 0) {
                        $scope.filters[filterText].splice(index, 1);
                    } else {
                        $scope.filters[filterText].push(filter.name);
                    }
                    $scope.filterJobs();
                };

                $scope.filterJobs = function () {
                    $scope.filteredJobs = $scope.jobs.filter(function (a) {
                        if ($scope.filters.roleFilters.length > 0) {
                            if ($scope.filters.roleFilters.indexOf(a.role.name) < 0) return;
                        }
                        if ($scope.filters.locationFilters.length > 0) {
                            if ($scope.filters.locationFilters.indexOf(a.location.name) < 0) return;
                        }
                        if ($scope.filters.jobFilters.length > 0) {
                            if ($scope.filters.jobFilters.indexOf(a.jobType.name) < 0) return;
                        }
                        return a;
                    });
                };

                $scope.isInFilter = function (a, b) {
                    return $scope.filters[a].indexOf(b.name) >= 0;
                };

                $scope.removeFilters = function (filter) {
                    $scope.filters[filter] = [];
                    $scope.filterJobs();
                };
            }]
        };
    });