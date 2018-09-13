require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var api = require("../helper.js");
var db = require("../database-psql/");
const PORT = process.env.PORT || 3000;
var app = express();
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
  });
});

// MIDDLEWARE
app.use(session({ secret: "reblscrum", resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// USER VERIFICATION
app.post("/users/signup", (req, res) => {
  db.addUser(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post("/users/login", passport.authenticate('local', { failureRedirect: 'incorrectLogin' }), (req, res) => {
  res.send('/');
});

app.get('/users/logout',
  function (req, res) {
    req.logout();
    res.send('/login');
  });


// ROUTES
app.get('/', checkUser, (req, res) => {
  res.redirect('/app');
});

app.get('/app', checkUser, express.static(__dirname + "/../react-client/dist/app"));

app.use('/login', express.static(__dirname + "/../react-client/dist/login"));

app.get("/items", checkUser, function (req, res) {
  db.selectAll()
    .then(data => { return res.json(data); })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.post("/api/items", checkUser, function (req, res) {
  console.log(req.body.item);
  api.walmart(req.body.item, (err, result) => {
    if (err) {
      console.log("error getting back to the server", err);
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
app.post("/db/lists", checkUser, function (req, res) {
  // let cart = req.body.item;
  // cart.forEach(obj => {
  //   console.log('obj again', obj);
  //   db.insertOne(obj, (err, savedItems) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log('savedItems is', savedItems);
  //   });
  // });
  // const items = req.body.item;
  // reshapeItems(items);
  //___________________________________
  // console.log('Here is the req.body to server', req.body);
  const options = req.body;
  db.insertList(options, (err, data) => {
    if (err) {
      console.log("Error adding list from server", err);
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
            console.log("Error from server inserting into List_Items", err);
            // res.sendStatus(404);
          } else {
            console.log("Success inserting into List_Items", data);
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
  console.log("Here is a req body", req.body);
  const options = {
    id: req.body.id,
    tableName: "items"
  };
  db.deleteItem(options, (err, data) => {
    if (err) {
      console.log("Error from the Server", err);
      res.status(404);
    } else {
      console.log("Success from server", data);
      res.sendStatus(201);
    }
  });
});

app.post("/db/items", checkUser, (req, res) => {
  const body = req.body;
  db.insertOne(body, (err, savedData) => {
    if (err) {
      console.log("Error insertOne at /db/addOneItem", err);
      res.send(err);
    } else {
      console.log("Success inserting at /db/adOneItem", savedData);
      res.send(savedData);
    }
  });
});

app.listen(PORT, function () {
  console.log("listening on port 3000!");
});
