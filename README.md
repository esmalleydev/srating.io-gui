![build](https://github.com/esmalleydev/srating.io-gui/actions/workflows/build.js.yml/badge.svg)
![version](https://img.shields.io/github/package-json/v/esmalleydev/srating.io-gui)
# [>srating.io](https://srating.io)

This is the open-source GUI project for [srating.io](https://srating.io). This project uses [nextjs](https://nextjs.org/), [reactjs](https://reactjs.org/) and [MUI](https://mui.com/material-ui/getting-started/overview/).

Prerequisites: Nodejs, npm.

## Set up

After cloning project, in the project directory run:
`npm install`

To start developing run:
`npm run dev`

If you would like to contribute, please [contact me](mailto:contact@srating.io) for an API key.

In the project root you will need to create a `configuration.js` file. Use the provided `configuration_example.js` as a template. This points the gui api requests to the correct place.

```
module.exports = {
  'host': 'https://api.srating.io/v1/',
  'api_key': '[YOUR API KEY HERE]',
  'http': 'https',
  'use_origin': false, // If true, requests will use the window.location.origin
  'path': null, // if using origin and need a path, ex: /api
};
```

## API Documentation
### [docs.srating.io](https://docs.srating.io)

## Pages

### [Ranking](app/cbb/ranking/README.md)

### [Games](app/cbb/games/README.md)

### [Picks](app/cbb/picks/README.md)

### [Team](app/cbb/team/[team_id]/README.md)

### [Player](app/cbb/player/[player_id]/README.md)

### [Game](app/cbb/games/[cbb_game_id]/README.md)

## API requests

The `components\Api.jsx` Api class is a wrapper to handle requests.

```
import Api from './Api.jsx';
const api = new Api();

api.Request({
  'class': 'team',
  'function': 'get',
  'arguments': {
    'team_id': params.team_id,
   }
}).then((team) => {
  console.log(team);
}).catch((err) => {
  console.log(err);
});
```

## Other Scripts

### `npm run build`

### `npm run start`



<!-- ![status](https://img.shields.io/uptimerobot/status/m793600490-481ed5a22e5d58de53fdb32a) -->
<!-- ![uptime](https://img.shields.io/uptimerobot/ratio/7/m793600490-481ed5a22e5d58de53fdb32a) -->


