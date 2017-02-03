angular.module('intrn')
    .factory('Company', ['API_BASE', '$resource', function (API_BASE, $resource) {
        return $resource(API_BASE +  'companies/:company_id', {
            company_id: '@_id'
        }, {
            queryJobs: {
                method: 'GET',
                url: API_BASE + 'companies/:company_id/jobs',
                isArray: true
            }
        });
    }]);