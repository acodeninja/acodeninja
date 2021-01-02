import React from "react";
import * as storage from "../../lib/storage";
import toggleDark from "./toggle-off.svg"
import toggleLight from "./toggle-on.svg"
import "./index.scss"

export default class ThemeToggle extends React.Component {
  constructor(props) {
    super(props);

    const dark = storage.get('theme-dark', false);

    this.state = {
      dark,
    };

    this.updateThemeClass(dark);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const current = storage.get('theme-dark', false);

    storage.set('theme-dark', !current);

    this.setState(prevState => ({
      ...prevState,
      dark: !current,
    }), () => this.updateThemeClass(!current));
  }

  updateThemeClass(dark) {
    let classes = document.getElementsByTagName('html')[0].classList;

    if (dark) {
      classes.add('dark');
      classes.remove('light');
    } else {
      classes.remove('dark');
      classes.add('light');
    }
  }

  render() {
    const {dark} = this.state;

    return (
      <button aria-label={`Switch theme to ${dark ? 'light' : 'dark'}`} onClick={this.toggle}>
        <img src={dark ? toggleLight : toggleDark} alt="" />
      </button>
    )
  }
};
