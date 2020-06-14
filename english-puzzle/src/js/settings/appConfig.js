export default {
  obj: {
    containers: {
      siteContainer: '.container',
    },
    eventHandlers: {
      userIsLogin: 'logUser',
      logOutUser: 'logOutUser',
      startClicked: 'startClicked',
      saveStatistics: 'saveStatistics',
      saveTips: 'saveTipsToLocalStorage',
      goToResults: 'goToResults',
      saveRoundWord: 'saveRoundWordToLocalStorage',
      clearRound: 'clearRoundWordFromLocalStorage',
      goBackToGame: 'goToGame',
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
            pass: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[+\-_@$!%*?&#.,;:[\]{}])[\S]{8,}$/,
            // pass:
            // ^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\+\-_@\$\!\%\*\?\&#\.,;\:\[\]\{\}])[\S]{8,}$/
          },
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
            saveStats: 'saveStatistics',
            saveTips: 'saveTips',
            logOutUser: 'logOutUser',
            resClicked: 'goToResults',
            saveRound: 'saveRoundWord',
            clearRound: 'clearRound',
          },
          maxLevels: 6,
          maxPages: 30,
        },
        modelConfig: {
          wordsUrl: 'https://afternoon-falls-25894.herokuapp.com/words?',
          wordsCountUrl: 'https://afternoon-falls-25894.herokuapp.com/words/count?',
          wordsSoundUrl: 'https://raw.githubusercontent.com/dispector/rslang-data/master/data/',
        },
        viewConfig: {
          startButton: '.start .start__block .button__start',
        },
      },
      results: {
        controller: 'ResultsController',
        model: 'ResultsModel',
        view: 'ResultsView',
        controllerConfig: {
          events: {
            logOutUser: 'logOutUser',
            contClicked: 'goBackToGame',
            clearRound: 'clearRound',
          },
        },
        modelConfig: {
          wordsSoundUrl: 'https://raw.githubusercontent.com/dispector/rslang-data/master/data/',
        },
        viewConfig: {
        },
      },
    },

  },
};
