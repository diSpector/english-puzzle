import View from '../base/View';
import LogoutButton from '../components/LogoutButton';
import GlobalResults from '../components/GlobalResults';

export default class GlobalView extends View {
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
      ${GlobalResults.render(words)}
      <div class="results__buttons">
        <div class="results__button results__continue">Continue</div>
      </div>
    </div>
  </div>
    `;
  }
}
