const { query } = require("../services/database");

const getGroups = async ({ farm_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    const groups = await query(`SELECT * FROM tag_groups`);

    res.json({ msg: "ok", data: groups });
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const createTagGroup = async ({ farm_id, name }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(`INSERT INTO tag_groups (name) VALUES ('${name}')`);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const editTagGroup = async ({ farm_id, group_id, name }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(
      `UPDATE tag_groups SET name = '${name}' WHERE id = ${group_id}`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const deleteTagGroup = async ({ farm_id, group_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(`DELETE FROM tag_groups WHERE id = ${group_id}`);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

module.exports = { createTagGroup, editTagGroup, deleteTagGroup, getGroups };
