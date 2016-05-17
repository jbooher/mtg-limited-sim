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

  getSet(set) {
    return new this._$q((resolve, reject) => {
      this._$http
        .get(`https://api.magicthegathering.io/v1/sets/${set}`)
        .then((response) => {
          this.set = response.data;
          resolve(this.set);
        })
        .catch((error) => {
          reject(this.error);
        })
    })
  }

  addLand(land, num) {

    const hasLands = ["LEA", "LEB", "2ED", "CED", "CEI", "3ED",
    "4ED", "ICE", "RQS", "pARL", "MIR", "ITP", "5ED", "POR",
    "pPRE", "TMP", "pJGP", "PO2", "UGL", "pALP", "USG", "ATH",
    "6ED", "PTK", "S99", "pGRU", "MMQ", "BRB", "pELP", "S00", "INV",
    "7ED", "ODY", "ONS", "8ED", "MRD", "CHK", "UNH", "9ED", "RAV",
    "CST", "TSP", "10E", "MED", "LRW", "SHM", "ALA", "DDC", "M10",
    "HOP", "ME3", "ZEN", "H09", "DDE", "ROE", "ARC", "M11", "DDF",
    "SOM", "MBS", "DDG", "NPH", "CMD", "M12", "DDH", "ISD", "DDI",
    "AVR", "PC2", "M13", "RTR", "DDK", "M14", "DDL", "THS", "C13",
    "MD1", "M15", "DDN", "KTK", "C14", "DD3_DVD", "FRF", "DDO",
    "DTK", "TPR", "ORI", "DDP", "BFZ", "C15", "DDQ", "SOI"];

    let landSet = this.pool.set;

    if (hasLands.indexOf(landSet) === -1) {
      landSet = 'BFZ';
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

  delete(pool) {
    this.pools.$remove(pool);
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
