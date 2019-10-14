import React, { Component } from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/Listgroup";

class Selector extends Component {
  state = {};

  onSelect(pokemon) {
    const { onSelectPokemon } = this.props;
    this.setState({ selected: pokemon });
    onSelectPokemon(pokemon);
  }

  render() {
    const { data } = this.props;

    return (
      <ListGroup>
        {data.map((pkmn, i) => (
          <ListGroup.Item key={i} onClick={() => this.onSelect(pkmn)} action className="text-capitalize" active={pkmn === this.state.selected}>
            {pkmn.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}

Selector.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Selector;
