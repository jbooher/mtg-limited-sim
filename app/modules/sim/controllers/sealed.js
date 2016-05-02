class SealedController {
  constructor(SimService) {
    this._SimService = SimService;


    this.cardPool = [];

    this.cardPool = this._SimService.getSealedPool();
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
