const database = require("../database");

const createUser = ({ name, surname, email, password }) => {
  return database.query(
    `INSERT INTO users (name, surname, email, password) VALUES ('${name}', '${surname}', '${email}', '${password}')`
  );
};

const getUser = ({ email }, callback) => {
  return database.query(
    `SELECT * FROM users WHERE email = '${email}'`,
    callback
  );
};

module.exports = { createUser, getUser };
