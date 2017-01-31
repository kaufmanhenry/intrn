angular.module('intrn')
    .factory('Error', ['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
        var Error = {};

        Error.error = null;

        Error.logoutUser = function () {
            Auth.logout();
        };

        Error.statusRedirects = {
            403: {
                path: '/login'
            },
            other: {
                path: '/'
            }
        };

        Error.handle = function (e) {
            console.error(e);
            Error.error = e;

            if (!e) return;

            var status = e.status;
            var data = e.data || e;

            if (status && Error.statusRedirects[status]) {
                var a = Error.statusRedirects[status];
                if (a.handle) return a.handle(data);
                return $location.path(a.path);
            } else {
                // Error.statusRedirects.other.code();
                $location.path(Error.statusRedirects.other.path);
            }

            Error.logoutUser();

        };

        return Error;
    }]);