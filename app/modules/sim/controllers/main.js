class MainController {
  constructor($state, UserService, SimService) {
    this._$state = $state;
    this._UserService = UserService;
    this._SimService = SimService;

    this._UserService.isLoggedIn()
      .then((response) => {
        this.user = response;
        this.getPools();
      })
      .catch((error) => {
        this._$state.go("login");
      });
  }

  getPools() {
    this._SimService.getAllPools(this.user.uid)
      .then((response) => {
        console.log(response);
        this.pools = response;
      });
  }

  newSealed() {
    this._SimService.saveSealedPool(this.user)
      .then((response) => {
        console.log(response);
        this._$state.go("sealed", {
          id: response
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }
}

export default MainController;
