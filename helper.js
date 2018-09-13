const request = require('request');

let walmart = (query, callback) => {
  let options = {
    'apiKey': process.env.TOKEN,
    'query': query,
    'numItems': 10
  };

  request({ 'url': 'http://api.walmartlabs.com/v1/search?', qs: options }, function (err, res, body) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
};

module.exports.walmart = walmart;