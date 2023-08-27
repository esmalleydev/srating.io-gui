

const commitHash = require('child_process')
	.execSync('git rev-parse --short HEAD')
	.toString()
	.trim();


const commitDate = require('child_process')
	.execSync('git log -1 --format=%cd')
	.toString()
	.trim();

const config_ = require('./configuration.js')

module.exports = {
	// experimental: {
	// 	scrollRestoration: false,
	// },
	env: {
		COMMIT_HASH: commitHash,
		COMMIT_DATE: commitDate,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: config_.stripe_public_key,
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

