require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var api = require("../helper.js");
var items = require("../database-mongo");
var db = require("../database-psql/");
const PORT = process.env.PORT || 3000;
var app = express();
const heb = require("../helpers/heb/");
const wholeFoods = require("../helpers/wholeFoods");

//HELPER FUNCTIONS
const reshapeItems = function(items, response = []) {
  items.map(obj => {
    const itemObj = {
      name: obj.name || "name not provided",
      price: obj.salePrice || "price not provided",
      image: obj.mediumImage || "image not provided",
      store_name: obj.store_name || "store_name not provided",
      query: obj.store_name || "query not provided",
      user_id: obj.store_name || "-1"
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
  });
  return response;
};

// MIDDLEWARE
app.use(express.static(__dirname + "/../react-client/dist"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// USER VERIFICATION

app.post("/db/users", (req, res) => {
  // console.log(req.body);
  // check if user exists in the db,
  if (req.body.type === "Sign Up") {
    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res.status(500).send();
      } else {
        console.log(bool.rows[0].exists);
        if (bool.rows[0].exists) {
          // if we find the user, send back an error code.
          res
            .status(401)
            .send("Sorry, this username is already taken. Please try again.");
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
  if (req.body.type === "Login") {
    db.findUser(req.body.username, (err, bool) => {
      if (err) {
        res
          .status(500)
          .send(
            "Sorry, there is no user by this name. Please sign up for The Green Bean."
          );
      } else {
        // if we find the user, we need to check their password.
        if (bool) {
          db.checkPassword(req.body.username, (err, response) => {
            if (err) {
              res.status(500).send();
            } else {
              response === req.body.password
                ? res.send()
                : res
                  .status(500)
                  .send(
                    "Sorry, your password is incorrect. Please try again."
                  );
            }
          });
        } else {
          res
            .status(401)
            .send(
              "Sorry, there is no user by this name. Please sign up for The Green Bean."
            );
        }
      }
    });
  }
  //else, return error
});

// ROUTES
app.get("/items", function(req, res) {
  db.selectAll(function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post("/api/items", function(req, res) {
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
app.post("/db/lists", function(req, res) {
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

app.post("/api/heb", (req, res) => {
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

app.post("/api/wholeFoods", (req, res) => {
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

app.post("/db/remove/items", (req, res) => {
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

app.post("/db/items", (req, res) => {
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

app.listen(PORT, function() {
  console.log("listening on port 3000!");
});
