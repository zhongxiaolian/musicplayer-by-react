import React,{Component} from "react";
import MusicListService from "../services/musicListService.js";
import MusicListItem from "./musicListItem.js";

let startY = 0;
let moveY = 0;
let totalMove = 0;
let musicContent = 0;
let musicContentHeight = 0;
let musicContentParent = 0;
//20是给父盒子加的边框
let musicContentParentHeight = 0;
let maxDistance = 100;
let goTop = 0;
let goBottom = null;


export default class MusicListContent extends Component{
  constructor(){
    super();
    this.state={
      musicType : "stefanie",
      musicList : MusicListService.getMusicList("stefanie")
    }
  }
  componentWillReceiveProps(props){
    if(props.params.musictype && props.params.musictype !== this.state.musicType){
      let newMusicList = MusicListService.getMusicList(props.params.musictype);
      this.setState({
        musicList : newMusicList,
        musicType : props.params.musictype
      });
    }
  }
  componentDidUpdate(){
      //把touchmove相关的数据全部重置
      startY = 0;
      moveY = 0;
      totalMove = 0;
      musicContent = this.refs.musicContent;
      musicContentHeight = musicContent.offsetHeight;
      musicContentParent = musicContent.parentElement;
      //减去20的border
      musicContentParentHeight = musicContent.parentElement.offsetHeight-20;
      if(musicContentHeight>musicContentParentHeight){
        goBottom = -(musicContentHeight-musicContentParentHeight)
      }else{
        goBottom = 0;
      }
      //关闭过度，每次切换歌单都需要把ul移到最前面
      this.refs.musicContent.style.transition = "";
      this.refs.musicContent.style.transform = "translateY("+(0)+"px)";
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
    // 防止微信下拉显示网址来源
    document.addEventListener("touchmove",function(e){
      e.preventDefault();
    })

    musicContent = this.refs.musicContent;
    musicContentHeight = musicContent.offsetHeight;
    musicContentParent = musicContent.parentElement;
    //减去20的border
    musicContentParentHeight = musicContent.parentElement.offsetHeight-20;
    if(musicContentHeight>musicContentParentHeight){
      goBottom = -(musicContentHeight-musicContentParentHeight)
    }else{
      goBottom = 0;
    }

    musicContentParent.addEventListener("touchstart",function(e){
      startY = e.touches[0].clientY;
    })
    musicContentParent.addEventListener("touchmove",function(e){
      //移动的过程中关闭过度效果，否则滑动不流畅
      musicContent.style.transition = "";
      moveY = e.touches[0].clientY-startY;
      // 如果ul的高度大于div的高度
      if(musicContentHeight>musicContentParentHeight){
        //手指向下滑动，超出最大临界值
        if(totalMove+moveY>maxDistance){
          totalMove = maxDistance;
          musicContent.style.transform = "translateY(" +(totalMove)+"px)";
          return;
        }
        //手指向上滑动超出最大临界值
        else if(Math.abs(totalMove+moveY)>(musicContentHeight-musicContentParentHeight+maxDistance)){
          totalMove = -(musicContentHeight-musicContentParentHeight+maxDistance);
          musicContent.style.transform = "translateY(" +(totalMove)+"px)";
          return;
        }else{
          musicContent.style.transform = "translateY(" +(totalMove+moveY)+"px)";
        }
      }else{//如果ul的高度小于div的高度
        //手指向下滑动，超出最大临界值
        console.log(222222)
        if(totalMove+moveY>maxDistance){
          totalMove = maxDistance;
          musicContent.style.transform = "translateY(" +(totalMove)+"px)";
          return;
        }else if(totalMove+moveY<0){
          console.log(12344);
          musicContent.style.transform = "translateY(" +(0)+"px)";
        }else{
          musicContent.style.transform = "translateY(" +(totalMove+moveY)+"px)";
        }
      }

    })
    musicContentParent.addEventListener("touchend",function(e){
      totalMove = totalMove + moveY;
      if(totalMove>goTop){
        totalMove = goTop;
      }else if(totalMove<goBottom){
        totalMove = goBottom;
      }
      //开启过度效果，使列表吸附回去。
      musicContent.style.transition = "all .5s";
      musicContent.style.transform = "translateY(" +(totalMove)+"px)";
    })
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
