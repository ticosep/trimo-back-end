const { query } = require("../database");

const getReports = async ({ farm_id }) => {
  try {
    await query(`USE farm_${farm_id}`);

    const reports = await query(`SELECT * FROM reports`);

    res.send(200).json({ reports });
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const createReport = async (
  { farm_id, tag_id, worker_id, latidute, longitude, accuracy },
  res
) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(
      `INSERT INTO reports (tag_id, worker_id, latidute, longitude, accuracy, timestamp) 
      VALUES (${tag_id}, ${worker_id}, ${latidute}, ${longitude}, ${accuracy}, ${timestamp})`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const deleteReport = async ({ farm_id, report_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(`DELETE FROM reports WHERE id = ${report_id}`);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

module.exports = { createReport, deleteReport, getReports };
