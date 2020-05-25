const { query } = require("../database");

const getNewFarmDatabaseSQL = (farmId) => {
  return `CREATE DATABASE farm_${farmId};
  USE farm_${farmId};
  CREATE TABLE workers (
    id int(11) NOT NULL auto_increment,
    type int(11) NOT NULL,
    name varchar(100) NOT NULL,
    surname varchar(100) NOT NULL,
    appkey varchar(100) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE reports (
    id int(11) NOT NULL auto_increment,
    plague_id int(11) NOT NULL,
    group_id int(11) NOT NULL,
    worker_id int(11) NOT NULL,
    latidute int(11) NOT NULL,
    longitude int(11) NOT NULL,
    accuracy int(11) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE plage_groups (
    id int(11) NOT NULL auto_increment,
    name varchar(100) NOT NULL,
    PRIMARY KEY (id)
  );
  CREATE TABLE plages (
    id int(11) NOT NULL auto_increment,
    group_id int(11) NOT NULL,
    name varchar(100) NOT NULL,
    color varchar(100) NOT NULL,
    plague_desc varchar(100) NOT NULL,
    PRIMARY KEY (id)
  );
  `;
};

const createFarm = async ({ name, production, user_id }, res) => {
  try {
    const { insertId } = await query(
      `INSERT INTO farms (name, production) VALUES ('${name}', '${production}')`
    );

    await query(
      `INSERT INTO farm_users (farm, user_id) VALUES ('${insertId}', '${user_id}')`
    );

    const SQL = getNewFarmDatabaseSQL(insertId);

    await query(SQL);

    res.sendStatus(200);
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = { createFarm };
