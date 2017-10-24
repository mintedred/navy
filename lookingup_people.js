const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  
  function findPerson(client, name, callback) {
    client.query(
      "SELECT * FROM famous_people WHERE last_name= $1;",
      [name],
      (err, result) => {
        if (err) {
          callback(err)
          return;
        }
        callback(null, result.rows);
      }
    );
  }
  
  findPerson(client, process.argv[2], (err, result) => {
    if (err) console.error(err);
    console.log("'Searching...");
    console.log("Found 1 person by the name '" + process.argv[2] + "':");
    console.log(`-${result[0].id}: ${result[0].first_name} ${result[0].last_name}, born '${result[0].birthdate}' `);

  });

  setTimeout(() => {client.end()}, 2000) 
})