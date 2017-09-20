import React from 'react';
import $ from 'jquery';
import jPlayer from 'jplayer';
import Progress from '../components/progress.js';
import '../styles/player.less';
import {Link} from 'react-router';
import Pubsub from 'pubsub-js';
import notification  from 'antd/lib/notification';
import 'antd/lib/notification/style/index.less';
let duration = null;
class Player extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      progress : 0,
      volume : 0,
      isPlay : true,
      leftTime : 0
    }
  }

  componentDidMount(){
    //监听歌曲播放的时间
    $("#player").bind($.jPlayer.event.timeupdate,(e)=>{
      //歌曲播放的总时间
      duration = e.jPlayer.status.duration;
      this.setState({
        //音量范围是0-1
        volume : e.jPlayer.options.volume*100,
        //当前播放进度百分比
        progress : e.jPlayer.status.currentPercentAbsolute,
        //剩余时间
        leftTime : this.formatTime(duration * (1-e.jPlayer.status.currentPercentAbsolute/100))
      });
    })
  }


  componentWillUnmount(){
    $("#player").unbind($.jPlayer.event.timeupdate);
  }

  //通过回调函数接收progress子组件传递的值,实现点击progressbar控制播放进度
  progressChangeHandler(progress){
    //更改音乐的播放进度也会触发$.jPlayer.event.timeupdate事件，从而实现progress值的更改。
    $("#player").jPlayer("play",duration*progress);
  }

  //通过回调函数接收progress子组件传递的值，来控制音量。
  volumeChangeHandler(progress){
    $("#player").jPlayer("volume",progress)
    this.setState({
      volume : progress*100
    });
  }

  //控制播放，暂停
  play(){
    if(this.state.isPlay){
      $("#player").jPlayer("pause");
    }else{
      $("#player").jPlayer("play");
    }
    this.setState({
      isPlay : !this.state.isPlay
    })
  }
  playPrev(){
    Pubsub.publish("PLAY_PREV");
  }
  playNext(){
    Pubsub.publish("PLAY_NEXT");
  }
  formatTime(time){
    time = Math.floor(time);
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);
    seconds = seconds<10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }
  changeRepeatType(){
    if(this.props.repeatType == "once"){
      Pubsub.publish("CHANGE_REPEATTYPE","random");
      notification.open({
        message: '播放类型',
        description: '随机播放',
      });
    }else if(this.props.repeatType == "cycle"){
      Pubsub.publish("CHANGE_REPEATTYPE","once");
      notification.open({
        message: '播放类型',
        description: '单曲播放',
      });
    }else{
      Pubsub.publish("CHANGE_REPEATTYPE","cycle");
      notification.open({
        message: '播放类型',
        description: '循环播放',
      });
    }
  }
  render() {
    let coverUrl = require("../images/"+this.props.currentMusicItem.cover);
    return (
      <div className="player-page">
          <h1 className="caption"><div><Link to="/list">我的私人播放列表 &gt;</Link></div></h1>
          <div className="mt20 row">
            <div className="controll-wrapper">
              <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
              <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
              <div className="row mt20">
                <div className="left-time -col-auto">-{this.state.leftTime}</div>
                <div className="volume-container">
                  <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                  <div className="volume-wrapper">
                    {/* 音量进度条组件 */}
                    <Progress
                      progress={this.state.volume}
                      onProgressChange={this.volumeChangeHandler.bind(this)}
                      barColor='#aaa'
                    >
                    </Progress>
                  </div>
                </div>
              </div>
              <div style={{height: 10, lineHeight: '10px'}}>
                {/* 播放进度条组件 */}
                <Progress
                  cn="mt20"
                  progress={this.state.progress}
                  onProgressChange={this.progressChangeHandler.bind(this)}
                >
                </Progress>
              </div>
              <div className="mt35 row">
                <div>
                  {/* 播放，暂停，上一曲，下一曲控制 */}
                  <i className="icon prev" onClick={this.playPrev.bind(this)}></i>
                  <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                  <i className="icon next ml20" onClick={this.playNext.bind(this)}></i>
                </div>
                <div className="-col-auto">
                  <i className={`icon repeat-${this.props.repeatType}`} onClick={this.changeRepeatType.bind(this)}></i>
                </div>
              </div>
            </div>
            <div className="-col-auto cover">
              <img src={coverUrl} alt={this.props.currentMusicItem.title}/>
            </div>
          </div>
      </div>
    );
  }
}
export default Player;