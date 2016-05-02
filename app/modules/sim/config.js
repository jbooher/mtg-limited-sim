function config($stateProvider) {
  $stateProvider
    .state("main", {
      url: "/",
      controller: "MainController as mainCtrl",
      template: require("./views/main.html")
    })
    .state("sealed", {
      url: "/sealed/:id",
      controller: "SealedController as sealedCtrl",
      template: require("./views/sealed.html")
    })
    .state("draft", {
      url: "/draft/:id",
      controller: "DraftController as draftCtrl",
      template: require("./views/draft.html")
    });
}

export default config;
