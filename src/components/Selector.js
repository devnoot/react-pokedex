import React, { Component } from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/Listgroup";
import Badge from "react-bootstrap/Badge";
import FormCheck from "react-bootstrap/FormCheck";

class Selector extends Component {
  state = {
    voice: false
  };

  onSelect(pokemon) {
    const { onSelectPokemon } = this.props;
    this.setState({ selected: pokemon });
    onSelectPokemon(pokemon);
  }

  toggleVoice() {
    const { onToggleVoice } = this.props;
    const { voice } = this.state;
    this.setState({ voice: !voice }) 
    onToggleVoice(!voice);
  }

  render() {
    const { data, offset } = this.props;
    const { selected, voice } = this.state;

    return (
      <> 
        <ListGroup>
          {data.map((pkmn, i) => (
            <ListGroup.Item
              key={i}
              onClick={() => this.onSelect(pkmn)}
              action
              className="text-capitalize"
              active={pkmn === selected}
            >
              <Badge variant={pkmn === selected ? "light" : "secondary"}>
                {i + offset + 1}
              </Badge>{" "}
              {pkmn.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <FormCheck 
          id="voice-switch" 
          type="switch" 
          label="PokeSam Voice" 
          checked={voice} 
          onChange={() => this.toggleVoice()} 
          className="ml-3 mt-3"
        />
      </>
    );
  }
}

Selector.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  offset: PropTypes.number.isRequired,
  onToggleVoice: PropTypes.func,
  onSelectPokemon: PropTypes.func
};

export default Selector;
