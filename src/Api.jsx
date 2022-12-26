const config = require('./configuration');

class Api {
	constructor() {

	};

	Request (args) {
		return fetch(config.http + '://'+ config.host + (config.port ? ':' + config.port : ''), {
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/json',
				'X-API-KEY': config.api_key || null,
			},
			'body': JSON.stringify(args),
		}).then(response => {
			return response.json();
		}).then(json => {
			return json;
		}).catch(error => {
			console.log(error);
			throw new Error('Error');
		});
	};

};

export default Api;