const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL + '?ssl=true');
client.connect();

const queryDatabase = (query, params, callback) => {
  try {
    client.query(query, params, (err, res) => {
      if (err) {
        callback(err, null);
      }
      callback(null, res);
    });
  } catch (err) {
    callback(err, null);
  }
};

const promiseQueryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    client.query(query, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const selectAll = () => {
  const query = 'SELECT * FROM items';
  const params = [];
  return promiseQueryDatabase(query, params);
};

const findUser = (username) => {
  const query = 'SELECT EXISTS (SELECT 1 FROM users WHERE name=$1);';
  const params = [username];
  return promiseQueryDatabase(query, params);
};

const addUser = (userObj) => {
  let { username, password } = userObj;
  const query = 'INSERT INTO users (name, password) VALUES ($1, $2);';
  const params = [username, password];
  return findUser(username)
    .then(data => {
      if (!data.rows[0].exists) {
        return promiseQueryDatabase(query, params)
          .then(data => {
            return "Successfully signed up!";
          })
          .catch(err => {
            console.log(err);
            return err;
          })
      } else {
        return "Sorry, this username is already taken. Please try again.";
      }
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

const checkPassword = (username, callback) => {
  const query = 'SELECT password FROM users WHERE name=$1;';
  const params = [username];
  queryDatabase(query, params, callback);
};

const insertOne = (itemObj, callback) => {
  const query = 'INSERT INTO items (name, price, image, store_name, query, user_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET price = $2;';
  const params = [itemObj.name, itemObj.price, itemObj.image, itemObj.store_name, itemObj.query, itemObj.user_id];
  queryDatabase(query, params, callback);
};

const deleteItem = (options, callback) => {
  const query = 'DELETE FROM items WHERE id = $1;';
  const params = [options.id];
  queryDatabase(query, params, callback);
};

const insertList = (options, callback) => {
  const query = 'INSERT INTO lists (budget, user_id, name) VALUES ($1, $2, $3);';
  const params = [options.budget, options.userId, options.listName];
  queryDatabase(query, params, callback);
};

const insertListItems = (options, callback) => {
  const query = 'INSERT INTO lists_items (lists_id, items_id) VALUES ($1, $2);';
  const params = [options.listId, options.itemId];
  queryDatabase(query, params, callback);
};

const findUserById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id=$1;';
  const params = [id];
  queryDatabase(query, params, callback);
};

const findUserByUsername = (username) => {
  const query = 'SELECT * FROM users WHERE name=$1;';
  const params = [username];
  return promiseQueryDatabase(query, params);
};

const fetchUsersLists = (options, callback) => {
  const query = 'SELECT * from items INNER JOIN lists ON lists.user_id = items.user_id AND lists.user_id = $1;';
  const params = [options.userId];
  queryDatabase(query, params, callback);
};

module.exports = { selectAll, insertOne, findUser, addUser, checkPassword, deleteItem, insertList, insertListItems, findUserById, findUserByUsername, fetchUsersLists };

