const { query } = require("../database");
const { getAppCode } = require("../crypto");

const createWorker = async ({ farm_id, type, name, surname }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    const { insertId } = await query(
      `INSERT INTO workers (type, name, surname) VALUES (${type}, '${name}', '${surname}')`
    );

    const appcode = getAppCode(farm_id, insertId, type);

    await query(
      `UPDATE workers SET appkey = '${appcode}' WHERE id = ${insertId}`
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = { createWorker };
