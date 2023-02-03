![build](https://github.com/esmalleydev/srating.io-gui/actions/workflows/build.js.yml/badge.svg)
![status](https://img.shields.io/uptimerobot/status/m793600490-481ed5a22e5d58de53fdb32a)
![uptime](https://img.shields.io/uptimerobot/ratio/7/m793600490-481ed5a22e5d58de53fdb32a)
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
  'host': 'api.srating.io',
  'api_key': '[YOUR API KEY HERE]',
  'http': 'https',
  'use_origin': false, // If true, requests will use the window.location.origin
  'path': null, // if using origin and need a path, ex: /api
};
```

API keys are limited to 10,000 requests per month, if you need more requests, please [contact me](mailto:contact@srating.io).

## Pages

### [Homepage](pages/Homepage.md)

### [Ranking](pages/CBB/Ranking.md)

### [Games](pages/CBB/Games.md)

### [Picks](pages/CBB/Picks.md)

### [Game](pages/CBB/Games/Game.md)

### [Team](pages/CBB/Games/Team.md)

## API requests

The `components\Api.jsx` Api class has a wrapper to handle requests.

Schema documentation coming soon!

The API requests are based on CRUD. In addition, each table / class has other calls which return data from multiple tables / formatting for performance.

Your api key will not have write access. If you would like write access please [contact me](mailto:contact@srating.io).

```
import Api from './Api.jsx';
const api = new Api();

api.Request({
  'class': 'team',
  'function': 'getCBBTeam',
  'arguments': {
    'team_id': params.team_id,
   }
}).then(team => {
  console.log(team);
}).catch((err) => {
  console.log(err);
});

api.Request({
  'class': 'team',
  'function': 'get',
  'arguments': {
    'team_id': params.team_id,
   }
}).then(team => {
  console.log(team);
}).catch((err) => {
  console.log(err);
});

api.Request({
  'class': 'team',
  'function': 'read',
  'arguments': {
    'cbb': '1',
   }
}).then(teams => {
  console.log(teams);
}).catch((err) => {
  console.log(err);
});

```

I am also investigating open-sourcing my server side api for visibility, although I'm not sure how useful it would be as I am not planning on giving database access currently!

If you have Server side API suggestions or bugs, please [contact me](mailto:contact@srating.io).

## Other Scripts

### `npm run build`

### `npm run start`






