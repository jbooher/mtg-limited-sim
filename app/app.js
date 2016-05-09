import angular from 'angular';
import uiRouter from 'angular-ui-router';

import firebase from 'firebase';
import angularFire from 'angularfire';

import sim from "./modules/sim";
import user from "./modules/user";

let App = angular.module('app', [
  'ui.router',
  'firebase',

  'jb.sim',
  'jb.user'
]);

function config($urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise("/");
  $httpProvider.interceptors.push('httpInterceptor');
}

App.config(config);

App.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
});

App.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
      $scope.$on("loader_show", function () {
          if (element.hasClass("hidden")) {
              element.removeClass("hidden")
          }
       });
       return $scope.$on("loader_hide", function () {
           if(!element.hasClass("hidden")){
               element.addClass("hidden")
           }
       });
   }
});
