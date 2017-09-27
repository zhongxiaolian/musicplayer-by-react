import React from "react";
import "../styles/progress.less";
class Progress extends React.Component{
  changeProgress(e){
    let progressBar =  this.refs.progressBar;
    let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    //通过回调函数和父组件通信
    this.props.onProgressChange && this.props.onProgressChange(progress);
  }
  componentDidMount(){
    let progress = this.refs.progress;
    let progressBar =  this.refs.progressBar;
    let pointer = this.refs.pointer;
    let startX = null;
    let moveX = null;
    let _this = this;
    let width = null;
    pointer.addEventListener("dragstart",function(e){
      width = progress.offsetWidth;
      startX = e.clientX;
    })
    pointer.addEventListener("drag",function(e){
      moveX = e.clientX - startX;
      progress.style.width = (width+moveX)+"px";
    })
    pointer.addEventListener("dragend",function(e){
      let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
      _this.props.onProgressChange && _this.props.onProgressChange(progress);
    })

    pointer.addEventListener("touchstart",function(e){
      width = progress.offsetWidth;
      startX = e.touches[0].clientX;
      console.log("startX "+startX);
    })
    pointer.addEventListener("touchmove",function(e){
      moveX = e.touches[0].clientX - startX;
      progress.style.width = (width+moveX)+"px";
    })
    pointer.addEventListener("touchend",function(e){
      console.log(e);
      let progress = (e.changedTouches[0].clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
      _this.props.onProgressChange && _this.props.onProgressChange(progress);
    })
  }
  render(){
    return (
      <div className={`component-progress ${this.props.cn}`} onClick={this.changeProgress.bind(this)} ref="progressBar">
        <div className="progress" style={{width:`${this.props.progress}%`,backgroundColor:this.props.barColor}} ref="progress"></div>
        <div className="pointer" style={{display : `${this.props.pointer?"block":"none"}`}} ref="pointer" draggable>
          <span></span>
        </div>
      </div>
    )
  }
}
Progress.defaultProps={
  barColor : "#2f9842"
}
export default Progress;
