import React from 'react';
import '../styles/progress.less';
class Progress extends React.Component{
  changeProgress(e){
    let progressBar =  this.refs.progressBar;
    let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    //通过回调函数和父组件通信
    this.props.onProgressChange && this.props.onProgressChange(progress);
  }
  render(){
    return (
      <div className={`component-progress ${this.props.cn}`} onClick={this.changeProgress.bind(this)} ref="progressBar">
        <div className="progress" style={{width:`${this.props.progress}%`,backgroundColor:this.props.barColor}}></div>
      </div>
    )
  }
}
Progress.defaultProps={
  barColor : "#2f9842"
}
export default Progress;
