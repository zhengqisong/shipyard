(function() {
    'use strict';

    angular
        .module('shipyard')
        .config([
                '$routeProvider',
                '$httpProvider',
                '$provide',
                'flashProvider',
         function ($routeProvider, $httpProvider, $provide, flashProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            });
            $routeProvider.when('/logout', {
                template: "",
                controller: 'LogoutController'
            });
            $routeProvider.when('/containers/:id/logs', {
                templateUrl: 'templates/container_logs.html',
                controller: 'ContainerLogsController'
            });
            $routeProvider.when('/engines/add', {
                templateUrl: 'templates/engine_add.html',
                controller: 'EngineAddController'
            });
            $routeProvider.when('/engines/:id', {
                templateUrl: 'templates/engine_details.html',
                controller: 'EngineDetailsController'
            });
            $routeProvider.otherwise({
                redirectTo: '/dashboard'
            });
            $provide.factory('httpInterceptor', function ($q, $window, flash, authtoken) {
                return {
                    request: function (config) {
                        return config || $q.when(config);
                    },
                    requestError: function (rejection) {
                        return $q.reject(rejection);
                    },
                    response: function (response) {
                        return response || $q.when(response);
                    },
                    responseError: function (rejection) {
                        switch (rejection.status) {
                            case 401:
                                authtoken.delete();
                                $window.location.href = '/#/login';
                                $window.location.reload();
                                return $q.reject(rejection);
                                break;
                            case 403:
                                flash.error = 'Invalid username/password';
                                break;
                        }
                        return $q.reject(rejection);
                    }
                };
            });
            $httpProvider.interceptors.push('httpInterceptor');
            // messages
            flashProvider.errorClassnames.push('red');
            flashProvider.warnClassnames.push('yellow');
            flashProvider.infoClassnames.push('blue');
            flashProvider.successClassnames.push('green');
         }
    ]);
})();
