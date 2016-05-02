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
}

export default SealedController;
