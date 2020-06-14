import Model from '../base/Model';

export default class ResultsModel extends Model {
  constructor(config) {
    super();
    this.config = config;
  }

  processSound(htmlEl, allWords) {
    const audioName = this.getAudioName(htmlEl, allWords);
    this.playAudio(audioName);
  }

  getAudioName(target, allWords) {
    const [key, index] = target.dataset.sound.split('-');
    return allWords[key][index].audio;
  }

  playAudio(soundFile) { // озвучить предложение
    const url = `${this.config.wordsSoundUrl}${soundFile}`;
    const audio = new Audio(url);
    audio.play();
  }
}
