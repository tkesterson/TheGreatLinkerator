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

  console.log('CREATING LINKS....')
  try {
    const linksToCreate = [
      {
        name: YouTube,
        count: 1,
        comments: 'This Youtube video is great',
        date: '2021-06-01',
        url: 'https://www.youtube.com'
      },
      {
        name: Twitter,
        count: 6,
        comments: 'Twitter is an amazing resource',
        date: '2021-06-02',
        url: 'https://twitter.com'

      },
      
      {
        name: Github,
        count: 4,
        comments: 'Github is the best verison control platform',
        date: '2021-06-8',
        url: 'https://github.com'
      }

    ]
    
   
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());