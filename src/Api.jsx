const config = require('./configuration');

class Api {
	constructor() {

	};

	Request (args) {
		let url = null;
		if (config.use_origin) {
			url = window.location.origin + (config.path ? config.path : '');
		} else {
			url = config.http + '://'+ config.host + (config.port ? ':' + config.port : '');
		}

		return fetch(url, {
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