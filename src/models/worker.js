const { query } = require("../database");
const { getAppCode } = require("../crypto");

const createWorker = async ({ farm_id, type, name, surname }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    const { insertId } = await query(
      `INSERT INTO workers (type, name, surname) VALUES (${type}, '${name}', '${surname}')`
    );

    const appcode = getAppCode(farm_id, insertId);

    await query(
      `UPDATE workers SET appkey = '${appcode}' WHERE id = ${insertId}`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const editWorker = async ({ farm_id, worker_id, type, name, surname }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(
      `UPDATE workers SET name = '${name}', surname = '${surname}', type = ${+type} WHERE id = ${worker_id}`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const deleteWorker = async ({ farm_id, worker_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(`DELETE FROM workers WHERE id = ${worker_id}`);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

module.exports = { createWorker, editWorker, deleteWorker };
