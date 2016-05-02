function config($stateProvider) {
  $stateProvider
    .state("login", {
      url: "/login",
      controller: "LoginController as loginCtrl",
      template: require("./views/login.html")
    })
    .state("register", {
      url: "/register",
      controller: "RegisterController as registerCtrl",
      template: require("./views/register.html")
    });
}

export default config;
