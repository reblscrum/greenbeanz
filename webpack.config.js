var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');
var LOGIN_DIR = path.join(__dirname, '/react-client/login');

module.exports = {
  entry: {
    'app/app': `${SRC_DIR}/index.jsx`,
    'login/login': `${SRC_DIR}/login.jsx`
  },
  output: {
    filename: '[name].js',
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        use: ['babel-loader', 'eslint-loader'],
      }
    ]
  }
};