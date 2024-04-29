import React, { Component } from 'react'
import './App.css'
import Characters from './components/characters/characters'
import Staff from './components/characters/staff'
import Logs from './components/logs/logs'
import Settings from './components/settings/settings'
import Header from './components/header'
import Home from './components/home'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <Route exact path={`/`} render={(props) => <Home globalStore={this.props.id} {...props} /> }/>
        <Route path={`/:guildID/:staff?`} render={(props) => <Header globalStore={this.props.id} {...props} /> }/>
        <Route exact path={`/:guildID/staff`} render={(props) => <Staff globalStore={this.props.id} {...props} /> }/>
        <Route exact path={`/:guildID/members`} render={(props) => <Characters globalStore={this.props.id} {...props} /> }/>
        <Route path={`/:guildID/currentweek`} render={(props) => <Logs globalStore={this.props.id} {...props} /> }/>
        <Route path={`/:guildID/settings`} render={(props) => <Settings globalStore={this.props.id} {...props} /> }/>
      </div>
      </Router>
    )
  }
}

export default App