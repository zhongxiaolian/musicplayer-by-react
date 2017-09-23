import React from "react";

import "../styles/musicList.less";
import {Link} from "react-router";

class MusicList extends React.Component{
  render(){
    return (
      <div className="component-musiclist">
        <div className="music-left">
          <Link to="/list/stefanie">孙燕姿</Link>
          <Link to="/list/europe">欧美</Link>
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
