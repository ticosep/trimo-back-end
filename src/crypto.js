var AES = require("crypto-js/aes");
const dotenv = require("dotenv");

// Config dotenv to get access to the variables
dotenv.config();

const getAppCode = (farm_id, user_id) => {
  const code = AES.encrypt(`${farm_id}/${user_id}`, process.env.AES_PASS);

  return code;
};

const decodeAppCode = (code) => {
  const message = AES.decrypt(code, process.env.AES_PASS);

  return message;
};

module.exports = { getAppCode, decodeAppCode };
