import React,{Component} from "react";
import MusicListService from "../services/musicListService.js";
import MusicListItem from "./musicListItem.js";

export default class MusicListContent extends Component{
  constructor(){
    super();
    this.state={
      musicType : "stefanie"
    }
  }
  componentWillReceiveProps(props){
    if(props.params.musictype){
      this.setState({
        musicType : props.params.musictype
      });
    }
  }
  render(){
    var _this = this;
    let newMusicList = MusicListService.getMusicList(this.state.musicType);
    let listEle = newMusicList.map(function(item){
      // 通过context获取父组件的值
      return <MusicListItem musicItem={item} focus={item == _this.context.currentMusicItem} key={item.id}/>
    });
    return (
        <ul>
          {listEle}
        </ul>
    );
  }
}
MusicListContent.contextTypes = {
  currentMusicItem : React.PropTypes.object
}
