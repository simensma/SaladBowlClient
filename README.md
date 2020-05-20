# SaladBowlClient

![GitHub repo size](https://img.shields.io/github/repo-size/simensma/SaladBowlClient)
![GitHub contributors](https://img.shields.io/github/contributors/simensma/SaladBowlClient)
![GitHub stars](https://img.shields.io/github/stars/simensma/SaladBowlClient?style=social)
![GitHub forks](https://img.shields.io/github/forks/simensma/SaladBowlClient?style=social)

SaladBowlClient is the frontend part of the SaladBowl project that enables users to play the game of Salad Bowl online.

The project is built with [React](https://reactjs.org/) and [react-materialize](http://react-materialize.github.io/react-materialize), and uses [colyseus.js](https://docs.colyseus.io/getting-started/javascript-client/) to communicate with the server implementation built on top of the [colyseus](https://colyseus.io/) multiplayer game server.

**Note:**
SaladBowlServer is the backend part of the SaladBowl project, and has not been released publicly yet.

The project was developed so we could continue playing our favorite game during Covid-19, and can be accessed at https://play.simanda.ca.

## Salad what?

Salad bowl is a game combining Taboo, Charades, One Word, acting under a blanket? and anything else you can come up with into one. Players are divided into two teams, that take turns playing the mentioned games in order using words they submit at the beginning of the game. Once all the words submitted have been answered correctly, the game moves on to a round of the next chosen game using the same words, and so on, until all the games have been played with all the words submitted.

This project provides a room for users to take part of the game flow, however does not provide any means of communicating with eachother during the game, which is fairly important. Therefore it is suggested to use this together with your favorite video conferencing solution.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- `node.js`

## Installing SaladBowlClient

To install SaladBowlClient, follow these steps:

- `npm install`
- Edit `REACT_APP_SALAD_HOST` in `.env` (or add another `.env` file such as `env.local`) to point to your SaladBowlBackend server. Defaults to `ws://localhost:5000`

## Using SaladBowlClient

To run a dev server locally:

```
npm start
```

To build a production version:

```
npm build
```

## Want to contribute?

Feel free to fork the project and submit a PR with your propsed changes.

## Want to just check it out?

Here's a crash

## Contact

If you want to contact me visit https://smaaberg.com.

## License

This project uses the following license: [GNU General Public License v3.0](link).
