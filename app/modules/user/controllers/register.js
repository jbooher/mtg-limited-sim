class RegisterController {
  constructor($state, UserService) {
    this._$state = $state;
    this._UserService = UserService;

    this.newUser = this._UserService.new();
    this.newProfile = this._UserService.newProfile();
  }

  register() {
    this._UserService.create(this.newUser)
      .then((response) => {
        this.user = response;
        this.profile = this._UserService.getProfile(this.user);
        this.profile.firstName = this.newProfile.firstName;
        this.profile.lastName = this.newProfile.lastName;

        this._UserService.save(this.profile);
        this._$state.go("main");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default RegisterController;
