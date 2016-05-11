class SimService {
  constructor($http, $q, $firebaseObject, $firebaseArray) {
    this._$http = $http;
    this._$q = $q;
    this._$firebaseObject = $firebaseObject;
    this._$firebaseArray = $firebaseArray;

    this.ref = new Firebase("https://mtg-limited-sim.firebaseio.com/");
  }

  getPack(set) {
    return new this._$q((resolve, reject) => {
      this._$http
        .get(`https://api.magicthegathering.io/v1/sets/${set}/booster`)
        .then((response) => {
          this.pack = response.data.cards;
          resolve(this.pack);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAllSets() {
    return new this._$q((resolve, reject) => {
      this._$http
        .get(`https://api.magicthegathering.io/v1/sets`)
        .then((response) => {
          this.sets = response.data.sets;
          resolve(this.sets);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  saveSealedPool(user, set) {
    return new this._$q((resolve, reject) => {

      this.sealedPool = this._$firebaseArray(this.ref.child("users").child(user.uid).child("sealed"));

      this.generateSealedPool(set)
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

  generateSealedPool(set) {

    return new this._$q((resolve, reject) => {
      this.cards = [];

      let promises = [];

      for(let i = 0; i < 6; i++) {
        promises.push(this.getPack(set));
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
    this.pools = this._$firebaseArray(this.ref.child("users").child(user).child("sealed"));
    return this.pools.$loaded();
  }

  getSealedPool(user, id) {
    this.pool = this._$firebaseObject(this.ref.child("users").child(user).child("sealed").child(id));
    return this.pool.$loaded();
  }

  saveTitle(title) {
    this.pool.title = title;
    this.pool.$save();
  }

  save() {
    this.pool.$save();
  }
}

export default SimService;
