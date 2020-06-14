export default class Translation {
  static render(word, isTranslate) {
    return `
    <div class="translation__block">
      ${isTranslate ? word.textExampleTranslate : ''}
    </div>
    `;
  }
}
