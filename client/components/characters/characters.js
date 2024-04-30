import React, { Component } from 'react';
import './characters.css';


class Characters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            characters: []
        };
    }

    componentDidMount() {
        fetch(`/api/${this.props.match.params.guildID}/members`).then(res => {
            return res.json();
        })
        .then(characters => {
            this.setState({characters}, () => console.log(characters));
        });
    }

  render() {

    return (
      <div>
        <h2>Server Members</h2>
        <ul>
            {this.state.characters.sort((a, b) => {
                if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            }).map((character, i) => 
                <li key={i}>{character.displayName}</li>
            )}
        </ul>
      </div>
    );
  }
}


export default Characters;