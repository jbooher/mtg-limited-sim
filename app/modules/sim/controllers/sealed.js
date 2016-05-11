class SealedController {
  constructor(SimService, UserService, $state, $stateParams, $firebaseObject) {
    this._$firebaseObject = $firebaseObject;
    this._SimService = SimService;
    this._UserService = UserService;
    this._$state = $state;
    this._$stateParams = $stateParams;

    this.edit = false;
    this.display = 'sealed';
    this.filterOption = "#";
    this.filter = {};
    this.sort = ['colors.length', 'colors', 'cmc', 'name'];
    this.showFilter = false;
    this.showSort = false;
    this.showLands = false;
    this.numLands = 0;

    this._UserService.isLoggedIn()
      .then((response) => {
        this.user = response;
        this.getCards();
      })
      .catch((error) => {
        this._$state.go("login");
      });

  }

  editTitle() {
    this.edit = !this.edit;
  }

  saveTitle() {
    this._SimService.saveTitle(this.title);
    this.edit = false;
  }

  getCards() {
    this._SimService.getSealedPool(this.user.uid, this._$stateParams.id)
      .then((response) => {
        this.sealedPool = response[0];
        this.cards = response[1];
        this.title = this.sealedPool.title;
        this.count = 0;
        this.cards.forEach((card) => {
          if(card.selected === true) {
            this.count += 1;
          }
        })
      });
  }

  toggleCard(card) {
    if (card.selected === false) {
      this.count += 1;
    }
    else {
      this.count -= 1;
    }

    card.selected = !card.selected;
    this._SimService.save(card);
  }

  addLands(land) {
    this._SimService.addLand(land, this.numLands);
    this.count += this.numLands;
    this.numLands = 0;
  }

  displayChange() {
    if (this.display === 'sealed') {
      this.display = 'deck';
    }
    else {
      this.display = 'sealed';
    }
  }

  displaySort() {
    this.showFilter = false;
    this.showLands = false;
    this.showSort = !this.showSort;
  }

  displayFilter() {
    this.showSort = false;
    this.showLands = false;
    this.showFilter = !this.showFilter;
  }

  displayLands() {
    this.showFilter = false;
    this.showSort = false;
    this.showLands = !this.showLands;
  }

  hideMenus() {
    this.showFilter = false;
    this.showSort = false;
    this.showLands = false;
  }

  sortCards(option) {
    if(this.sort.indexOf('colors.length') >= 0) {
      this.sort = [];
    }

    this.sort.push(option);
  }

  resetSort() {
    this.sort = ['colors.length', 'colors', 'cmc', 'name'];
  }

  filterCards(property) {
    if (property === 'cmc') {
      this.filterOption = Number(this.filterOption);
    }
    else {
      this.filter[property] = this.filterOption;
    }
  }

  resetFilters() {
    this.filterOption = "#";
    this.filter = {};
  }
}

export default SealedController;
