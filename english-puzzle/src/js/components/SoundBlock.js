export default class SoundBlock {
  static render(isSound) {
    return `
      <div class="sound__block">
        <div class="sound__icon ${isSound ? '' : 'disabled'}"></div>
      </div>
    `;
  }
}
