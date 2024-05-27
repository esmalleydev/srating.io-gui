![build](https://github.com/esmalleydev/srating.io-gui/actions/workflows/build.js.yml/badge.svg)
![version](https://img.shields.io/github/package-json/v/esmalleydev/srating.io-gui)
# [srating.io](https://srating.io)

This is the open-source GUI project for [srating.io](https://srating.io). This project uses [nextjs](https://nextjs.org/), [reactjs](https://reactjs.org/) and [MUI](https://mui.com/material-ui/getting-started/overview/).

Prerequisites: typescript, nodejs, npm.

## Looking for the API documentation?
### [docs.srating.io](https://docs.srating.io)

## Set up

After cloning project, in the project directory run:
`npm install`

To start developing run:
`npm run dev`

If you would like to contribute, please [contact me](mailto:contact@srating.io) for an API key.


## Client api
These calls run through the client... and will attach required headers to the fetch request.

In the project root you will need to create a `clientConfig.js` file. Use the provided `clientConfig_example.js` as a template. This points the gui api requests to the correct place.

```js
module.exports = {
  'host': 'https://api.srating.io/v1/',
  'api_key': '[YOUR API KEY HERE]',
  'http': 'https',
  'use_origin': false, // If true, requests will use the window.location.origin
  'path': null, // if using origin and need a path, ex: /api
};
```

### Using the component
```jsx
'use client';
import { useClientAPI } from '@/components/clientAPI';

useClientAPI({
  'class': 'cbb_game',
  'function': 'getScores',
  'arguments': {
    'start_date': '2024-01-26',
  },
}).then((response) => {
  console.log(response);
}).catch((e) => {
  console.log(e);
});
```

## Server api
These calls run through on the server. It will attach any required setting as well as handling caching the calls for performance

In the project root you will need to create a `serverConfig.js` file. Use the provided `serverConfig_example.js` as a template. This points the server api requests to the correct place.

```js
module.exports = {
  'host': 'localhost',
  'port': 5000,
  'http': 'http',
};
```

### Using the component
```jsx
'use server';
import { useServerAPI } from '@/components/serverAPI';

const revalidateScoresSeconds = 20; // cache scores for 20 seconds
  
const scores = await useServerAPI({
  'class': 'cbb_game',
  'function': 'getScores',
  'arguments': {
    'start_date': '2024-01-26',
  }
}, {revalidate: revalidateScoresSeconds});

console.log(scores);
```

## Pages

### [Ranking](app/cbb/ranking/README.md)

### [Games](app/cbb/games/README.md)

### [Picks](app/cbb/picks/README.md)

### [Team](app/cbb/team/[team_id]/README.md)

### [Player](app/cbb/player/[player_id]/README.md)

### [Game](app/cbb/games/[cbb_game_id]/README.md)

### Tips
May need to clear out .next and node_modules folder before rebuilding
`rm -r node_modules`
`rm -r .next`

## Other Scripts

### `npm run build`

### `npm run start`



<!-- ![status](https://img.shields.io/uptimerobot/status/m793600490-481ed5a22e5d58de53fdb32a) -->
<!-- ![uptime](https://img.shields.io/uptimerobot/ratio/7/m793600490-481ed5a22e5d58de53fdb32a) -->


