USE 'testing';

DROP TABLE if EXISTS items;
CREATE TABLE items (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  price NUMERIC (5, 2),
  description varchar(255) NOT NULL,
  brand varchar(255) NOT NULL
);