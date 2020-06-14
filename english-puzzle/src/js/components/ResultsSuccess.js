export default class ResultsSuccess {
  static render(words) {
    return `
      <div class="results__block results__success">
        <div class ="block__title success__title">
            I know <span class="count__iknow">${words.length}</span>
        </div>
        <div class="block__words success__words">
        ${words.map((word, i) => `
        <div class="block__word success__word">
          <div class="word__soundicon" data-sound="success-${i}"></div>
          <div class="word__text">${word.text}</div>  
        </div>
        `).join('')}
        </div>
      </div>
      `;
  }
}
