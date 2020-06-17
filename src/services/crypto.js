var CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

// Config dotenv to get access to the variables
dotenv.config();

const getAppCode = (farm_id, user_id) => {
  const code = CryptoJS.AES.encrypt(
    `${farm_id}/${user_id}`,
    process.env.AES_PASS
  );

  return code;
};

const decodeAppCode = (code) => {
  const message = CryptoJS.AES.decrypt(code, process.env.AES_PASS).toString(
    CryptoJS.enc.Utf8
  );

  return message;
};

module.exports = { getAppCode, decodeAppCode };
