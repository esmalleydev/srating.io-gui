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


## Client api
These calls run on the client. It will attach any required headers to the fetch request.

### Using the component
```jsx
'use client';
import { useClientAPI } from '@/components/clientAPI';

useClientAPI({
  'class': 'game',
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
These calls run on the server. It will attach any required setting as well as handling caching the calls for performance

### Using the component
```jsx
'use server';
import { useServerAPI } from '@/components/serverAPI';

const revalidateScoresSeconds = 20; // cache scores for 20 seconds
  
const scores = await useServerAPI({
  'class': 'game',
  'function': 'getScores',
  'arguments': {
    'start_date': '2024-01-26',
  }
  'cache': revalidateScoresSeconds,
});

console.log(scores);
```

## Pages

### [Ranking](app/cbb/ranking/README.md)

### [Games](app/cbb/games/README.md)

### [Picks](app/cbb/picks/README.md)

### [Team](app/cbb/team/[team_id]/README.md)

### [Player](app/cbb/player/[player_id]/README.md)

### [Game](app/cbb/games/[game_id]/README.md)

### Tips
May need to clear out .next and node_modules folder before rebuilding
`rm -r node_modules`
`rm -r .next`

### .env.local
You will need to set up a .env.local file. Below is an example
```
SERVER_PROTOCAL=http
SERVER_HOST=localhost
SERVER_PORT=3500
SERVER_SECRET=foo

NEXT_PUBLIC_CLIENT_PROTOCAL=http
NEXT_PUBLIC_CLIENT_HOST=localhost
NEXT_PUBLIC_CLIENT_PORT=4000
NEXT_PUBLIC_CLIENT_USE_ORIGIN=false
NEXT_PUBLIC_CLIENT_PATH=''
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=foo
```

## Other Scripts

### `npm run build`

### `npm run start`



<!-- ![status](https://img.shields.io/uptimerobot/status/m793600490-481ed5a22e5d58de53fdb32a) -->
<!-- ![uptime](https://img.shields.io/uptimerobot/ratio/7/m793600490-481ed5a22e5d58de53fdb32a) -->


