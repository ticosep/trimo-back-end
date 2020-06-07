const { query } = require("../database");

const getNewFarmDatabaseSQL = (farmId, user_name, user_surname, user_id) => {
  return `CREATE DATABASE farm_${farmId};
  USE farm_${farmId};
  CREATE TABLE workers (
    id int(11) NOT NULL auto_increment,
    type int(11) NOT NULL,
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    appkey varchar(100) NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE owners (
    id int(11) NOT NULL auto_increment,
    app_id int(11) NOT NULL,
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE reports (
    id int(11) NOT NULL auto_increment,
    tag_id int(11) NOT NULL,
    worker_id int(11) NOT NULL,
    latidute int(11) NOT NULL,
    longitude int(11) NOT NULL,
    accuracy int(11) NOT NULL,
    timestamp int(11) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE tag_groups (
    id int(11) NOT NULL auto_increment,
    name varchar(100) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE tags (
    id int(11) NOT NULL auto_increment,
    tag_group_id int(11) NOT NULL,
    name varchar(100) NOT NULL,
    color varchar(100) NOT NULL,
    tag_desc varchar(100) NOT NULL,
    custom_data varchar(100) NULL,
    PRIMARY KEY (id)
  );

  INSERT INTO owners (app_id, name, surname) VALUES (${user_id}, '${user_name}', '${user_surname}');
  `;
};

const createFarm = async (
  { name, production, user_id, user_name, user_surname },
  res
) => {
  try {
    const { insertId } = await query(
      `INSERT INTO farms (name, production) VALUES ('${name}', '${production}')`
    );

    await query(
      `INSERT INTO farm_users (farm, user_id) VALUES ('${insertId}', '${user_id}')`
    );

    const SQL = getNewFarmDatabaseSQL(
      insertId,
      user_name,
      user_surname,
      user_id
    );

    await query(SQL);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const setMapFeatures = async ({ farm_id, map_features }, res) => {
  try {
    await query("USE user");

    await query(
      `UPDATE map_features SET map_features = '${map_features}' WHERE id = ${+farm_id}`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const getMapFeatures = async ({ farm_id }, res) => {
  try {
    await query("USE user");

    const features = await query(`SELECT map_features WHERE id = ${farm_id}`);

    res.status(200).json({ features });
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

module.exports = { createFarm, getMapFeatures, setMapFeatures };
