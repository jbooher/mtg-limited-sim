import angular from "angular";

import config from "./config";
import DraftController from "./controllers/draft";
import MainController from "./controllers/main";
import SealedController from "./controllers/sealed";
import service from "./service";

let sim = angular.module("jb.sim", []);

sim.config(config);
sim.controller("DraftController", DraftController);
sim.controller("MainController", MainController);
sim.controller("SealedController", SealedController);
sim.service("SimService", service);

export default sim;
