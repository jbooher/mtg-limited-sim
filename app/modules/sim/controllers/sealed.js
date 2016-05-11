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

  saveDeck() {
    this._SimService.save();
  }

  getCards() {
    this._SimService.getSealedPool(this.user.uid, this._$stateParams.id)
      .then((response) => {
        this.cardPool = response;
        this.deck = response.cards.filter((card) => {
          return card.selected === true;
        });
        console.log(this.deck);
        console.log(this.cardPool);
        this.title = this.cardPool.title;
      });
  }

  addCard(card) {
    card.selected = true;

    this.deck.push(card);
    // this._SimService.save();
  }

  removeCard(card) {
    card.selected = false;

    this.deck.splice(this.deck.indexOf(card), 1);
    // this._SimService.save();
  }

  addLands(land) {
    for(let i = 0; i < this.numLands; i++) {
      this.deck.push({
        name: land,
        imageUrl: `../assets/${land}.jpeg`,
        selected: true
      });
    }

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
