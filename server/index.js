require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var api = require('../helper.js');
var items = require('../database-mongo');
var db = require('../database-psql/');
const PORT = process.env.PORT || 3000;
var app = express();
const heb = require('../helpers/heb/');

//HELPER FUNCTIONS
const saveItemsToDB = function(items, response = []) {
  items.map(obj => {
    console.log('Inside mapping Function ---> Here is obj', obj);
    const itemObj = {
      name: obj.name || 'name not provided',
      itemId: obj.itemId || 'id not provided',
      price: obj.salePrice || 'price not provided',
      image: obj.mediumImage || 'image not provided',
      desc: obj.shortDescription || 'desc not provided'
    };
    db.insertOne(itemObj, (err, savedData) => {
      if (err) {
        console.log('Error adding item to DB', err);
      } else {
        console.log('Success adding item to DB');
      }
    });
    response.push(itemObj);
  });
  return response;
};

// MIDDLEWARE
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// USER VERIFICATION 

app.post('/db/users', (req, res) => {
  console.log(req.body);
  // check if user exists in the db, 
  if (req.body.type === 'Sign Up') {

    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res.status(500).send();
      } else {
        // console.log(bool);
        if (bool) {
          // if we find the user, send back an error code.
        res.status(401).send('Sorry, this username is already taken. Please try again.');
        } else {
          // if we do not find a user by this username, add them to the db
          db.addUser(req.body.username, req.body.password, (err, response) => {
            if (err) {
              // console.log(err, ' adding to db');
              res.status(500).send();
            } else {
              res.send(response);
            }
          });
        }
      };
    });
  };
  //if so, log them in, 
  if (req.body.type === 'Login') {
    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res.status(500).send('Sorry, there is no user by this name. Please sign up for The Green Bean.');
      } else {
        // if we find the user, we need to check their password.
        if(bool) {
          db.checkPassword(req.body.username, (err, response) => {
            if (err) {
              res.status(500).send();
            } else {
              response === req.body.password ? res.send() : res.status(500).send('Sorry, your password is incorrect. Please try again.');
            }
          });
        } else {
          res.status(401).send('Sorry, there is no user by this name. Please sign up for The Green Bean.');          
        }
      }
    });
  };
  //else, return error
});



// ROUTES
app.get('/items', function (req, res) {
  db.selectAll(function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});


app.post('/api/items', function (req, res) {
  console.log(req.body.item);
  api.walmart(req.body.item, (err, result) => {
    if (err) {
      console.log('error getting back to the server', err);
    } else {
      respon = JSON.parse(result.body);
      response = saveItemsToDB(respon.items);

      // console.log('I got that response here', response);
      res.send(response);
    }
  });
  // res.send(`api off right now, can't make a call to walmart for ${req.body.item}`)
});

//mongoDB 
app.post('/db/items', function (req, res) {

  // console.log(req.body.item);
  // let cart = req.body.item;

  // cart.forEach(obj => {
  //   console.log('what is this obj in cart', obj)
  //   items.addItem(obj, (err, savedItemName) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(savedItemName, 'was saved to the database');
  //     }
  //   })
  // })
  console.log('Here is my req.body', req.body);
  let cart = req.body.item;
  cart.forEach(obj => {
    console.log('obj again', obj);
    db.insertOne(obj, (err, savedItems) => {
      if (err) {
        console.log(err);
      }
      console.log('savedItems is', savedItems);
    });
  });


});

app.post('/api/heb', (req, res) => {
  heb.scrape(req.body.query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/db/remove/items', (req, res) => {
  //options object should have an uniqueID for which item to be remove
  //also include the db table to remove from
  console.log('Here is a req body', req.body);
  const options = {
    id: req.body.id,
    tableName: 'items'
  };
  db.deleteItem(options, (err, data) => {
    if (err) {
      console.log('Error from the Server', err);
      res.status(404);
    } else {
      console.log('Success from server', data);
      res.sendStatus(201);
    } 
  });
});


app.listen(PORT, function () {
  console.log('listening on port 3000!');
});