const database = require("../database");

const createUser = ({ name, surname, email, password }) => {
  return database.query(
    `INSERT INTO users (name, surname, email, password) VALUES ('${name}', '${surname}', '${email}', '${password}')`
  );
};

const getUserByEmail = ({ email }, callback) => {
  return database.query(
    `SELECT * FROM users WHERE email = '${email}'`,
    callback
  );
};

const getUserById = ({ id }, callback) => {
  return database.query(
    `SELECT * FROM users WHERE idusers = '${id}'`,
    callback
  );
};

module.exports = { createUser, getUserByEmail, getUserById };
