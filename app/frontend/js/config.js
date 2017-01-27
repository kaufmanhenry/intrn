angular.module('intrn')
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                template: '<intrn-home-view></intrn-home-view>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);