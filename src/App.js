import React, { Component } from "react";
import Selector from "./components/Selector";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import TypePill from "./components/TypePill";

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
    limit: 10
  };

  componentDidMount() {
    // When the component mounts, grab a bunch of pokemon from the API
    const { offset, limit } = this.state;
    this.getPokemon(
      `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
    );

    // Set up tts
    if ("speechSynthesis" in window) {
      this.setState({ tts: window.speechSynthesis });
    }
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
        this.getPokedexEntry(res.species.url);
        // Get the species and the pokedex entry
      })
      .catch(error => this.setState({ error }))
  }

  getPokedexEntry(speciesURL, lang) {
    this.setState({ isLoading: true }); 
    fetch(speciesURL)
      .then(res => res.json())
      .then(species => {
        const entries = species.flavor_text_entries;
        const filtered = entries.filter(entry => entry.language.name === "en") 
        this.setState({ description: filtered[0].flavor_text });
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
    const url = new URL(this.state.prevURL);
    const params = url.searchParams;
    const limit = params.get("limit");
    const offset = params.get("offset");
    this.setState({ offset, limit });
    this.getPokemon(this.state.prevURL);
  }

  speak(text) {
    const { tts } = this.state;
    tts.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    tts.speak(utterance);
  }

  render() {
    const {
      selected,
      selectionList,
      error,
      isLoading,
      offset,
      limit,
      prevURL,
      description,
      tts
    } = this.state;

    /* 
    The pokedex can have one of two views, the first view is a selection 
    on the right side of the screen, with a portrait of the pokemon on
    the left side. The second view is invoked when the user "clicks" on 
    the pokemon from the scroll list. This view is a horizontal split
    wherein, on the top is an image of the pokemon, along with some stats.
    The bottom portion is the description of the pokemon. This view is 
    very similar to the Gen 1 pokedex in the Pokemon games.
    */

    return (
      <div className="App">
        <main className="mt-4">
          {/* First, if there's an error, display it */}
          {error && <p>{error}</p>}

          <Container>
            <Row>
              <Col md={6}>
                {/* When a pokemon is selected, display the details here */}
                {isLoading && <div className="loader"></div>}
                {selected && !isLoading && (
                  <div style={{ padding: "1em" }}>
                    <h3>
                      <Badge variant="primary">#{selected.id}</Badge>
                      <span className="ml-2 text-capitalize">
                        {selected.name}
                      </span>
                    </h3>
                    {/* Display the type or types */}
                    {selected.types.map((typedef, i) => (<TypePill key={i} type={typedef.type.name} />))}
                    <p className="text-muted mt-3">
                      {+selected.height * 10} cm / {+selected.weight / 10} kg
                    </p>

                    <p className="text-justify">{description}{!tts.speaking && this.speak(`${selected.name}, ${description}`)}</p>

                    <img
                      src={selected.sprites.front_default}
                      alt={`${selected.name} normal form`}
                    />
                    <img
                      src={selected.sprites.front_shiny}
                      alt={`${selected.name} shiny form`}
                    />

                  </div>
                )}
              </Col>
              <Col md={6}>
                <p className="text-muted text-uppercase">
                  Displaying {+offset} - {+offset + +limit}
                </p>
                
                {/*
                For each pokemon that should be shown (there should be a max
                limit) display them in a list 
                */}
                {selectionList && (
                  <Selector
                    data={selectionList}
                    onSelectPokemon={pokemon => this.onSelect(pokemon)}
                    offset={+offset}
                  />
                )}

                {/*
                There should be a scroll up and scroll down action available, doing so should
                grab the next "page" of Pokemon from the API
              */}
                <div className="mt-3">
                  <Button
                    className="mr-2"
                    onClick={() => this.prev()}
                    variant="text"
                    disabled={!prevURL}
                  >
                    Back
                  </Button>
                  <Button onClick={() => this.next()} variant="text">
                    Next
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </main>

        <footer className="mt-5">
          <Container>
            <Row>
              <Col>
                <p className="text-center text-muted">
                  Built by <a href="https://twitter.com/devnoot">devnoot</a>{" "}
                  using <a href="https://pokespi.co">PokeAPI</a>
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
}

export default App;
