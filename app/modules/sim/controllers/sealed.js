class SealedController {
  constructor(SimService, UserService, $state, $stateParams) {
    this._SimService = SimService;
    this._UserService = UserService;
    this._$state = $state;
    this._$stateParams = $stateParams;

    this.edit = false;
    this.title = "";

    console.log(new Date());

    this._UserService.isLoggedIn()
      .then((response) => {
        console.log(response);
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
    console.log("saving title");
    this.edit = false;
  }

  getCards() {
    this._SimService.getSealedPool(this.user.uid, this._$stateParams.id)
      .then((response) => {
        console.log(response);
        this.cardPool = response;
      });
  }

  flipCard() {
    console.log("Flipping Card.");
    // document.querySelector(".flip-container").classList.toggle('flip');
  }

  selectCard(card) {
    console.log(card + "clicked");
    card.selected = true;
    console.log(card);
  }
}

export default SealedController;
