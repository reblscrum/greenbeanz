require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var {walmart} = require('../helpers/walmart');
var db = require('../database-psql/');
const PORT = process.env.PORT || 3000;
var app = express();
const heb = require('../helpers/heb/');
const wholeFoods = require('../helpers/wholeFoods');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const checkUser = require('../helpers/checkUser');
const reshapeItems = require('../helpers/reshapeItems');
const bcrypt = require('bcrypt');


// Passport strategy
passport.use(new LocalStrategy(
  function (username, password, cb) {
    db.findUserByUsername(username)
      .then(user => {
        if (user.rowCount === 0) {
          return cb(null, false);
        }
        if (bcrypt.compareSync(password, user.rows[0].password)) {
          // Passwords match
          return cb(null, user.rows[0]);
        } else {
          return cb(null, false);
          // Passwords don't match
        }
        // if (user.rows[0].password !== password) {
        //   return cb(null, false);
        // }
        // return cb(null, user.rows[0]);
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
    if (err) {
      return cb(err);
    }
    cb(null, user.rows[0]);
  });
});

// MIDDLEWARE
app.use(session({ secret: 'reblscrum', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

// USER VERIFICATION
app.post('/users/signup', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  db.addUser(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/users/login', passport.authenticate('local'), (req, res) => {
  res.send('/app');
});


app.get('/users/logout',
  function (req, res) {
    req.logout();
    res.send('/');
  });


// ROUTES
app.get('/', (req, res)=>{
  if (req.user) {
    res.redirect('/app');
  } else {
    res.redirect('/landing');
  }
});

app.use('/app', checkUser, express.static(__dirname + '/../react-client/dist/app'));

app.use('/login', express.static(__dirname + '/../react-client/dist/login'));

app.use('/landing', express.static(__dirname + "/../react-client/dist/landing"));

app.get('/items', checkUser, function (req, res) {
  db.selectAll()
    .then(data => {
      return res.json(data);
    })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

// app.post('/api/items', checkUser, function (req, res) {
//   console.log(req.body.item);
//   api.walmart(req.body.item, (err, result) => {
//     if (err) {
//       console.log('error getting back to the server', err);
//     } else {
//       respon = JSON.parse(result.body);
//       response = reshapeItems(respon.items);

//       // console.log('I got that response here', response);
//       res.send(response);
//     }
//   });
// });


//was /db/items
app.post('/db/lists', function (req, res) {
  const options = req.body;
  console.log('what is req.user', req.user);
  options.userId = req.user.id;
  db.insertList(options, (err, data) => {
    if (err) {
      console.log('Error adding list from server', err);
    } else {
      console.log('Added to list from server', data);
      res.send(data);
      // options.shopList.map(itemObj => {
      //   // console.log('Here are my itemObjs ----------------', itemObj);
      //   const moreOptions = {
      //     listId: 1,
      //     itemId: itemObj.itemId
      //   };

      //   db.insertListItems(moreOptions, (err, data) => {
      //     if (err) {
      //       console.log('Error from server inserting into List_Items');
      //       // res.sendStatus(404);
      //     } else {
      //       console.log('Success inserting into List_Items');
      //       // res.sendStatus(201);
      //     }
      //   });
      // });
    }
  });
});

app.post('/db/list/save', checkUser, (req, res) => {
  const options = req.body;
  console.log('here are options now', options);
  options.userId = req.session.passport.id;
  db.findListId(options, (err, data) => {
    if (err) {
      console.log('error finding lists in db', err);
    } else if (data.rows.length > 0) {
      console.log('Got data fetching listId', data);
      
      options.shoppingList.map(itemObj => {
        const moreOptions = {
          listId: data.rows[0].id,
          itemId: itemObj.id
        };
        db.insertListItems(moreOptions, (err, data) => {
          if (err) {
            console.log('Error from server inserting into List_Items');
          } else {
            console.log('Success inserting into List_Items');
          }
        });
      });
    
    } else {
      console.log('Failed to find list');
    }
    
  });
});

// app.post('/api/items', function (req, res) {
//   // console.log(req.body.item);
//   let allResults = {
//     walmart: [],
//     wholeFoods: [],
//     heb: []
//   };

//   heb
//     .scrape(req.body.query)
//     .then(results => {
//       // res.json(results);
//       allResults.heb = results;
//     }).then(() => {
//     api.walmart(req.body.query, (err, result) => {
//       if (err) {
//         console.log('error getting back to the server', err);
//       } else {
//         respon = JSON.parse(result.body);
//         response = reshapeItems(respon.items);
//         // res.send(response);
//         allResults.walmart = response;
//         res.send(allResults);
//       }
//     })
//   });

// });

app.post('/api/walmart', function (req, res) {
  walmart(req.body.query, (err, result) => {
    if (err) {
      console.log('error getting back to the server', err);
    } else {
      respon = JSON.parse(result.body);
      response = reshapeItems(respon.items);
      res.send(response);
    }
  });
});


app.post('/api/heb', checkUser, (req, res) => {
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

app.post('/api/wholeFoods', checkUser, (req, res) => {
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

app.post('/db/remove/items', checkUser, (req, res) => {
  //options object should have an uniqueID for which item to be remove
  //also include the db table to remove from
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

app.post('/db/items', checkUser, (req, res) => {
  const body = req.body;
  body.user_id = req.user.id;
  db.insertOne(body, (err, savedData) => {
    if (err) {
      console.log('Error insertOne at /db/items', err);
      res.send(err);
    } else {
      console.log('Success inserting at /db/items', savedData);
      res.send(savedData);
    }
  });
});

app.get('/db/users/lists', checkUser, (req, res) => {
  const options = {
    userId: req.user.id
  };
  db.fetchUsersLists(options, (err, results) => {
    // let responseBody = []; 
    if (err) {
      console.log('Logging error inside fetch from server');
    } else {
      res.send(results);
      // //console.log('what are response in else statement', response);
    }
    //console.log('response please', response);
  });
});

app.post('/db/users/listItems', (req, res) => {
  const options = {
    userId: req.user.id,
    listId: req.body.listId
  };

  db.fetchListItems(options, (err, results) => {
    if (err) {
      res.status(404);
    } else {
      res.send(results.rows);
    }
  });
});

app.listen(PORT, function () {
  console.log('listening on port 3000!');
});
