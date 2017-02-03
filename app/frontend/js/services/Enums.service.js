angular.module('intrn')
    .factory('Enums', ['API_BASE', '$resource', function (API_BASE, $resource) {
        return $resource(API_BASE + 'enums');
    }]);