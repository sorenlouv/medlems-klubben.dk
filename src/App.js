import React, { Component } from 'react';
import './App.css';
import NemIdLogin from './NemIdLogin';
import Modal from './Modal';

class App extends Component {
  state = {
    isNemIdVisible: false,
    isModalVisible: false
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const signupButton = (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          this.setState({ isNemIdVisible: true, isModalVisible: true });
        }}
      >
        Opret dig nu!
      </button>
    );

    return (
      <div className="outer-container">
        <Modal
          content="Dette website et lavet for at demonstrere en sikkerhedsbrist med NemId.
        Hvis du vælger at fortsætte, vil dine login-oplysninger blive brugt i
        baggrunden til at logge på Borger.dk, og antallet af ulæste beskeder i
        E-Boks vil blive aflæst. Dine login oplysninger vil ikke blive gemt, og
        der vil ikke blive gemt eller ændret ved noget på Borger.dk."
          closeModal={this.closeModal}
          isModalVisible={this.state.isModalVisible}
        />

        <div className="App-container">
          <div className="left-container">
            <h2>Hvordan virker Medlemsklubben?</h2>
            <ul className="advantages">
              <li>Spar 50-80% på dine yndlingsprodukter</li>
              <li>Få 500 kroner i rabat på dit første køb</li>
              <li>Første måned gratis - ingen binding</li>
            </ul>
            <p>For at undgå svindel beder vi dig logge ind med NemId.</p>
            <div className="signup-container">
              {this.state.isNemIdVisible ? (
                <div>
                  <NemIdLogin />{' '}
                  <div className="warning">
                    Dette website påviser en sikkerhedsbrist ved NemID. Indtast
                    ikke dine personlige oplysninger med mindre du ønsker at
                    sitet skal logge sig ind på din personlige Borger.dk.
                    &lt;Ansvarsfraskrivelse /&gt;
                  </div>
                </div>
              ) : (
                signupButton
              )}
            </div>
          </div>
          <div className="deal-photo">
            <img src="./membership-deals.jpg" alt="" />
          </div>
        </div>

        <div className="fixed-top top-nav">
          <img src="./medlemsklubben-logo1.png" alt="Medlemsklubbens logo" />
        </div>

        <div className="fixed-bottom bottom-nav">
          Medlemsklubben A/S - Dampfærgevej 37, 2100 København - CVR: 33551479
        </div>
      </div>
    );
  }
}

export default App;
