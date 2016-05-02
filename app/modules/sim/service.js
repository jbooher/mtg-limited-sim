class SimService {
  constructor($http, $q) {
    this._$http = $http;
    this._$q = $q;

    this.cardPool = [];
  }

  getPack() {
    return new this._$q((resolve, reject) => {
      this._$http
        .get(`https://api.magicthegathering.io/v1/sets/soi/booster`)
        .then((response) => {
          this.pack = response.data.cards;
          resolve(this.pack);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getSealedPool() {
    for(let i = 0; i < 6; i++) {

      this.getPack()
        .then((response) => {
          response.forEach((card) => {
            if(card.selected === undefined) {
              card.selected = false;
            }
            this.cardPool.push(card);
          });
          console.log(this.cardPool);
        });

    }
    return this.cardPool;
  }

}

export default SimService;
