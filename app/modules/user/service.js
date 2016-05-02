class UserService {
  constructor($q, $firebaseAuth, $firebaseObject) {
    this._$q = $q;
    this._$firebaseObject = $firebaseObject;

    this.ref = new Firebase("https://mtg-limited-sim.firebaseio.com/");
    this.auth = $firebaseAuth(this.ref);

    this.profile = {};
  }

  isLoggedIn() {
    return new this._$q((resolve, reject) => {
      this.auth.$requireAuth()
        .then((response) => {
          this.user = response;
          this.profile = this.getProfile(this.user);
          resolve(this.user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getProfile(user) {
    return this._$firebaseObject(this.ref.child('users').child(user.uid).child("profile"));
  }

  login(user) {
    return new this._$q((resolve, reject) => {
      this.auth.$authWithPassword(user)
        .then((response) => {
          this.user = response;
          this.profile = this.getProfile(this.user);
          resolve(this.user);
        })
        .catch((error) => {
          reject(error);
          console.error("Authentication failed:", error);
        });
      });
  }

  logout() {
    this.auth.$unauth();
  }

  new() {
    return {
      email: "",
      password: ""
    }
  }

  newProfile() {
    return {
      firstName: "",
      lastName: ""
    }
  }

  create(user) {
    return new this._$q((resolve, reject) => {
      this.auth.$createUser(user)
        .then((response) => {
          return this.auth.$authWithPassword(user);
        })
        .then((response) => {
          this.user = response;
          this.profile = this.getProfile(this.user);
          resolve(this.user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  save(profile) {
    this.profile = profile;
    this.profile.$save();
  }
}

export default UserService;
