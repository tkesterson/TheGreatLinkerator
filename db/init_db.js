// code to build and initialize DB goes here
const {
  client
  // other db methods 
} = require('./index');

async function buildTables() {
  try {

    client.connect();
    console.log()
    await client.query(`
    DROP TABLE IF EXISTS link_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;`
    )
    

    // drop tables in correct order

    // build tables in correct order

    await client.query(`
    CREATE TABLE links (

      id SERIAL PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL,
      count INTEGER,
      comments varchar(255) NOT NULL,
      date DATE NOT NULL,
      url varchar(255) UNIQUE NOT NULL,
    
      
    );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL,



    );

    CREATE TABLE links_tags (
    id SERIAL PRIMARY KEY,
    "linkTagsId" REFERENCES links(id),
    "tagId" REFERENCES tags(id)


    );
    
    
    
    `)

  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());