// code to build and initialize DB goes here
const { client, createLink } = require("./index");

async function buildTables() {
  client.connect();

  console.log("Dropping all tables..");

  try {
    await client.query(`
    DROP TABLE IF EXISTS links_tags;
    DROP TABLE IF EXISTS links;
    DROP TABLE IF EXISTS tags;`);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }

  console.log("Starting to build tables...");

  try {
    console.log("TRY BLOCK");
    await client.query(`
    CREATE TABLE links (

      id SERIAL PRIMARY KEY,
      name varchar(255) NOT NULL,
      url varchar(255) NOT NULL,
      count INTEGER DEFAULT 0,
      comments varchar(255) NOT NULL,
      date DATE DEFAULT CURRENT_DATE,
      UNIQUE(name, url)
  
    
      
    );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      tagname varchar(255) UNIQUE NOT NULL



    );

    CREATE TABLE links_tags (
    id SERIAL PRIMARY KEY,
    "linkId" SERIAL REFERENCES links(id),
    "tagId" SERIAL REFERENCES tags(id),
    UNIQUE("linkId", "tagId")

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
      comments: "Github is great!",
      tags: ["version", "control"],
    });

    await createLink({
      name: "Twitter",
      url: "https://twitter.com",
      comments: "Twitter is awesome",
      tags: ["social", "media"],
    });

    await createLink({
      name: "Google",
      url: "https://google.com",
      comments: "Google is the best search engine!",
      tags: ["search", "engine"],
    });

    console.log("Links created successfully");
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
