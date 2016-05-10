class SealedController {
  constructor(SimService, UserService, $state, $stateParams) {
    this._SimService = SimService;
    this._UserService = UserService;
    this._$state = $state;
    this._$stateParams = $stateParams;

    this.edit = false;
    this.display = 'sealed';
    this.filterOption = "#";
    this.filter = {};
    this.order = ['colors.length', 'colors', 'cmc', 'name'];
    this.showFilter = false;
    this.showSort = false;

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

  saveDeck() {
    this._SimService.save();
  }

  getCards() {
    this._SimService.getSealedPool(this.user.uid, this._$stateParams.id)
      .then((response) => {
        this.cardPool = response;
        console.log(this.cardPool);
        this.title = this.cardPool.title;
      });
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  displayDeck() {
    this.display = 'deck';
  }

  displaySealed() {
    this.display = 'sealed';
  }

  displaySort() {
    this.showSort = true;
    this.showFilter = false;
  }

  displayFilter() {
    this.showFilter = true;
    this.showSort = false;
  }

  hideMenu() {
    this.showFilter = false;
    this.showSort = false;
  }

  filterCards(property) {
    console.log(property);
    console.log(this.filterOption);

    if (property === 'cmc') {
      this.filterOption = Number(this.filterOption);
    }

    if (this.filterOption === "#" || this.filterOption === undefined) {
      alert("Please select an option.");
    }
    else {
      this.filter[property] = this.filterOption;
      console.log(this.filter);
    }
  }

  resetFilters() {
    this.filterOption = "#";
    this.filter = {};
  }
}

export default SealedController;
