export default {
  obj: {
    containers: {
      siteContainer: '.container',
    },
    eventHandlers: {
      userIsLogin: 'logUser',
      userIsLogout: 'logOutUser',
      startClicked: 'startClicked',

    },
    pages: {
      login: {
        controller: 'LoginController',
        model: 'LoginModel',
        view: 'LoginView',
        controllerConfig: {
          events: {
            logUser: 'userIsLogin',
          },
        },
        viewConfig: {
          loginButton: '.login .login__button .button__login',
          registerButton: '.login .register__button .button__register',
          emailInput: '.login .form__credentials .form__input .email',
          passInput: '.login .form__credentials .form__input .password',
          emailErrorBlock: '.email.input__error',
          passErrorBlock: '.password.input__error',
          apiErrorBlock: '.input__error.register__error',
        },
        modelConfig: {
          errors: {
            email: 'Email must be valid',
            pass: 'Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 char from +-_@$!%*?&#.,;:[]{}',
          },
          regExp: {
            email: /^[-.\w]+@(?:[a-z\d]{2,}\.)+[a-z]{2,6}$/,
            pass: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\+\-_@\$\!\%\*\?\&#\.,;\:\[\]\{\}])[\S]{8,}$/,
          }
        },
      },
      start: {
        controller: 'StartController',
        model: 'StartModel',
        view: 'StartView',
        controllerConfig: {
          events: {
            startClicked: 'startClicked',
          },
        },
        viewConfig: {
          startButton: '.start .start__block .button__start',
        },
      },
      game: {
        controller: 'GameController',
        model: 'GameModel',
        view: 'GameView',
        controllerConfig: {
          events: {
            startClicked: 'startClicked',
          },
          maxLevels: 6,
          maxPages: 30,
        },
        modelConfig: {
          wordsUrl: 'https://afternoon-falls-25894.herokuapp.com/words?',
          wordsCountUrl: 'https://afternoon-falls-25894.herokuapp.com/words/count?',
          // maxLevels: 20,
          // maxPages: 30,
        },
        viewConfig: {
          startButton: '.start .start__block .button__start',
        },
      },
      stat: {},
    }

  }
  // star : {},
  // game,
  // stat
  // defaults: {
  //   language: 'en',
  //   units: 'M',
  //   tags: 'summer,day',
  // },

  // languagesCodes: {
  //   en: 'en-US',
  //   ru: 'ru-RU',
  //   be: 'be-BY',
  // },

  // // containers selectors
  // loaderSelector: '.loader',
  // langsContainer: '.button__lang',
  // langsMenu: '.lang__alllangs',
  // unitsContainer: '.button__temp',
  // reloadButton: '.button__reload',
  // reloadIcon: '.icon__reload',
  // soundButton: '.button__sound',
  // searchButton: '.search__button',
  // searchInput: '.search__input input',
  // micIcon: '.mic',
  // errorContainer: '.error__block',
  // cityContainer: '.city',
  // dateContainer: '.date',
  // tempNowContainer: '.today__temperature',
  // tempNowIcon: '.info__icon',
  // overcastContainer: '.overcast',
  // feelsContainer: '.feels',
  // windContainer: '.wind',
  // humidityContainer: '.humidity',
  // daysContainer: '.weather__3days',
  // dayContainer: '.weather__tomorrow',
  // dayTempContainer: '.temperature__value',
  // dayNameContainer: '.weekday__name',
  // dayTempIcon: '.temperature__icon',
  // mapContainer: '.location__map',
  // latitudeContainer: '.latitude',
  // longitudeContainer: '.longitude',

  // unitsObj: {
  //   container: '.button__temp',
  //   spec: '.temptype',
  //   data: 'units',
  // },

  // langObj: {
  //   container: '.button__lang',
  //   spec: '.alllangs',
  //   data: 'lang',
  //   value: '.lang__value',
  // },

  // css
  // opacityStyle: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%)',
}; //
