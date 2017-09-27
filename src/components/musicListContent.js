import React,{Component} from "react";
import MusicListService from "../services/musicListService.js";
import MusicListItem from "./musicListItem.js";

let content=null;
let parent = null;
let contentHeight = null;
let parentHeight = null;
let startY = null;
let moveY = null;
let totalMove = null;
let maxDistance = null;
let minDistance = null;
let delayDistance = 100;

export default class MusicListContent extends Component{
  constructor(){
    super();
    this.state={
      musicType : "stefanie",
      musicList : MusicListService.getMusicList("stefanie")
    }
  }
  componentWillReceiveProps(props){
    console.log("componentWillReceiveProps");
    //切换歌曲类型
    if(props.params.musictype && props.params.musictype !== this.state.musicType){
      console.log("changeType");
      this.setState({
        musicType : props.params.musictype,
        musicList : MusicListService.getMusicList(props.params.musictype)
      });

      totalMove = null;
      moveY = null;
      content.style.transition = "";
      content.style.transform = "translateY("+0+"px)";
    }
  }
  shouldComponentUpdate(){
    console.log("shouldComponentUpdate");
    if(this.props.location.action == "PUSH"){
      return false;
    }
    return true;
  }
  componentDidUpdate(){
    console.log("componentDidUpdate");
    contentHeight = content.offsetHeight;
    if(contentHeight<parentHeight){
      minDistance = 0;
    }else{
      minDistance = -(contentHeight-parentHeight);
    }
  }


  componentDidMount(){
    console.log("componentDidMount");
    content = this.refs.musicContent;
    contentHeight = content.offsetHeight;
    console.log(contentHeight);
    parent = content.parentElement;
    parentHeight = parent.offsetHeight-20;
    maxDistance = 0;
    if(contentHeight<parentHeight){
      minDistance = 0;
    }else{
      minDistance = -(contentHeight-parentHeight);
    }

    console.log(minDistance);
    content.addEventListener("touchstart",function(event){
      startY = event.touches[0].clientY;
    });
    content.addEventListener("touchmove",function(event){
      content.style.transition = "";
      moveY = event.touches[0].clientY - startY;
      if(totalMove+moveY>maxDistance+delayDistance){
        totalMove = maxDistance+delayDistance;
        moveY = 0;
      }else if(totalMove+moveY<minDistance-delayDistance){
        totalMove = minDistance-delayDistance;
        moveY = 0;
      }
      content.style.transform = "translateY("+(totalMove+moveY)+"px)";
    });
    content.addEventListener("touchend",function(event){
      totalMove+=moveY;
      if(totalMove>maxDistance){
        totalMove= maxDistance;
      }else if(totalMove<minDistance){
        totalMove = minDistance;
      }
      content.style.transition = "transform .5s";
      content.style.transform = "translateY("+(totalMove)+"px)";
    })

  }
  //解绑事件
  componentWillUnmount(){
    console.log("componentWillUnmount");
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
    let listEle =  null;
    console.log("========render=========")
    console.log(this.state.musicList);
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
