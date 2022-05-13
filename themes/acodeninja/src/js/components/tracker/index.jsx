import React, {Component} from 'react';
import * as storage from "../../lib/storage";
import './index.scss';

export default class Tracker extends Component {
  GA_CODE = "UA-84862644-2"

  constructor(props) {
    super(props);

    this.state = {
      locale: navigator.language,
      location: document.URL,
      referrer: document.referrer,
      sessionToken: null,
      storedToken: storage.get('tracker'),
      userAgent: navigator.userAgent,
    };

    this.accept = this.accept.bind(this);
    this.decline = this.decline.bind(this);
    this.gtag = this.gtag.bind(this);
    this.add_analytics = this.add_analytics.bind(this);

    window.dataLayer = window.dataLayer || [];
  }

  gtag() {
    dataLayer.push(arguments);
  }

  accept() {
    const {storedToken} = this.state;

    if (typeof storedToken !== 'number') {
      this.setState(prevState => ({
        ...prevState,
        storedToken: Math.random() * 100000000000000000,
      }), () => {
        storage.set('tracker', this.state.storedToken);
      });

      this.add_analytics();
    }
  }

  decline() {
    this.setState(prevState => ({
      ...prevState,
      storedToken: false,
    }), () => {
      storage.set('tracker', false);
    });
  }

  add_analytics() {
    if (! document.getElementById('ga_tracker')) {
      let data_script = document.createElement("script");

      data_script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_CODE}`;
      data_script.id = 'ga_tracker';

      document.getElementsByTagName("head")[0].appendChild(data_script);
    }
  }

  render() {
    // null = undecided, false = disallowed, number = accepted tracking token
    const {storedToken} = this.state;

    if (storedToken) {
      this.add_analytics();

      setTimeout(
        () => {
          this.gtag('js', new Date());
          this.gtag('config', this.GA_CODE);
        }
      );
    }

    return (
      <div>
        {storedToken === null && (
          <div className="popup">
            <strong>Do you mind?</strong>
            <p>I'd like to track your visit so I can better understand how people use my site. Is that ok?</p>
            <div>
              <a aria-label="Accept"
                 onClick={this.accept}
              >👍</a>
              <a aria-label="More info"
                 href="/privacy#tracking-token"
              >ℹ️</a>
              <a aria-label="Decline"
                 onClick={this.decline}
              >👎</a>
            </div>
          </div>
        )}
      </div>
    );
  }
}
