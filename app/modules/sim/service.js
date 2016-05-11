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

  addLand(land, num) {

    const nonstandalone = ['ARN', 'ATQ', 'LEG', 'DRK', 'FEM', 'HML'];
    let landSet = this.pool.set;

    if (nonstandalone.indexOf(landSet) > -1) {
      landSet = 'ICE';
    }

    this._$http
      .get(`https://api.magicthegathering.io/v1/cards?supertypes=Basic&types=land&name=${land}&set=${landSet}`)
      .then((response) => {
        let landCards = response.data.cards;

        for(let i = 0; i < num; i++) {
          let card = landCards[Math.floor(Math.random() * landCards.length)];
          card.selected = true;
          this.cards.$add(card);
        }

      })

  }

  saveSealedPool(user, set) {
    return new this._$q((resolve, reject) => {

      this.allPools = this._$firebaseArray(this.ref.child("users").child(user.uid).child("sealed"));

      let newPool = {
        date: new Date(),
        title: "Default",
        set: set
      };

      let key = '';

      this.allPools.$add(newPool)
        .then((ref) => {
          key = ref.key();
          return this.generateSealedPool(set);
        })
        .then((response) => {
          let pool = this._$firebaseArray(this.ref.child("users").child(user.uid).child("sealed").child(key).child("cards"));

          response.forEach((card) => {
            card.selected = false;
            pool.$add(card);
          });

          resolve(key);
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
    this.poolId = id;
    this.user = user;
    this.pool = this._$firebaseObject(this.ref.child("users").child(user).child("sealed").child(id));
    this.cards = this._$firebaseArray(this.ref.child("users").child(user).child("sealed").child(id).child("cards"));

    return this._$q.all([this.pool.$loaded(), this.cards.$loaded()]);
  }

  saveTitle(title) {
    this.pool.title = title;
    this.pool.$save();
  }

  save(card) {
    return this.ref.child("users").child(this.user).child("sealed").child(this.poolId).child("cards").child(card.$id)
      .update({ selected: card.selected });
  }
}

export default SimService;
