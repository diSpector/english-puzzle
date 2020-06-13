import View from '../base/View';

export default class StartView extends View {
  constructor(container, config) {
    super(container);
    this.config = config;
  }

  processStart(handlerStart) {
    const startButton = document.querySelector(this.config.startButton);
    startButton.addEventListener('click', () => {
      handlerStart();
    });
  }

  getTemplate() {
    return `
    <div class="start">
        <div class="start__block">
            <div class="start__title">English Puzzle</div>
            <div class="start__text">
                <p>Click on words, collect phrases. <br>
                Words can be drag and drop. Select tooltips in the menu.</p>
            </div>
            <div class="button__start">Start!</div>
        </div>
    </div>
    `;
  }
}
