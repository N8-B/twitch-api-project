import React, { Component } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import Drawer from 'react-toolbox/lib/drawer';
import style from './style';
import Logo from './Twitch_Logo_White.png';
import smallLogo from './userPlaceholderImage.png';

class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      active: false
    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    return (
      <AppBar className={style.appbar} flat>
        <div className={style.logo}>
          <a href="http://www.twitch.tv/"><img src={Logo} alt="" /></a>
        </div>
        <Button className={style.button} icon='add' floating accent onClick={this.handleToggle} />
        <Drawer className={style.drawer} active={this.state.active} onOverlayClick={this.handleToggle}>
          <div className={style.drawerLogo}>
            <a href="http://www.twitch.tv/"><img src={smallLogo} /></a>
          </div>
          <h5>Twitch API Project</h5>
          <p>This project was built for <a href="http://www.freecodecamp.com/">Free Code Camp</a>. React is used to display data received from the Twitch API.</p><br/>
          <p>Styling of components was done using <a href="https://github.com/react-toolbox/react-toolbox">React Toolbox</a> and follows Google's material design principles.</p> <br />
          <p>Please visit the following links to view the project source and build code.</p><br/>
          <div className={style.buttonGroup}>
            <Button classname={style.drawerButton} href="https://github.com/N8-B/twitch-api-project" label="Source Code" flat primary /> <br />
            <Button classname={style.drawerButton} href="https://github.com/N8-B/twitch-api-project/tree/gh-pages" label="Build Code" flat primary /> <br />
            <Button classname={style.drawerButton} href="https://N8-B.github.io/twitch-api-project" label="Demo" flat primary />
          </div>

        </Drawer>
      </AppBar>
    );
  }
}

export default Header;
