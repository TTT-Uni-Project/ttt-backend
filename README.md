# Tic-Tac-Toe Backend

This project is the backend service for the **Tic-Tac-Toe** application.
This documentation contains several tabs you need to slightly go through,
before running the service.

## Table of contents

1. [Architecture](#architecture)
2. [Game Protocol](#game-protocol)
3. [Installation](#installation)
4. [Running process](#running-process)

## Architecture

The project's architecture is documented, under `architecture.drawio`. The file can be opened,
via [draw.io](https://app.diagrams.net/), or via
the [draw.io intellij plugin](https://plugins.jetbrains.com/plugin/15635-diagrams-net-integration)

⚠️ **Any architectural changes need to be reflected in this file and committed!** ⚠️

## Game Protocol

All gameplay information, is exchanged in [Socket.io Rooms](https://socket.io/docs/v3/rooms/),
using [Socket.io Event](https://socket.io/docs/v3/emitting-events/).
And the data passed in these events needs to conform to the following protocol:

```js
const X = 1
const O = 0
const EMPTY = 9
```

#### Event GAME_STATE

Sent by **server** listened to by **clients**

```js
const mockGameStateEventArgs = {
  id: '',
  players: [
    { id: '', username: '', piece: X },
    { id: '', username: '', piece: O }
  ],
  playerTurn: '',
  winner: null,
  // Field 'winner' can be either null or have a player's id.
  // A null value would signify a stalemate.
  state: GAME_STATUS.STARTED | GAME_STATUS.FINISHED,
  board: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
}

// For simplicity the board is going to be a number array,
// indicating the board state.
//
//   0 | 1 | 2
// -------------
//   3 | 4 | 5
// -------------
//   6 | 7 | 8
```

A client receives a **GAME_STATE** event when it initially connects to a game room,
and after a move is played.

When a client receives a **GAME_STATE** event, it needs to update the UI accordingly.

#### Event MOVE_PLAYED

Sent by **clients** listened to by **server**

```js
const mockMovePlayedEventArgs = {
  gameId: '',
  playerId: '',
  move: { piece: X, position: 5 }
}
```

A server receives a **MOVE_PLAYED** event when a player plays a move.

When the server receives a **MOVE_PLAYED**,
it updates the game state and sends out a **GAME_STATE** to the Game Room

## Installation

To install this application, you need to go through some steps:

Firstly, you need to install the dependencies:

### `npm install`

Secondly, you need to dockerize the database:

```shell
docker compose up
```

After that, you need to configure your AWS credentials for the database using:

```shell
aws configure
```

The final step is to initialize the database by running:

### `npm run db-init`

## Running Process

To run the server, you need to have been gone through the installation process
and the only thing you need to do is to run the next command:

### `npm start`
