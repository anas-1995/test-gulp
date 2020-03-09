(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'permissions'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, permissions) {
        var service = {};

        //    service.Login = Login;
        service.setLoggedUser = setLoggedUser;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.getUserRole = getUserRole;
        service.getUserId = getUserId;
        service.setSelectedBusiness = setSelectedBusiness
        service.getSelectedBusiness = getSelectedBusiness
        return service;

        function setLoggedUser() {
            return $rootScope.globals;
        }
        function getSelectedBusiness() {
            var obj = $cookies.get('selectedBusiness')
            if (obj == null)
                return;
            return JSON.parse(obj);
        }


        function setSelectedBusiness(item) {
            $cookies.putObject('selectedBusiness', { "id": item.id, "name": item.name });
        }


        function SetCredentials(email, password, token, loggedUser) {
            var user = {
                id: loggedUser.id,
                name: loggedUser.name,
                photo: loggedUser.photo,
                roles: loggedUser.roles
            };
            var role = "Admin"
            $rootScope.globals = {
                currentUser: {
                    token: token,
                    loggedUser: user
                }
            };
            //console.log(" $rootScope.globals ",  $rootScope.globals);

            $http.defaults.headers.common.token = token;
            // set default auth header for http requests
            // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            // console.log("$http.defaults.headers.common ", $http.defaults.headers.common);
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
            permissions.setPermissions(loggedUser.roles, loggedUser.businesses);
            setLoggedUser();
            return;
        }


        function getUserRole() {
            var roles = $rootScope.globals.currentUser.loggedUser.roles;
            for (let index = 0; index < roles.length; index++) {
                const element = roles[index];
                if (element.id == 1) {
                    return "ADMIN"
                }
                else if (element.id == 2) {
                    return "BUSINESS"
                }
            }
        }

        function getUserId() {
            return $rootScope.globals.currentUser.loggedUser.id
        }

        function ClearCredentials() {
            // console.log("AuthenticationService ClearCredentials");
            // $rootScope.globals = {};
            delete $rootScope.globals
            $cookies.remove('globals');
            $cookies.remove('selectedBusiness');
            $http.defaults.headers.common.token = '';
        }
    }

})();