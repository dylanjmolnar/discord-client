import React, { Component } from 'react';


class Home extends Component {

  constructor(props) {
      super(props);
      this.state = {};
  }

  componentDidMount() {
      fetch(`/api/session`).then(res => {
          return res.json();
      })
      .then(guild => {
        console.log(guild)
          this.setState(guild);
      });
  }

  render() {

    return (
      <div>
      <div class="topnav">
        <a href="http://localhost:5000/login">Login with Discord</a>
      </div>
      <header className="App-header">
        <div id="container">
            <a href={`/451171819672698920`}><button type="button contact-button" id="button2">Shatters</button></a>
            <a href={`/343704644712923138`}><button type="button home-button" id="button1" >Lost Halls</button></a>
            <a href={`/484063560385953804`}><button type="button home-button" id="button1" >Testing</button></a>
        </div>
      </header>
      </div>
    );
  }
}


export default Home;