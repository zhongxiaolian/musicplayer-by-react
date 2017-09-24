import React,{Component} from "react";
import MusicListService from "../services/musicListService.js";
import MusicListItem from "./musicListItem.js";

export default class MusicListContent extends Component{
  constructor(){
    super();
    this.state={
      musicType : "stefanie",
      musicList : null
    }
  }
  componentWillReceiveProps(props){
    if(props.params.musictype){
      let newMusicList = MusicListService.getMusicList(this.state.musicType);
      this.setState({
        musicList : newMusicList,
        musicType : props.params.musictype
      });
    }
  }
  componentDidMount(){
    let newMusicList = MusicListService.getMusicList(this.state.musicType);
    this.setState({
      musicList : newMusicList
    });
  }
  // 通过回调函数，点击删除按钮删除条目
  deleteMusic(item){
    let list = this.state.musicList.filter(function(i){
      return i !== item;
    });
    this.setState({
      musicList : list
    });
  }
  render(){
    var _this = this;
    let listEle = null;
    if(this.state.musicList){
      listEle = this.state.musicList.map(function(item){
        // 通过context获取父组件的值
        return <MusicListItem musicItem={item} focus={item == _this.context.currentMusicItem} key={item.id}
        delete={_this.deleteMusic.bind(_this)}/>
      });
    }
    return (
        <ul>
          {listEle}
        </ul>
    );
  }
}
//通过context获取父组件的传值
MusicListContent.contextTypes = {
  currentMusicItem : React.PropTypes.object
}
