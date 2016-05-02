import angular from "angular";

import config from "./config";
import LoginController from "./controllers/login";
import RegisterController from "./controllers/register";
import service from "./service";

let user = angular.module("jb.user", []);

user.config(config);
user.controller("LoginController", LoginController);
user.controller("RegisterController", RegisterController);
user.service("UserService", service);

export default user;
