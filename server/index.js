var express = require('express');
var bodyParser = require('body-parser');
var api = require('../helper.js');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
var items = require('../database-mongo');

var app = express();

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/api/items', function(req, res) {
  console.log(req.body.item);
  api.walmart(req.body.item, (err, result) => {
    if (err) {
      console.log('error getting back to the server', err)
    } else {
      respon = JSON.parse(result.body);
      response = [];

      respon.items.map(obj => {
        response.push({
          name: obj.name,
          itemId: obj.itemId,
          price: obj.salePrice,
          image: obj.mediumImage,
          desc: obj.shortDescription
        })
      })
      // console.log(response);
      res.send(response);
    }
  })
  // res.send(`api off right now, can't make a call to walmart for ${req.body.item}`)
})


app.post('/db/items', function(req, res) {

  console.log(req.body.item);
  let cart = req.body.item;

  cart.forEach(obj => {
    items.addItem(obj, (err, savedItemName) => {
      if(err) {
        console.log(err);
      } else {
        console.log(savedItemName, 'was saved to the database');
      }
    }) 
  })


}); 



app.listen(3000, function() {
  console.log('listening on port 3000!');
});

