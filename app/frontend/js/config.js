angular.module('intrn')
    .constant('API_BASE', '/api/')
    //The time before a post expires
    .constant('POST_EXPIRATION', 90)
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                template: '<intrn-home-view></intrn-home-view>'
            })
            .when('/privacy', {
                template: '<intrn-privacy-view></intrn-privacy-view>'
            })
            .when('/dashboard', {
                resolveRedirectTo: ['Auth', function (Auth) {
                    var payload = Auth.getTokenPayload();
                    if (payload) {
                        return '/users/' + payload.user || payload.user._id;
                    }

                    return '/';
                }]
            })
            .when('/users/:user_id', {
                template: '<intrn-dashboard-view></intrn-dashboard-view>'
            })
            .when('/companies/:company_id', {
                template: '<intrn-company-view></intrn-company-view>'
            })
            .when('/companies/:company_id/internships/:job_id', {
                template: '<intrn-internship-view></intrn-internship-view>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .config(['$authProvider', function ($authProvider) {
        $authProvider.google({
            clientId: '941216388351-2h4l60ast77vft9o1ugkat7ikjloiq9o.apps.googleusercontent.com'
        });

        $authProvider.baseUrl = '/api';
    }]);