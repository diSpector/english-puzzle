export default class Word {
  static render(params, i) {
    return `
        <div class="phrase">
            <div class="number" data-round="${i + 1}">${i + 1}</div>
            <div class="phrase__words">
                ${params.map((el) => `<div class="phrase__word">${el}</div>`).join('')}
            </div>
        </div>
      `;
  }
}
