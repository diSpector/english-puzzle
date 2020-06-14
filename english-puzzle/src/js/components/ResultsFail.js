export default class ResultsFail {
  static render(words) {
    return `
    <div class="results__block results__fail">
      <div class="block__title fail__title">
        I don't know <span class="count__idk">${words.length}</span>
      </div>
      <div class="block__words fail__words">
        ${words.map((word, i) => `
          <div class="block__word fail__word">
            <div class="word__soundicon" data-sound="fail-${i}"></div>
            <div class="word__text">${word.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
    `;
  }
}
