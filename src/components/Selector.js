import React, { Component } from "react";
import PropTypes from "prop-types";

class Selector extends Component {

  state = {}

  onSelect(pokemon) {
    const { onSelectPokemon } = this.props;
    this.setState({ selected: pokemon }); 
    onSelectPokemon(pokemon); 
  }

  render() {
    const { data } = this.props;

    return (
      <div style={{ padding: "0.5em 1em" }}>
        {data.map((pkmn, i) => <div className="Selector-Item" key={i}>
          <a href="#" onClick={() => this.onSelect(pkmn)}><p>{pkmn.name}</p></a>
          </div>
        )} 
      </div> 
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
