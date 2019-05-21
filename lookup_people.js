// Write a new script file in this same repo that expects to take in a single
//command line argument (through ARGV) and use it to find and output famous
//people by their first or last name.

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
  console.log("connected");
});


// Get the argument (name to lookup) from the command line
const getArguments = () => {
  const [node, path, lookupName] = process.argv;
  return { lookupName };
};


const displayPerson = personObj => {
  // console.log(`Found ${res.rowCount} person(s) by the name ${personObj}:`)
  console.log(
    `- ${personObj.id}: ${personObj.first_name} ${personObj.last_name}, born '${personObj.birthdate}'`
  );
};

// const displayPerson = personObj => {
//   console.log(`${personObj.id}- ${personObj.first_name} ${personObj.last_name}`);
// };

const renderPeople = peopleArr => {

  console.log(`Found ${peopleArr.length} person(s) by the name '${getArguments().lookupName}':`);

  for (const person of peopleArr) {
    displayPerson(person);
  }
};

const searchPerson = ({ searchName }) => {

  searchName = getArguments().lookupName;

  // Create the insert query to add to the database
  const query = {
    text: `SELECT * FROM famous_people WHERE first_name = '${searchName}' OR last_name = '${searchName}'`,
  };

  // Running the query with promises
  client
    .query(query)
    // Get the result of the insert Query
    .then(res =>

      renderPeople(res.rows)
    )

    // Catching any error
    .catch(err => console.log(err))
    // This always execute
    .finally(() => {
      console.log('query completed');
      // closing the connection
      client.end();
    });
};

searchPerson({});