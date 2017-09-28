import React from "react";
import "../styles/reset.less";
import "../styles/common.less";
import "../styles/main.less";
import $ from "jquery";
import Header from "./header.js";
import Player from "./player.js";
import MusicList from "./musicList.js";
import MusicListContent from "./musicListContent.js";
import {MUSIC_LIST} from "../config/songConfig.js";
import {Router,IndexRoute,Route,hashHistory} from "react-router";
import Pubsub from "pubsub-js";
import { CSSTransitionGroup } from "react-transition-group"; //v1

let lastRunTime = new Date();
let interval = null;
class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      musicList : MUSIC_LIST,
      currentMusicItem : MUSIC_LIST[0],
      repeatType : "cycle"
    };
  }
  playMusic(item){
      $("#player").jPlayer("setMedia",{
        mp3 : item.file
      }).jPlayer("play");
      this.setState({
        currentMusicItem : item
      });
  }
  playNext(type="next"){
    let lateRunTime = new Date();
    let nextIndex = null;
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let musicListLength = this.state.musicList.length;
    if(type=="next"){
      nextIndex = (index + 1)%musicListLength;
    }else{
      nextIndex = (index-1+musicListLength)%musicListLength;
    }
    //添加保护延迟，防止用户切换操作过快
    if(lateRunTime-lastRunTime<1000){
      return
    }else{
      this.playMusic(this.state.musicList[nextIndex]);
    }
    lastRunTime = new Date();

  }
  findMusicIndex(item){
    return this.state.musicList.indexOf(item);
  }
  // =====================控制播放类型开始=======================
  playOnce(){
    $("#player").unbind($.jPlayer.event.ended);
  }
  playRandom(){
    let musicListLength = this.state.musicList.length;
    let _this = this;
    $("#player").unbind($.jPlayer.event.ended);
    $("#player").bind($.jPlayer.event.ended,function(e){
        let index = Math.floor(Math.random()*musicListLength);
        while(index == _this.findMusicIndex(_this.state.currentMusicItem)){
          index = Math.floor(Math.random()*musicListLength);
        }
        _this.playMusic(_this.state.musicList[index]);
    });
  }
  playCycle(){
    let _this= this;
    $("#player").unbind($.jPlayer.event.ended);
    $("#player").bind($.jPlayer.event.ended,function(e){
      _this.playNext();
    });
  }
  changeRepeatType(type){
    if(type == "cycle"){
      this.playCycle();
      this.setState({
        repeatType : "cycle"
      })
    }else if(type == "once"){
      this.playOnce();
      this.setState({
        repeatType : "once"
      })
    }else{
      this.playRandom();
      this.setState({
        repeatType : "random"
      })
    }
  }
  // ==================控制播放类型结束====================

  // 滚动标题
  rollTitle(){
    let title = document.title;
    let step = 0;
    interval = setInterval(function(){
      document.title = title.substring(step)+title.substring(0,step);
      step++;
      if(step==title.length-1){
        step=0;
      }
    },1000);
  }

  componentDidMount(){
    // 防止微信下拉显示网址来源。第三个参数是一个对象，false会提前告知浏览器我会阻止浏览器默认行为，true表示
    //我不会阻止浏览器的默认行为，这样可以提高滚动的性能（该选项默认为true，表示告诉浏览器不会阻止默认行为）。
    document.addEventListener("touchmove",function(event){
      event.preventDefault();
    },{ passive: false});

    this.rollTitle();
    let _this = this;
    //组件加载完毕播放歌曲，放在根节点这样切换组件歌曲不会停止播放
    $("#player").jPlayer({
      supplied : "mp3",
      wmode : "window"
    })
    //移动端默认不让播放器自动播放，减少不必要的流量浪费。
    $("#player").jPlayer("setMedia",{
      mp3 : this.state.currentMusicItem.file
    });
    // this.playMusic(this.state.currentMusicItem);

    // 事件订阅，接收事件
    Pubsub.subscribe("PLAY_MUSIC",(message,item)=>{
      _this.playMusic(item);
    })
    Pubsub.subscribe("PLAY_PREV",()=>{
      _this.playNext("prev");
    })
    Pubsub.subscribe("PLAY_NEXT",()=>{
      _this.playNext("next");
    })
    Pubsub.subscribe("CHANGE_REPEATTYPE",(message,type)=>{
      _this.changeRepeatType(type);
    })

    //监听歌曲播放完毕事件
    $("#player").bind($.jPlayer.event.ended,function(e){
      _this.playNext();
    });

    // 浏览器下拉露出地址来源

  }

  componentWillUnmount(){
    //事件订阅，解绑
    Pubsub.unsubscribe("PLAY_MUSIC");
    Pubsub.unsubscribe("PLAY_PREV");
    Pubsub.unsubscribe("PLAY_NEXT");
    Pubsub.unsubscribe("CHANGE_REPEATTYPE");
    //解绑
    $("#player").unbind($.jPlayer.event.ended);
  }
  // 通过context向底层组件传值
  getChildContext(){
    return {
      currentMusicItem : this.state.currentMusicItem
    }
  }

  render() {
    return (
      <div className="component-main">
        <Header ref="header"/>
        {/* <Player currentMusicItem={this.state.currentMusicItem}/> */}
        {/* <MusicList musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem}/> */}
        {/* 这种方式不会把参数传递给子组件 */}
        {/* {this.props.children} */}
        {/* 这样会把state里面的东西作为参数传递给子组件，这就要求state的属性名和子组件的prop属性名相同 */}
        {/* <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            <div key={this.props.location.pathname} className="wrap">
              {React.cloneElement(this.props.children,this.state)}
            </div>
        </CSSTransitionGroup> */}
        {React.cloneElement(this.props.children,this.state)}
      </div>
    );
  }
}
// 通过context向底层组件传值
AppComponent.childContextTypes={
  currentMusicItem : React.PropTypes.object
}

class Root extends React.Component{
  render(){
    return (
      <Router history={hashHistory}>
        <Route path="/" component={AppComponent}>
            <IndexRoute component={Player}></IndexRoute>
            <Route path="/list" component={MusicList}>
              <IndexRoute component={MusicListContent}></IndexRoute>
              <Route path="/list/:musictype" component={MusicListContent}></Route>
            </Route>
        </Route>
      </Router>
    )
  }
}

export default Root;
