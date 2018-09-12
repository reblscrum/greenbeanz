const { Client } = require('pg');
const PGHOST = process.env.PG_HOST || 'localhost';
const PGUSER = process.env.PG_USER;
const PGDATABASE = process.env.PG_USER;
const PGPASSWORD = process.env.PG_PASS || null;
const PGPORT = process.env.PG_PORT || 5432;

const client = new Client(process.env.DATABASE_URL + '?ssl=true');
// const client = new Client({
//   user: PGUSER,
//   host: PGHOST,
//   database: PGDATABASE,
//   password: PGPASSWORD,
//   port: PGPORT
// });

client.connect();

const selectAll = (callback) => {
  const query = `SELECT * FROM items`
  client.query(query, (err, res) => {
    if (err) {
      callback(err, null);
    }
    callback(null, res);
  });
};

const insertOne = (itemObj, callback) => {
  const query = `INSERT INTO items (id, name, price, description) VALUES ($4, $1, $2, $3) ON CONFLICT (id) DO UPDATE SET price = $2;`;
  const params = [itemObj.name, itemObj.price, itemObj.desc, itemObj.itemId];
  client.query(query, params, (err, data) => {
    if (err) {
      console.log('error inserting into db');
      callback(err, null);
    }
    console.log('Added to db');
    callback(null, data);
  });
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

module.exports.selectAll = selectAll;
module.exports.insertOne = insertOne;
module.exports.findUser = findUser;
module.exports.addUser = addUser;
module.exports.checkPassword = checkPassword;
