// Connect to DB
const { Client } = require("pg");
const DB_NAME = "linkerator";
const client = new Client(
  process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`
);

// database methods

const getAllLinks = async () => {
  try {
    const { rows } = await client.query(`SELECT * from links;`);
    return rows;
  } catch (error) {
    console.error(error);
  }
};

const createLink = async ({ name, count, comments, url }) => {
  try {
    const {
      rows: [links],
    } = await client.query(
      `INSERT INTO links(name,url, count, comments)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT(name, url) DO NOTHING
      RETURNING*;
      
      `,
      [name, count, comments, url]
    );
    return links;
  } catch (error) {
    console.error(error);
  }
};

async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }
  const insertValues = tagList.map((_, index) => `$${index + 1}`).join("), (");
  const selectValues = tagList.map((_, index) => `$${index + 1}`).join(", ");
  try {
    await client.query(
      `
      INSERT INTO tagname(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;
      `,
      tagList
    );
    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE tagname
      IN (${selectValues});
      `,
      tagList
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

const getLinkTags = async () => {
  try {
    const { rows } = await client.query(`

    SELECT * FROM links_tags
    
    
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
};

const getLinksWithTags = async () => {
  try {
    const { rows } = await client.query(`SELECT * FROM links`);
    const tags = await addTagsToLinks(rows);
    return tags;
  } catch (error) {
    console.error(error);
  }
};

const createTagForLink = async (linkTagsId, tagId) => {
  try {
    await client.query(
      `INSERT INTO links_tags("linkTagsId", "tagId") 
      VALUES ($1, $2)
      ON CONFLICT ("linkTagsId", "tagId")
      DO NOTHING`,
      [linkTagsId, tagId]
    );
  } catch (error) {
    console.error(error);
  }
};

const updateCount = async (linkId, count) => {
  try {
    await client.query(
      `UPDATE links 
    SET count = $1
    WHERE id = $2`,
      [++count, linkId]
    );
  } catch (error) {
    console.error(error);
  }
};

const addTagsToLinks = async (links) => {
  const linkId = links.map((link) => link.id);
  const selectedTags = links.map((_, i) => `$${i + 1}`).join(", ");

  const { rows: tags } = await client.query(
    `
  SELECT tags.*, links_tags.*
  FROM tags
  JOIN links_tags
  ON tags.id = links_tags."linkTagsId"
  WHERE links_tags."linkTagsId"
  IN (${selectedTags})
  
  
  `,
    linkId
  );

  links.forEach((link) => {
    link.tags = [];
    tags.forEach((tag) => {
      if (tag.linkTagsId === link.id) {
        link.tags.push(tag);
      }
    });
  });

  return links;
};

// export
module.exports = {
  client,
  getAllLinks,
  createLink,
  createTags,
  getLinkTags,
  getLinksWithTags,
  updateCount,
  addTagsToLinks,
  createTagForLink,

  // db methods
};
