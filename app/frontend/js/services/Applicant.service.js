angular.module('intrn')
    .factory('Applicant', ['API_BASE', '$resource', function (API_BASE, $resource) {
        return $resource(API_BASE +  'applicants/:applicant_id', {
            applicant_id: '@_id'
        });
    }]);