// code to build and initialize DB goes here
const {
  client,
  createLink,
  createTags,
  createTagForLink,
  getLinksWithTags,
  getAllLinks,

  // other db methods
} = require("./index");

async function buildTables() {
  client.connect();

  console.log("Dropping all tables..");

  try {
    await client.query(`
    DROP TABLE IF EXISTS link_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;`);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }

  console.log("Starting to build tables...");

  try {
    await client.query(`
    CREATE TABLE links (

      id SERIAL PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL,
      url varchar(255) UNIQUE NOT NULL,
      count INTEGER,
      comments varchar(255) NOT NULL,
      date DATE NOT NULL
  
    
      
    );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      tagname varchar(255) UNIQUE NOT NULL,



    );

    CREATE TABLE links_tags (
    id SERIAL PRIMARY KEY,
    "linkTagsId" REFERENCES links(id),
    "tagId" REFERENCES tags(id)


    );
    
    
    
    `);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  console.log("CREATING LINKS....");
  try {
    await createLink({
      name: "Github",
      url: "https://github.com",
      count: 1,
      comments: "Github is great!",
    });

    await createLink({
      name: "Twitter",
      url: "https://twitter.com",
      count: 3,
      comments: "Twitter is awesome",
    });

    await createLink({
      name: "Google",
      url: "https://google.com",
      count: 4,
      comments: "Google is the best search engine!",
    });

    console.log("Links created successfully");

    console.log("Creating tags....");

    await createTags({
      tagname: "version control",
    });
    await createTags({
      tagname: "social media",
    });

    await createTags({
      tagname: "search engine",
    });
    console.log("Tags created successfully");

    console.log("Creating links with tags....");
    await createTagForLink(1, 1);
    await createTagForLink(2, 2);
    await createTagForLink(3, 3);
    await createTagWithLink(4, 4);

    console.log("Tags with links created successfully");

    console.log("Add tags to links");

    const links = await getLinksWithTags();
  } catch (error) {
    throw error;
  }
}

// async function rebuildDB() {
//   try {
//     client.connect();
//     await dropTables();
//     await buildTables();
//     await populateInitialData();
//   } catch (error) {
//     console.log("ERROR DURING REBUILD DB");
//     throw error;
//   }
// }

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
