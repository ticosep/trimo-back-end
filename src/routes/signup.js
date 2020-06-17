const { database, query } = require("../services/database");
const express = require("express");
const { jwt, jwtOptions } = require("../services/passportAuth");
const { transporter } = require("../services/email");

const router = express.Router();

// Set the databse conection to use the user DB
database.query("USE core", (err, result) => {
  if (err) throw err;
});

// Try to create a new user in the database, if email allreay reponse a error code
router.post("/", async (request, res) => {
  const { name, surname, email, password } = request.body;

  const isValid = !!name && !!surname && !!email && !!password;

  if (!isValid) {
    res.sendStatus(400);
    return;
  }

  try {
    const { insertId } = await query(
      `INSERT INTO users (name, surname, email, password) VALUES ('${name}', '${surname}', '${email}', '${password}')`
    );

    const token = jwt.sign({ id: insertId }, jwtOptions.secretOrKey);

    const url = `http://localhost:3030/confirmation/${token}`;

    transporter.sendMail({
      to: email,
      subject: "Trimo - Confirmação de email",
      html: `Por favor clique no link para desbloquear sua conta e acessar o trimo: <a href="${url}">${url}</a>`,
    });

    res.sendStatus(200);
    return;
  } catch (error) {
    res.sendStatus(400);
    return;
  }
});

module.exports = router;
