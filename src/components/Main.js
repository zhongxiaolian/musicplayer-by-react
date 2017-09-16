require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './header.js'
let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <Header/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
