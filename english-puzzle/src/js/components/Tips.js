export default class Tips {
  static render(tipsMenuConfig) {
    return `
    <div class="tips">
      <div class="tip__button autosound ${tipsMenuConfig.autosound ? 'pushed' : ''}" data-tip="autosound" title="Autoplay phrase"></div>
      <div class="tip__button translate  ${tipsMenuConfig.translate ? 'pushed' : ''}" data-tip="translate" title="Translation for phrase"></div>
      <div class="tip__button audio  ${tipsMenuConfig.audio ? 'pushed' : ''}" data-tip="audio" title="Listen pronunciation"></div>
      <div class="tip__button picture  ${tipsMenuConfig.picture ? 'pushed' : ''}" data-tip="picture" title="Picture tip"></div>
    </div>
    `;
  }
}
