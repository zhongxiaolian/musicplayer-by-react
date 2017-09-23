import {MUSIC_LIST} from "../config/songConfig.js";

export default {
  getMusicList(musicType){
    let newMusicList = MUSIC_LIST.filter(function(item){
      return item.type==musicType;
    });
    return newMusicList;
  }
}
