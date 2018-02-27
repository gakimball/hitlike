import React, { Component, Fragment } from 'react';
import DocumentEvents from 'react-document-events';
import Game from '../lib/game';

export default class GameContainer extends Component {
  game = new Game()

  componentDidMount() {
    this.container.appendChild(this.game.getCanvas());
  }

  render() {
    return (
      <Fragment>
        <div ref={e => { this.container = e; }} />
        <DocumentEvents onKeyDown={this.game.handleKey} />
      </Fragment>
    );
  }
}
