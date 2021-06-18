// Connect to DB
const { Client } = require("pg");
const DB_NAME = "linkerator";
const client = new Client(
  process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`
);

// database methods

const getAllLinks = async () => {
  try {
    const { rows: linkIds } = await client.query(`
      SELECT id
      FROM links;
    `);
    console.log(linkIds);
    const links = await Promise.all(
      linkIds.map((link) => getLinkById(link.id))
    );

    return links;
  } catch (error) {
    throw error;
  }
};
async function getLinkById(linkId) {
  try {
    const {
      rows: [link],
    } = await client.query(
      `
      SELECT *
      FROM links
      WHERE id=$1;
    `,
      [linkId]
    );

    if (!link) {
      throw {
        name: "linkNotFoundError",
        message: "Could not find a link with that linkId",
      };
    }

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN links_tags ON tags.id=links_tags."tagId"
      WHERE links_tags."linkId"=$1;
    `,
      [linkId]
    );

    link.tags = tags;

    return link;
  } catch (error) {
    throw error;
  }
}
const createLink = async ({ name, url, comments, tags = [] }) => {
  try {
    const {
      rows: [link],
    } = await client.query(
      `INSERT INTO links(name, url, comments)
      VALUES ($1, $2, $3)
      ON CONFLICT(name, url) DO NOTHING
      RETURNING*;
      
      `,
      [name, url, comments]
    );

    const tagList = await createTags(tags);

    await Promise.all(
      tagList.map((tag) => {
        return createLinkTags(link.id, tag.id);
      })
    );

    link.tags = tagList;

    return link;
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
      INSERT INTO tags (tagname)
      VALUES (${insertValues})
      ON CONFLICT (tagname) DO NOTHING;
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

const createLinkTags = async (linkId, tagId) => {
  try {
    await client.query(
      `INSERT INTO links_tags("linkId", "tagId") 
      VALUES ($1, $2)
      ON CONFLICT ("linkId", "tagId")
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
    return getLinkById(linkId);
  } catch (error) {
    console.error(error);
  }
};

// const addTagsToLinks = async (links) => {
//   const linkId = links.map((link) => link.id);
//   const selectedTags = links.map((_, i) => `$${i + 1}`).join(", ");

//   const { rows: tags } = await client.query(
//     `
//   SELECT tags.*, links_tags.*
//   FROM tags
//   JOIN links_tags
//   ON tags.id = links_tags."linkId"
//   WHERE links_tags."linkId"
//   IN (${selectedTags})

//   `,
//     linkId
//   );

//   links.forEach((link) => {
//     link.tags = [];
//     tags.forEach((tag) => {
//       if (tag.linkId === link.id) {
//         link.tags.push(tag);
//       }
//     });
//   });

//   return links;
// };
// const getLinkTags = async () => {
//   try {
//     const { rows } = await client.query(`

//     SELECT * FROM links_tags

//     `);

//     return rows;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const getLinksWithTags = async () => {
//   try {
//     const { rows } = await client.query(`SELECT * FROM links`);
//     const tags = await addTagsToLinks(rows);
//     return tags;
//   } catch (error) {
//     console.error(error);
//   }
// };
// export
module.exports = {
  client,
  createLink,
  updateCount,
  getAllLinks,
};
