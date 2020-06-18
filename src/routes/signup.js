const { database, query } = require("../services/database");
const express = require("express");
const { jwt, jwtOptions } = require("../services/passportAuth");
const { transporter } = require("../services/email");

const router = express.Router();

const sendValidationEmail = ({ id, email }) => {
  const token = jwt.sign({ id }, jwtOptions.secretOrKey);

  const url = `http://localhost:3030/confirmation/${token}`;

  transporter.sendMail({
    to: email,
    subject: "Trimo - Confirmação de email",
    html: `Por favor clique no link para desbloquear sua conta e acessar o trimo: <a href="${url}">${url}</a>`,
  });
};

router.post("/validate", async (request, res) => {
  const { id, email } = request.body;

  const isValid = !!id && !!email;

  if (!isValid) {
    res.sendStatus(400);
    return;
  }

  try {
    sendValidationEmail({ id, email });

    res.sendStatus(200);
    return;
  } catch (error) {
    res.sendStatus(400);
    return;
  }
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
    await query("USE core");

    const { insertId } = await query(
      `INSERT INTO users (name, surname, email, password) VALUES ('${name}', '${surname}', '${email}', '${password}')`
    );

    sendValidationEmail({ id: insertId, email });

    res.sendStatus(200);
    return;
  } catch (error) {
    res.sendStatus(400);
    return;
  }
});

module.exports = router;
