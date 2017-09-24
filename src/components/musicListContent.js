import React,{Component} from "react";
import MusicListService from "../services/musicListService.js";
import MusicListItem from "./musicListItem.js";

export default class MusicListContent extends Component{
  constructor(){
    super();
    this.state={
      musicType : "stefanie",
      musicList : MusicListService.getMusicList("stefanie")
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
  // 通过回调函数，点击删除按钮删除条目
  deleteMusic(item){
    let list = this.state.musicList.filter(function(i){
      return i !== item;
    });
    this.setState({
      musicList : list
    });
  }

  componentDidMount(){
    // let musicContent = this.refs.musicContent;
    // let musicContentHeight = musicContent.offsetHeight;
    // let musicContentParentHeight = musicContent.parentElement.offsetHeight;
    // let startY = 0;
    // let moveY = 0;
    // let maxDistance = 200;
    // let totalMove = 0;
    // musicContent.addEventListener("touchstart",function(e){
    //   startY = e.touches[0].clientY;
    // })
    // musicContent.addEventListener("touchmove",function(e){
    //   moveY = e.touches[0].clientY-startY;
    //   console.log(moveY);
    //   console.log(totalMove + moveY);
    //   if(totalMove+moveY>(musicContentHeight-musicContentParentHeight)+maxDistance){
    //     totalMove = (musicContentHeight-musicContentParentHeight)+maxDistance;
    //   }else if(totalMove+moveY<-(maxDistance)){
    //     totalMove = -(maxDistance);
    //   }else{
    //   }
    //   musicContent.style.transform = "translateY("+(totalMove + moveY)+"px)";
    // })
    // musicContent.addEventListener("touchend",function(e){
    //   totalMove = totalMove + moveY;

    // })
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
        <ul ref="musicContent">
          {listEle}
        </ul>
    );
  }
}
//通过context获取父组件的传值
MusicListContent.contextTypes = {
  currentMusicItem : React.PropTypes.object
}
