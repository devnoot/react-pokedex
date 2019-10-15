import React, { Component } from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/Listgroup";
import Badge from "react-bootstrap/Badge";

class Selector extends Component {
  state = {};

  onSelect(pokemon) {
    const { onSelectPokemon } = this.props;
    this.setState({ selected: pokemon });
    onSelectPokemon(pokemon);
  }

  render() {
    const { data, offset } = this.props;
    const { selected } = this.state;

    return (
      <ListGroup>
        {data.map((pkmn, i) => (
          <ListGroup.Item key={i} onClick={() => this.onSelect(pkmn)} action className="text-capitalize" active={pkmn === selected}>
          <Badge variant={pkmn === selected ? "light" : "secondary" }>{i + offset + 1}</Badge> {pkmn.name}
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
  ).isRequired,
  offset: PropTypes.number.isRequired
};

export default Selector;
