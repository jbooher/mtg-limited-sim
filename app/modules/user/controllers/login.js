class LoginController {
  constructor($state, UserService) {
    this._$state = $state;
    this._UserService = UserService;

    this.user = this._UserService.new();
  }

  login() {
    this._UserService.login(this.user)
      .then((response) => {
        this._$state.go("main");
      })
  }
}

export default LoginController;
