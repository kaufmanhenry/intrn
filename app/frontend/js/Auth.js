//This code was written by Jake Billings. He's a great developer. You can learn more about him at jakebillings.com
angular.module('intrn')
    .factory('Token', ['$cookies', function ($cookies) {
        var Token = {};

        Token._tokenCookie = 'intrnToken';

        Token.getToken = function () {
            return $cookies.get(Token._tokenCookie);
        };

        Token.removeToken = function () {
            return $cookies.remove(Token._tokenCookie);
        };

        Token.setToken = function (token) {
            $cookies.put(Token._tokenCookie, token);
        };

        return Token;
    }])
    .factory('Auth', ['Token', '$http', '$auth', '$location', 'API_BASE', '$rootScope', '$timeout', 'User', 'jwtHelper',
        function (Token, $http, $auth, $location, API_BASE, $rootScope, $timeout, User, jwtHelper) {
            var Auth = {};

            var PROVIDER = 'google';

            Auth.getTokenPayload = function () {
                var token = Token.getToken();
                if (!token) return null;
                return jwtHelper.decodeToken(token);
            };

            Auth.logout = function () {
                Token.removeToken();
                Auth._sendAuthEvent();
            };

            Auth._sendAuthEvent = function () {
                var payload = Auth.getTokenPayload();
                if (payload && payload.user) {
                    $timeout(function () {
                        User.get({user_id: payload.user}, function (user) {
                            $rootScope.$broadcast('Authentication', {
                                user: user
                            });
                        }, Error.handle);
                    }, 1);
                } else {
                    $rootScope.$broadcast('Authentication', {
                        user: null
                    });
                }
            };

            var payload = Auth.getTokenPayload();
            if (payload) {
                User.get({user_id: payload.user}, function () {
                    Auth._sendAuthEvent();
                }, function () {
                    Auth.logout();
                });
            } else {
                Auth._sendAuthEvent();
            }

            Auth.authEndpoint = function (credentials) {
                return $http.post(API_BASE + 'auth', credentials);
            };

            Auth.auth = function (callback) {
                Token.removeToken();

                return $auth.authenticate(PROVIDER).then(function (res) {
                    var data = res.data;

                    Token.setToken(data);
                    Auth._sendAuthEvent();

                    callback();
                });
            };

            return Auth;
        }])
    .factory('AuthInterceptor', ['Token', function (Token) {
        return {
            request: function (config) {
                config.headers.token = Token.getToken();

                return config;
            }
        };
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);