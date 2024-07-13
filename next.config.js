import { execSync } from 'child_process';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { clientConfig } from './clientConfig.js';


const commitHash = execSync('git rev-parse --short HEAD')
  .toString()
  .trim();


const commitDate = execSync('git log -1 --format=%cd')
  .toString()
  .trim();

const bundleAnalyzer = withBundleAnalyzer({
  enabled: false,
});


const config = clientConfig || {
  stripe_public_key: undefined,
};


export default bundleAnalyzer({
  // experimental: {
  //   scrollRestoration: false,
  // },
  env: {
    COMMIT_HASH: commitHash,
    COMMIT_DATE: commitDate,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: config.stripe_public_key,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config /* options */) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: 'html-loader',
        },
        {
          loader: 'markdown-loader',
        },
      ],
    });

    return config;
  },
});



