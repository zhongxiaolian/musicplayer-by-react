import React from "react";
import "../styles/musicListItem.less";
import Pubsub from "pubsub-js";

class MusicListItem extends React.Component{
  playMusic(item){
    Pubsub.publish("PLAY_MUSIC",item);
  }
  deleteMusic(e){
    e.stopPropagation();
    // Pubsub.publish("DELETE_MUSIC",item);
    this.props.delete && this.props.delete();
  }
  render(){
    let musicItem = this.props.musicItem;
    return (
      <li className={`components-listitem row ${this.props.focus ? " focus ":""}`} onClick={this.playMusic.bind(this,musicItem)}>
        <p className="content">{musicItem.title}-{musicItem.artist}</p>
        <p className="-col-auto delete" onClick={this.deleteMusic.bind(this)}></p>
      </li>
    );
  }
}
export default MusicListItem;
