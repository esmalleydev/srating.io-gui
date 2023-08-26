
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
		COMMIT_DATE: commitDate,
		// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_51NJSzoDIZlrOiqc2m1Jff7AUKgaSkEWcbxpUVIYpFFSz8bWOY9EKPdJNNyPK0me8Xc1YSc1jqw1xyghcRRQ1lsjb00o84FNaf5'
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_51NJSzoDIZlrOiqc2nwnVc2Bk8XCiBz9XR8AoQZuwyJ10iqwJ8CLd2Zwuu19TLJE0gPxFyY9zWVnFGNHWhQCe5kiw00nZ58SYqL'
	},
	webpack: (config, options) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
      	{
          loader: 'html-loader'
        },
        {
          loader: 'markdown-loader',
        },
      ],
    })
 
    return config
  },
};

