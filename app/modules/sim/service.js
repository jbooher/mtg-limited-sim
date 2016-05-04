class SimService {
  constructor($http, $q, $firebaseObject, $firebaseArray) {
    this._$http = $http;
    this._$q = $q;
    this._$firebaseObject = $firebaseObject;
    this._$firebaseArray = $firebaseArray;

    this.ref = new Firebase("https://mtg-limited-sim.firebaseio.com/");

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

  saveSealedPool(user) {
    return new this._$q((resolve, reject) => {

      this.sealedPool = this._$firebaseArray(this.ref.child("users").child(user.uid).child("sealed"));

      this.generateSealedPool(user)
        .then((response) => {
          let pool = {
            cards: response,
            date: new Date(),
            title: "Default"
          };
          return this.sealedPool.$add(pool);
        })
        .then((ref) => {
          resolve(ref.key());
        })
        .catch((error) => {
          reject(error);
        })
    });

  }

  generateSealedPool(user) {

    return new this._$q((resolve, reject) => {
      this.cards = [];

      let promises = [];

      for(let i = 0; i < 6; i++) {
        promises.push(this.getPack());
      }

      this._$q.all(promises)
        .then((response) => {

          response.forEach((pack) => {
            pack.forEach((card) => {
              this.cards.push(card);
            });
          });

          resolve(this.cards);

        });
    });

  }

  getAllPools(user) {
    let pools = this._$firebaseArray(this.ref.child("users").child(user).child("sealed"));
    return pools.$loaded();
  }

  getSealedPool(user, id) {
    let pool = this._$firebaseObject(this.ref.child("users").child(user).child("sealed").child(id));
    return pool.$loaded();
  }

}

export default SimService;
