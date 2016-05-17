class MainController {
  constructor($state, UserService, SimService) {
    this._$state = $state;
    this._UserService = UserService;
    this._SimService = SimService;

    this.set = "#";

    this._UserService.isLoggedIn()
      .then((response) => {
        this.user = response;
        this.getPools();
        this.getSets();
      })
      .catch((error) => {
        this._$state.go("login");
      });
  }

  getPools() {
    this._SimService.getAllPools(this.user.uid)
      .then((response) => {
        this.pools = response;
      });
  }

  getSets() {
    this._SimService.getAllSets()
      .then((response) => {
        this.sets = [];

        response.forEach((set) => {
          if(set.booster !== undefined) {
            this.sets.push(set);
          }
        });
      });
  }

  newSealed() {
    if(this.set !== "#") {

      this._SimService.saveSealedPool(this.user, this.set)
        .then((response) => {
          this._$state.go("sealed", {
            id: response
          });
        })
        .catch((error) => {
          console.error(error);
        });

    }
    else {
      alert("You must select a set.");
    }
  }

  deletePool(pool) {
    let confirmed = confirm(`Are you sure you want to delete: ${pool.title}`);

    if(confirmed) {
      this._SimService.delete(pool);
    }
  }

  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }
}

export default MainController;
