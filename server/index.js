require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var api = require('../helper.js');
var items = require('../database-mongo');
var db = require('../database-psql/');
const PORT = process.env.PORT || 3000;
var app = express();
<<<<<<< HEAD
const heb = require('../helpers/heb/');
const wholeFoods = require('../helpers/wholeFoods');

//HELPER FUNCTIONS
const reshapeItems = function(items, response = []) {
  items.map(obj => {
    const itemObj = {
      name: obj.name || 'name not provided',
      price: obj.salePrice || 'price not provided',
      image: obj.mediumImage || 'image not provided',
      store_name: obj.store_name || 'store_name not provided',
      query: obj.store_name || 'query not provided',
      user_id: obj.store_name || '-1'
    };

    /* Leaving this here db call is still neccessary
      Currently just formats response data from walmart api
      Moved DB saving to onClick for each item */

    // db.insertOne(itemObj, (err, savedData) => {
    //   if (err) {
    //     console.log('Error adding item to DB', err);
    //   } else {
    //     console.log('Success adding item to DB');
    //   }
    // });
    response.push(itemObj);
=======
const heb = require("../helpers/heb/");
const wholeFoods = require("../helpers/wholeFoods");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const checkUser = require('../helpers/checkUser');
const reshapeItems = require('../helpers/reshapeItems');

// Passport strategy
passport.use(new LocalStrategy(
  function (username, password, cb) {
    db.findUserByUsername(username)
      .then(user => {
        if (user.rowCount === 0) { return cb(null, false); }
        if (user.rows[0].password !== password) { return cb(null, false); }
        return cb(null, user.rows[0]);
      })
      .catch(err => {
        return cb(err);
      });
  }));

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.findUserById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user.rows[0]);
>>>>>>> 214c5229d8d434d7b884b05dc25c828d908de660
  });
});

// MIDDLEWARE
<<<<<<< HEAD
app.use(express.static(__dirname + '/../react-client/dist'));
=======
app.use(session({ secret: "reblscrum", resave: false, saveUninitialized: false }));
>>>>>>> 214c5229d8d434d7b884b05dc25c828d908de660
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


<<<<<<< HEAD
app.post('/db/users', (req, res) => {
  // console.log(req.body);
  // check if user exists in the db,
  if (req.body.type === 'Sign Up') {
    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res.status(500).send();
      } else {
        console.log(bool.rows[0].exists);
        if (bool.rows[0].exists) {
          // if we find the user, send back an error code.
          res
            .status(401)
            .send('Sorry, this username is already taken. Please try again.');
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
      }
    });
  }
  //if so, log them in,
  if (req.body.type === 'Login') {
    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res
          .status(500)
          .send(
            'Sorry, there is no user by this name. Please sign up for The Green Bean.'
          );
      } else {
        // if we find the user, we need to check their password.
        if (bool) {
          db.checkPassword(req.body.username, (err, response) => {
            if (err) {
              res.status(500).send();
            } else {
              response.rows[0].password === req.body.password
                ? res.send()
                : res
                  .status(500)
                  .send(
                    'Sorry, your password is incorrect. Please try again.'
                  );
            }
          });
        } else {
          res
            .status(401)
            .send(
              'Sorry, there is no user by this name. Please sign up for The Green Bean.'
            );
        }
      }
=======
// USER VERIFICATION
app.post("/users/signup", (req, res) => {
  db.addUser(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
>>>>>>> 214c5229d8d434d7b884b05dc25c828d908de660
    });
});

<<<<<<< HEAD
// ROUTES
app.get('/items', function(req, res) {
  db.selectAll(function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
=======
app.post("/users/login", passport.authenticate('local', { failureRedirect: 'incorrectLogin' }), (req, res) => {
  res.send('/');
});

app.get('/users/logout',
  function (req, res) {
    req.logout();
    res.send('/login');
>>>>>>> 214c5229d8d434d7b884b05dc25c828d908de660
  });


// ROUTES
app.use('/app', express.static(__dirname + "/../react-client/dist/app"));

app.use('/login', express.static(__dirname + "/../react-client/dist/login"));

app.get('/', checkUser, (req, res) => {
  res.redirect('/app');
});

app.get("/items", checkUser, function (req, res) {
  db.selectAll()
    .then(data => { return res.json(data); })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

<<<<<<< HEAD
app.post('/api/items', function(req, res) {
=======
app.post("/api/items", checkUser, function (req, res) {
>>>>>>> 214c5229d8d434d7b884b05dc25c828d908de660
  console.log(req.body.item);
  api.walmart(req.body.item, (err, result) => {
    if (err) {
      console.log('error getting back to the server', err);
    } else {
      respon = JSON.parse(result.body);
      response = reshapeItems(respon.items);

      // console.log('I got that response here', response);
      res.send(response);
    }
  });
  // res.send(`api off right now, can't make a call to walmart for ${req.body.item}`)
});
//was /db/items
app.post('/db/lists', function (req, res) {
  const options = req.body;
  db.insertList(options, (err, data) => {
    if (err) {
      console.log('Error adding list from server', err);
    } else {
      // console.log('Added to list from server', data);
      options.shopList.map(itemObj => {
        // console.log('Here are my itemObjs ----------------', itemObj);
        const moreOptions = {
          listId: 1,
          itemId: itemObj.itemId
        };

        db.insertListItems(moreOptions, (err, data) => {
          if (err) {
            console.log('Error from server inserting into List_Items', err);
            // res.sendStatus(404);
          } else {
            console.log('Success inserting into List_Items', data);
            // res.sendStatus(201);
          }
        });
      });
    }
  });
});

app.post("/api/heb", checkUser, (req, res) => {
  heb
    .scrape(req.body.query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post("/api/wholeFoods", checkUser, (req, res) => {
  wholeFoods
    .scrape(req.body.query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post("/db/remove/items", checkUser, (req, res) => {
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

app.post("/db/items", checkUser, (req, res) => {
  const body = req.body;
  db.insertOne(body, (err, savedData) => {
    if (err) {
      console.log('Error insertOne at /db/addOneItem', err);
      res.send(err);
    } else {
      console.log('Success inserting at /db/adOneItem', savedData);
      res.send(savedData);
    }
  });
});

app.get('/db/users/lists', (req, res) => {
  console.log('here is a req', req.body);
});

app.listen(PORT, function () {
  console.log("listening on port 3000!");
});
