import React, { Component } from 'react';
import Switch from "react-switch";
import './settings.css';

class Logs extends Component {

    constructor() {
      super();
      this.state = {joinVC: false};
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(checked, event, id) {
      let settings = this.state;
      settings[id] = checked;
      fetch(`/${this.props.match.params.guildID}/set/${id}/${checked}`)
      this.setState(settings);
    }
    componentDidMount() {
        fetch(`/api/${this.props.match.params.guildID}/settings`).then(res => {
          return res.json();
        }).then(settings => {
          this.setState(settings);
        })
    }

    render() {

      return (
        <div>
          <h1>Server Settings</h1>
          <h3>Logging</h3>
          <ul>
            <li>
              <Switch
                id="joinVC"
                onChange={this.handleChange}
                checked={this.state.joinVC}
                className="react-switch"
              /> Join Voice Channel
            </li>
            <li>
              <Switch
                id="leaveVC"
                onChange={this.handleChange}
                checked={this.state.leaveVC}
                className="react-switch"
              /> Leave Voice Channel
            </li>
            <li>
              <Switch
                id="changeVC"
                onChange={this.handleChange}
                checked={this.state.changeVC}
                className="react-switch"
              /> Change Voice Channel
            </li>
            <li>
              <Switch
                id="nicknameSwitch"
                onChange={this.handleChange}
                checked={this.state.nicknameSwitch}
                className="react-switch"
              /> Edit Nickname
            </li>
            <li>
              <Switch
                id="rolesAdd"
                onChange={this.handleChange}
                checked={this.state.rolesAdd}
                className="react-switch"
              /> Role Added
            </li>
            <li>
              <Switch
                id="rolesRemove"
                onChange={this.handleChange}
                checked={this.state.rolesRemove}
                className="react-switch"
              /> Role Removed
            </li>
            <li>
              <Switch
                id="messEdit"
                onChange={this.handleChange}
                checked={this.state.messEdit}
                className="react-switch"
              /> Message Edit
            </li>
            <li>
              <Switch
                id="messDelete"
                onChange={this.handleChange}
                checked={this.state.messDelete}
                className="react-switch"
              /> Message Delete
            </li>
            <li>
              <Switch
                id="userJoin"
                onChange={this.handleChange}
                checked={this.state.userJoin}
                className="react-switch"
              /> User Join
            </li>
            <li>
              <Switch
                id="userLeave"
                onChange={this.handleChange}
                checked={this.state.userLeave}
                className="react-switch"
              /> User Leave
            </li>
            <li>
              <Switch
                id="bulkDelete"
                onChange={this.handleChange}
                checked={this.state.bulkDelete}
                className="react-switch"
              /> Bulk Delete
            </li>
          </ul>
          <h3>Verification Switches</h3>
          <ul id="verification">
            <li>
              <Switch
                id="veriSwitch"
                onChange={this.handleChange}
                checked={this.state.veriSwitch}
                className="react-switch"
              /> Verification
            </li>
            <li>
              <Switch
                id="eventVeriSwitch"
                onChange={this.handleChange}
                checked={this.state.eventVeriSwitch}
                className="react-switch"
              /> Event Verification
            </li>
            <li>
              <Switch
                id="veteranVeriSwitch"
                onChange={this.handleChange}
                checked={this.state.veteranVeriSwitch}
                className="react-switch"
              /> Veteran Verification
            </li>
          </ul>
          <h3>Verification</h3>
          <ul id="veriLogging">
            <li>
              <Switch
                id="veriNameHistory"
                onChange={this.handleChange}
                checked={this.state.veriNameHistory}
                className="react-switch"
              /> Send Past Names
            </li>
            <li>
              <Switch
                id="veriGuildHistory"
                onChange={this.handleChange}
                checked={this.state.veriGuildHistory}
                className="react-switch"
              /> Send Characters
            </li>
            <li>
              <Switch
                id="veriCreated"
                onChange={this.handleChange}
                checked={this.state.veriCreated}
                className="react-switch"
              /> Date Created
            </li>
            <li>
              <Switch
                id="veriCreated"
                onChange={this.handleChange}
                checked={this.state.veriCreated}
                className="react-switch"
              /> Date Created
            </li>
          </ul>
          <ul id="verificationSettings">
            <li>
              <Switch
                id="veriNameHistory"
                onChange={this.handleChange}
                checked={this.state.veriNameHistory}
                className="react-switch"
              /> Name History
            </li>
            <li>
              <Switch
                id="veriGuildHistory"
                onChange={this.handleChange}
                checked={this.state.veriGuildHistory}
                className="react-switch"
              /> Guild History
            </li>
            <li>
              <Switch
                id="veriCreated"
                onChange={this.handleChange}
                checked={this.state.veriCreated}
                className="react-switch"
              /> Date Created
            </li>
            <li>
              <Switch
                id="veriLKL"
                onChange={this.handleChange}
                checked={this.state.veriLKL}
                className="react-switch"
              /> Last Known Location
            </li>
          </ul>
          <ul>
            <li>
              <form>
                Alive Fame: <input size="5" placeholder={this.state.veriAliveFame} input="number" maxLength="6"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Account Fame: <input size="5" placeholder={this.state.veriAccountFame} input="number" maxLength="6"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Star Rank: <input size="5" placeholder={this.state.veriStarCount} input="number" maxLength="2"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Skin Count: <input size="5" placeholder={this.state.veriSkinCount} input="number" maxLength="3"></input><input type="submit" value="Save"></input>
              </form>
            </li>
          </ul>
          <ul>
            <li>
              <form>
                Characters: <input size="5" placeholder={this.state.veriCharCount} input="number" maxLength="2"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Character Stats: <input size="5" placeholder={this.state.veriCharMaxed + "/8"} input="number" maxLength="1"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Created: <input size="5" placeholder={this.state.veriSkinCount} input="date" maxLength="3"></input><input type="submit" value="Save"></input>
              </form>
            </li>
            <li>
              <form>
                Deaths: <input size="5" placeholder={this.state.veriDeathCount} input="number" maxLength="4"></input><input type="submit" value="Save"></input>
              </form>
            </li>
          </ul>
        </div>
      );
    }
}


export default Logs;