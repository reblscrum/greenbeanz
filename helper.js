const request = require('request');
const config = require('./config.js')

let walmart = (query, callback) => {
  // console.log(config.TOKEN)
  let options = {
    'apiKey': config.TOKEN,
    'query': query,
    'numItems': 10
  }

  request({'url': 'http://api.walmartlabs.com/v1/search?', qs: options}, function(err, res, body) {

    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });


}

module.exports.walmart = walmart;