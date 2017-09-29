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
//UL向上移动的最大值
let maxDistance = null;
//UL向下移动的最大值
let minDistance = null;
//上下吸附的缓冲值
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
      //重置之前移动的数据
      totalMove = null;
      moveY = null;
      content.style.transition = "";
      content.style.transform = "translateY("+0+"px)";
    }
  }
  // shouldComponentUpdate(){
  //   console.log("shouldComponentUpdate");
  //   if(this.props.location.action == "PUSH"){
  //     return false;
  //   }
  //   return true;
  // }

  componentDidUpdate(){
    console.log("componentDidUpdate");
    //页面渲染完毕才可以获取UL的高度
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
    parent = content.parentElement;
    parentHeight = parent.offsetHeight-20;
    //UL的高度无论大于还是小于DIV的高度，maxDistance都是0
    maxDistance = 0;
    if(contentHeight<parentHeight){
      minDistance = 0;
    }else{
      minDistance = -(contentHeight-parentHeight);
    }

    //{passive:true}参数可以提前告知浏览器，没有preventDefault，否则浏览器会有200ms的时间检测是否设置preventDefault。
    //让滚动立即执行，提升滚动的性能。
    content.addEventListener("touchstart",function(event){
      startY = event.touches[0].clientY;
    },{passive:true});

    content.addEventListener("touchmove",function(event){
      //拖动的过程中必须取消过度动画
      content.style.transition = "";
      moveY = event.touches[0].clientY - startY;
      if(totalMove+moveY>maxDistance+delayDistance){
        totalMove = maxDistance+delayDistance;
        moveY = 0;
      }else if(totalMove+moveY<minDistance-delayDistance){
        totalMove = minDistance-delayDistance;
        moveY = 0;
      }
      //手指移动多少，UL移动多少。
      content.style.transform = "translateY("+(totalMove+moveY)+"px)";
    },{passive:true});

    content.addEventListener("touchend",function(event){
      //累加每次移动的距离，这样下一次移动可以接着之前的位置移动
      totalMove+=moveY;
      if(totalMove>maxDistance){
        totalMove= maxDistance;
      }else if(totalMove<minDistance){
        totalMove = minDistance;
      }
      //开启过度，让UL吸附回最终位置。
      content.style.transition = "transform .5s";
      content.style.transform = "translateY("+(totalMove)+"px)";
    },{passive:true})

  }
  //解绑事件
  componentWillUnmount(){
    console.log("componentWillUnmount");
    content.removeEventListener("touchstart",null);
    content.removeEventListener("touchmove",null);
    content.removeEventListener("touchend",null);
  }
  // 通过回调函数，点击删除按钮删除条目
  // deleteMusic(item){
  //   let list = this.state.musicList.filter(function(i){
  //     return i !== item;
  //   });
  //   this.setState({
  //     musicList : list
  //   });
  // }
  //通过闭包实现参数传递
  deleteMusic(item){
    let _this = this;
    return function(){
      let list = _this.state.musicList.filter(function(i){
        return i !== item;
      });
      _this.setState({
        musicList : list
      });
    }
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
        delete={_this.deleteMusic(item)}/>
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
