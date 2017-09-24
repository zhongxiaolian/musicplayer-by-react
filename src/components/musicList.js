import React from "react";

import "../styles/musicList.less";
import {Link} from "react-router";

class MusicList extends React.Component{
  constructor(){
    super();
    this.state={
      type : "stefanie"
    }
  }
  changeCurrentTypeStyle(type){
    this.setState({
      type : type
    });
  }
  render(){
    return (
      <div className="component-musiclist">
        <div className="music-left">
          <Link to="/list/stefanie" className={`${this.state.type=="stefanie"?" current ":""}`} onClick={this.changeCurrentTypeStyle.bind(this,"stefanie")}>孙燕姿</Link>
          <Link to="/list/europe" className={`${this.state.type=="europe"?" current ":""}`} onClick={this.changeCurrentTypeStyle.bind(this,"europe")}>欧美</Link>
          <Link to="/list/yueyu" className={`${this.state.type=="yueyu"?" current ":""}`} onClick={this.changeCurrentTypeStyle.bind(this,"yueyu")}>粤语</Link>
          <Link to="/">返回</Link>
        </div>
        <div className="music-right">
          {this.props.children}
        </div>
      </div>
    )
  }
}
export default MusicList;
