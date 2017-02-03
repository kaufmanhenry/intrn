angular.module('intrn')
    .factory('Job', ['API_BASE', '$resource', function (API_BASE, $resource) {
        return $resource(API_BASE +  'jobs/:job_id', {
            job_id: '@_id'
        }, {
            queryApplicants: {
                method: 'GET',
                url: API_BASE + 'jobs/:job_id/applicants',
                isArray: true
            }
        });
    }]);