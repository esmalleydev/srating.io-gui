# > srating.io

This is the open-source GUI project for srating.io. This utilizes [reactjs](https://reactjs.org/) and [MUI](https://mui.com/material-ui/getting-started/overview/)

## Set up

If you would like to contribute, please contact me for an API key.

In the `src` folder you will need to create a `configuration.js` file. Use the provided `configuration_example.js` as a template. This points the gui api requests to the correct place.

```
module.exports = {
  'host': 'api.srating.io',
  'api_key': '[YOUR API KEY HERE]',
  'http': 'https',
  'use_origin': false, // If true, requests will use the window.location.origin
  'path': null, // if using origin and need a path, ex: /api
};
```

API keys are limited to 10,000 requests per month, if you need more requests, please contact me.

## API requests

The `src\Api.jsx` Api class has a wrapper to handle requests.

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

## Structure

### component

General reusable components across the system.

### css

Where the css goes!

### helpers

Helper functions to be used system wide. TODO examples

### hooks

Custom hooks. TODO examples

### sports

#### CBB

All code related to College basketball

##### Picks

TODO

##### Ranking

TODO

##### Games

TODO

##### Game

TODO

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.




