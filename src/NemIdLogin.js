import React, { Component, Fragment } from 'react';
import './NemIdLogin.css';
import Modal from './Modal';

const STEPS = {
  LOGIN: 'login',
  OTP: 'otp'
};

class NemIdLogin extends Component {
  state = {
    isLoading: true,
    unreadMessages: 0,
    username: '',
    password: '',
    step: STEPS.LOGIN,
    isModalVisible: false
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  onChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  login = async (username, password) => {
    const resp = await fetch('https://medlemsklubben-dk.appspot.com/', {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const json = await resp.json();
    const unreadMessages = json.unread;

    this.setState({ unreadMessages, isModalVisible: true });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      step: STEPS.OTP,
      isLoading: true
    });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);

    this.login(this.state.username, this.state.password).catch(e => {
      console.log('An error occured', e);
    });
  };

  getContentForStep = step => {
    const stepLogin = (
      <Fragment>
        <div className="site-name">Medlemsklubben</div>
        <div className="content-container">
          <div className="input-container">
            <div>Bruger-id</div>
            <div>
              <input
                autoComplete="off"
                name="username"
                type="text"
                onChange={this.onChangeUsername}
              />
            </div>
          </div>

          <div className="input-container">
            <div>Adgangskode</div>
            <div>
              <input
                autoComplete="off"
                name="password"
                type="password"
                onChange={this.onChangePassword}
              />
            </div>
          </div>

          <div className="bottom">
            <div className="forgotten-password">Glemt adgangskode?</div>
            <input type="submit" value="Næste" className="submit-button" />
          </div>
        </div>
      </Fragment>
    );

    const stepOTP = (
      <Fragment>
        <div className="content-container">
          <h6 className="header">Godkend på mobil/tablet</h6>

          <div className="icon-phone-container">
            <div className="icon-phone" />
          </div>

          <p>
            <br />
            Din anmodning er klar til godkendelse i dine nøgleapps på
            mobil/tablet.
          </p>

          <div className="bottom">
            <input type="button" value="Afbryd" className="submit-button" />
          </div>
        </div>
      </Fragment>
    );

    switch (step) {
      case STEPS.LOGIN:
        return stepLogin;
      case STEPS.OTP:
        return stepOTP;
      default:
        return stepLogin;
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  render() {
    return (
      <div>
        <Modal
          content={
            <div>
              <h1>Sådan!</h1>
              <p>
                Du har {this.state.unreadMessages} ulæst(e) besked(er) i din
                E-Boks!
              </p>
              <p>
                Når du bruger NemId til at logge dig ind forskellige steder, er
                det umuligt for dig at vide, hvad websitet gør med dine
                loginoplysninger. Det er ikke kun suspekte websites du skal være
                påpasselig med. Troværdige danske virksomheder bliver også ofre
                for angreb, og hackere vil nemt kunne udskifte et officiel
                NemId Login med deres egen, der sender dem alle brugeres NemId
                login.
              </p>
            </div>
          }
          closeModal={this.closeModal}
          isModalVisible={this.state.isModalVisible}
        />
        <form
          onSubmit={this.onSubmit}
          className={`nemid-container ${
            this.state.isLoading ? 'is-loading' : ''
          }`}
        >
          <div className="loading-overlay">
            <div className="loading-indicator" />
          </div>

          <img className="nemid-logo" src="./nemid-logo.jpg" alt="Nemid logo" />

          {this.getContentForStep(this.state.step)}
        </form>
      </div>
    );
  }
}

export default NemIdLogin;
