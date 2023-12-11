
// this is just for the github build to pass, since the configuration file is git ignored
let config = {};
try {
	config = require('../configuration');
} catch (e) {
	config = {
		'host': 'localhost',
	  'port': 5000,
	  'http': 'http',
	};
}

class Api {
	constructor() {

	};

	Request (args, optional_fetch_args = {}) {
		let url = null;
		if (config.use_origin) {
			url = window.location.origin + (config.path ? config.path : '');
		} else {
			url = config.http + '://'+ config.host + (config.port ? ':' + config.port : '');
		}

		let session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

		return fetch(url, Object.assign(optional_fetch_args, {
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/json',
				'X-API-KEY': config.api_key || null,
				'X-SESSION-ID': session_id || null,
			},
			'body': JSON.stringify(args),
		})).then(response => {
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