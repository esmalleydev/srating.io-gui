

const commitHash = require('child_process')
	.execSync('git rev-parse --short HEAD')
	.toString()
	.trim();


const commitDate = require('child_process')
	.execSync('git log -1 --format=%cd')
	.toString()
	.trim();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: false,
});

// this is just for the github build to pass, since the configuration file is git ignored
let config_ = {
	stripe_public_key: null,
};
try {
	config_ = require('./clientConfig');
} catch (e) {
	config_ = {
		stripe_public_key: null,
	};
}

 
module.exports = withBundleAnalyzer({
	// experimental: {
	// 	scrollRestoration: false,
	// },
	env: {
		COMMIT_HASH: commitHash,
		COMMIT_DATE: commitDate,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: config_.stripe_public_key,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
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
});



