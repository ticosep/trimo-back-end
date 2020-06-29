const { query } = require("../services/database");

const getTags = async ({ farm_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    const tags = await query(`SELECT tag_groups.id, tag_groups.name, 
    JSON_ARRAYAGG(
      JSON_OBJECT(
          'name', tags.name,
          'id', tags.id,
          'color', tags.color,
          'tag_desc', tags.tag_desc,
          'custom_data', tags.custom_data
      )) 
    AS tags_in_group
    FROM tag_groups
    JOIN tags ON tags.tag_group_id = tag_groups.id
    GROUP BY tags.tag_group_id`);

    res.json({ msg: "ok", data: tags });
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const createTag = async (
  { farm_id, group_id, color, tag_desc, custom_data = "", name },
  res
) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(
      `INSERT INTO tags (name, tag_group_id, color, tag_desc, custom_data) 
      VALUES ('${name}', ${group_id}, '${color}', '${tag_desc}', '${custom_data}')`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const editTag = async (
  { farm_id, tag_id, group_id, color, tag_desc, custom_data = "", name },
  res
) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(
      `UPDATE tags SET name = '${name}', tag_group_id = ${group_id}, color = '${color}', tag_desc = '${tag_desc}',
         custom_data = '${custom_data}'
         WHERE id = ${tag_id}`
    );

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

const deleteTag = async ({ farm_id, tag_id }, res) => {
  try {
    await query(`USE farm_${farm_id}`);

    await query(`DELETE FROM tags WHERE id = ${tag_id}`);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(401).json({ error });
    return;
  }
};

module.exports = { createTag, editTag, deleteTag, getTags };
