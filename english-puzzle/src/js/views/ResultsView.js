import View from '../base/View';
import LogoutButton from '../components/LogoutButton';
import ResultsFail from '../components/ResultsFail';
import ResultsSuccess from '../components/ResultsSuccess';

export default class ResultsView extends View {
  constructor(container, config) {
    super(container);
    this.config = config;
  }

  getTemplate(words) {
    return `
    <div class="results">
    <div class="results__background"></div>
    ${LogoutButton.render()}
    <div class="results__field">
      ${ResultsFail.render(words.fail)}
      ${ResultsSuccess.render(words.success)}
      <div class="results__buttons">
        <div class="results__button results__continue">Continue</div>
      </div>
    </div>
  </div>
    `;
  }

  handleSoundClick(handlerSound) {
    const resultsContainer = document.querySelector('.results__field');
    resultsContainer.addEventListener('click', ({ target }) => {
      if (!target.classList.contains('word__soundicon')) {
        return;
      }
      handlerSound(target);
    });
  }

  handleMouseLogout(handlerLogout) { // клик по кнопке "Logout"
    const logOutButton = document.querySelector('.logout .logout__button');
    logOutButton.addEventListener('click', () => {
      handlerLogout();
    });
  }

  handleMouseCont(handlerCont) { // клик по кнопке "Continue"
    const buttonCont = document.querySelector('.results__button.results__continue');

    buttonCont.addEventListener('click', () => {
      handlerCont();
    });
  }

  handleMouseGlobal(handlerGlobal) { // клик по кнопке "Global Stat"
    const buttonCont = document.querySelector('.results__button.results__global');

    buttonCont.addEventListener('click', () => {
      handlerGlobal();
    });
  }
}
