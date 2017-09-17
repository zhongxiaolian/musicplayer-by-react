import React from 'react';
import MusicListItem from './musicListItem.js';

class MusicList extends React.Component{
  render(){
    let _this = this;
    let listEle = this.props.musicList.map(function(item){
      return <MusicListItem musicItem={item} focus={item == _this.props.currentMusicItem} key={item.id}/>
    });
    return (
      <ul>
        {listEle}
      </ul>
    )
  }
}
export default MusicList;
