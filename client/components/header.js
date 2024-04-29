import React, { Component } from 'react';
import './header.css';


class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch(`/api/${this.props.match.params.guildID}`).then(res => {
            return res.json();
        }).then(guild => {
            this.setState(guild);
        });
    }

    render() {

        return (
            <div>
                <div class="topnav">
                    <script src="https://www.paypal.com/sdk/js?client-id=sb"></script>
                    <script>paypal.Buttons().render('body');</script>
                </div>
                <div class="topnav">
                    <a href="http://localhost:5000/login">Login with Discord</a>
                </div>
                <header className="App-header">
                    <img src={`${this.state.icon1}`} className="App-logo" alt="logo" />
                    <h1 className="App-title">{`Welcome to ${this.state.name} Website!`}</h1>
                    <div id="container">
                        <nav>
                            <a href={`/${this.props.match.params.guildID}/members`}><button type="button contact-button" id="button2">Server Members</button></a>
                            <a href={`/${this.props.match.params.guildID}/settings`}><button type="button contact-button" id="button2">Server settings</button></a>
                            <a href={`/`}><button type="button home-button" id="button1" >Home</button></a>
                            <a href={`/${this.props.match.params.guildID}`}><button type="button home-button" id="button1" >Main Page</button></a>
                            <a href={`/${this.props.match.params.guildID}/staff`}><button type="button contact-button" id="button2">Staff Members</button></a>
                            <a href={`/${this.props.match.params.guildID}/currentweek`}><button type="button contact-button" id="button2">This Weeks Logs</button></a>
                        </nav>
                    </div>
                </header>
            </div>
        );
    }
}


export default Header;