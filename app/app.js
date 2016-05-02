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

function config($urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
}

App.config(config);
