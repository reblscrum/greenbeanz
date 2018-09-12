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

const selectAll = (callback) => {
  const query = 'SELECT * FROM items';
  const params = [];
  queryDatabase(query, params, callback);
};


const addUser = (username, password, callback) => {
  const query = `INSERT INTO users (name, password) VALUES ($1, $2);`;
  const params = [username, password];
  client.query(query, params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

const findUser = (username, callback) => {
  const query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${username}');`;

  client.query(query, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data.rows[0].exists);
    }
  });
};

const checkPassword = (username, callback) => {
  const query = `SELECT password FROM users WHERE name='${username}';`;
  client.query(query, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data.rows[0].password);
    }
  });
};

const insertOne = (itemObj, callback) => {
  const query = 'INSERT INTO items (id, name, price, description) VALUES ($4, $1, $2, $3) ON CONFLICT (id) DO UPDATE SET price = $2;';
  const params = [itemObj.name, itemObj.price, itemObj.desc, itemObj.itemId];
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

module.exports.selectAll = selectAll;
module.exports.insertOne = insertOne;
module.exports.findUser = findUser;
module.exports.addUser = addUser;
module.exports.checkPassword = checkPassword;
module.exports.deleteItem = deleteItem;
module.exports.insertList = insertList;
module.exports.insertListItems = insertListItems;
