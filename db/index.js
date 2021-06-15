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
  const date = Date.now();
  try {
    const {
      rows: [links],
    } = await client.query(
      `INSERT INTO links(name, count, comments, url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
      RETURNING*;
      
      `,
      [name, count, comments, url]
    );
    return links;
  } catch (error) {
    console.error(error);
  }
};

const createTags = async (tagname) => {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO
    tags(tagname)
    VALUES($1)
    RETURNING*;
    
    
    `,
      [tagname]
    );

    return rows;
  } catch (error) {
    console.error(error);
  }
};

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

const createTagForLink = async (linkId, tagId) => {
  try {
    await client.query(
      `INSERT INTO links_tags("linkId", "tagId") 
      VALUES ($1, $2)
      ON CONFLICT (linkId, tagId)
      DO NOTHING`,
      [linkId, tagId]
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
  SELECT tags.*, links_tags.*,
  FROM tags
  JOIN links_tags
  ON tags.id = links_tags."linkId"
  WHERE links_tags."linkId"
  IN (${selectedTags})
  
  
  `,
    linkId
  );

  links.forEach((link) => {
    link.tags = [];
    tags.forEach((tag) => {
      if (tag.linkId === link.id) {
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
