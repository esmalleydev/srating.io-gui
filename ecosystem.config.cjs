// todo maybe remove this? not sure if it is any useful
// if I want to use it, should check the ENV variables to make sure stripe pulic key etc still work, since it is setting an env variable
module.exports = {
  apps: [
    {
      name: 'next',
      script: './node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
