const request = require('request');

let walmart = (query, callback) => {
  let options = {
    apiKey: process.env.TOKEN,
    query: query,
    categoryId: 976759,
    numItems: 10
  };

  request(
    { url: 'http://api.walmartlabs.com/v1/search?', qs: options },
    function(err, res, body) {
      if (err) {
        console.log('er');
        callback(err, null);
      } else {
        let parseBody = JSON.parse(body);
        if (parseBody.message === 'Results not found!') {
          callback(1, null);
        } else {
          callback(null, res);
        }
      }
    }
  );
};

module.exports.walmart = walmart;
