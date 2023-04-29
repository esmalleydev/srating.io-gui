
const commitHash = require('child_process')
	.execSync('git rev-parse --short HEAD')
	.toString()
	.trim();


const commitDate = require('child_process')
	.execSync('git log -1 --format=%cd')
	.toString()
	.trim();

module.exports = {
	// experimental: {
	// 	scrollRestoration: false,
	// },
	env: {
		COMMIT_HASH: commitHash,
		COMMIT_DATE: commitDate
	}
};
