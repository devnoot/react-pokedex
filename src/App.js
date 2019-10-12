import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  state = {
    isLoading: false,
    error: "",
    selected: 0,
    selectionList: "",
    nextURL: "",
    prevURL: "",
    offset: 0,
    limit: 15
  } 
  
  componentDidMount() {
    // When the component mounts, grab a bunch of pokemon from the API
    const { offset, limit } = this.state; 
    this.getPokemon(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`); 
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
        })
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }))
  }

  next() {
    // Set the offset and limit based on the URL
    this.getPokemon(this.state.nextURL); 
  }

  prev() {
    this.getPokemon(this.state.prevURL); 
  }

  render() {
    const { selected, selectionList, error, isLoading, offset } = this.state;

    return (
      <div className="App">
        <div className="Container">
          {/* First, if there's an error, display it */}
          {error && <p>{error}</p>}
          
          {/* 
           The pokdex can have one of two views, the first view is a selection 
           on the right side of the screen, with a portrait of the pokemon on
           the left side. The second view is invoked when the user "clicks" on 
           the pokemon from the scroll list. This view is a horizontal split
           wherein, on the top is an image of the pokemon, along with some stats.
           The bottom portion is the description of the pokemon. This view is 
           very similar to the Gen 1 pokedex in the GameBox games.
          */} 
          <div className="Portrait"></div>
          <div className="Selector">
            {/*
             For each pokemon that should be shown (there should be a max
             limit) display them in a list 
            */}
            {selectionList && selectionList.map((pokemon, i) => <p key={i}>{offset + i} {pokemon.name}</p>)} 
            {/*
              There should be a scroll up and scroll down action available, doing so should
              grab the next "page" of Pokemon from the API
            */}
            <button onClick={() => this.prev()}>prev</button>
            <button onClick={() => this.next()}>next</button> 
          </div>

          <footer className="Footer">
            <p>Built by <a href="https://twitter.com/devnoot">devnoot</a> using <a href="https://pokespi.co">PokeAPI</a></p> 
          </footer>

        </div>
      </div>
    );
  }
}

export default App;
