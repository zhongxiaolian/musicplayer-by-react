import React,{Component} from "react";
import "../styles/header.less";

export default class Header extends Component{

  render(){
    let logoUrl = require("../images/logo.png");
    return (
      <div className="component-header row">
        <img src={logoUrl} width="40px" className="-col-auto"/>
        <h1 className="caption">React Music Player</h1>
      </div>
    )
  }
}
