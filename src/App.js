import React, { Component } from "react";
import Selector from "./components/Selector";

import "./App.css";

class App extends Component {
  state = {
    isLoading: false,
    error: "",
    selected: "",
    selectionList: "",
    nextURL: "",
    prevURL: "",
    offset: 0,
    limit: 15
  };

  componentDidMount() {
    // When the component mounts, grab a bunch of pokemon from the API
    const { offset, limit } = this.state;
    this.getPokemon(
      `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
    );
  }

  getPokemon(url) {
    this.setState({ isLoading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          selectionList: res.results,
          prevURL: res.previous,
          nextURL: res.next
        });
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  }

  getDetailedStats(url) {
    this.setState({ isLoading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({ selected: res });
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  }

  onSelect(pokemon) {
    this.getDetailedStats(pokemon.url);
  }

  next() {
    // Set the offset and limit based on the URL
    const url = new URL(this.state.nextURL);
    const params = url.searchParams;
    const limit = params.get("limit");
    const offset = params.get("offset");
    this.setState({ offset, limit });
    this.getPokemon(this.state.nextURL);
  }

  prev() {
    this.getPokemon(this.state.prevURL);
  }

  render() {
    const {
      selected,
      selectionList,
      error,
      isLoading,
      offset,
      nextURL,
      prevURL
    } = this.state;

    return (
      <div className="App">
        <main>
          <div className="Container">
            {/* First, if there's an error, display it */}
            {error && <p>{error}</p>}

            {/* 
            The pokedex can have one of two views, the first view is a selection 
            on the right side of the screen, with a portrait of the pokemon on
            the left side. The second view is invoked when the user "clicks" on 
            the pokemon from the scroll list. This view is a horizontal split
            wherein, on the top is an image of the pokemon, along with some stats.
            The bottom portion is the description of the pokemon. This view is 
            very similar to the Gen 1 pokedex in the Pokemon games.
            */}

            {/* When a pokemon is selected, display the details here */}
            <div className="Details">
              {selected && (
                <div style={{padding: "1em"}}>
                  <h3>#{selected.id} {selected.name}</h3>
                  <p>Height: {selected.height}</p>
                  <p>Weight: {selected.weight}</p>
                  <p>Normal form</p> 
                  <img src={selected.sprites.front_default} alt={`${selected.name} normal form`} />
                  <p>Shiny form</p>
                  <img src={selected.sprites.front_shiny} alt={`${selected.name} shiny form`} />
                </div>
              )}
            </div>

            {/*
            For each pokemon that should be shown (there should be a max
            limit) display them in a list 
            */}

            <div className="Selector">
              {selectionList && (
                <Selector
                  data={selectionList}
                  onSelectPokemon={pokemon => this.onSelect(pokemon)}
                />
              )}

              {/*
                There should be a scroll up and scroll down action available, doing so should
                grab the next "page" of Pokemon from the API
              */}
              <button onClick={() => this.prev()}>prev</button>
              <button onClick={() => this.next()}>next</button>
            </div>

            <footer className="Footer">
              <p className="text-center">
                Built by <a href="https://twitter.com/devnoot">devnoot</a> using{" "}
                <a href="https://pokespi.co">PokeAPI</a>
              </p>
            </footer>

          </div>
        </main>

      </div>
    );
  }
}

export default App;
