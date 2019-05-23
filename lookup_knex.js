const config    = require('./knexfile');
const env       = 'development';
const knex      = require('knex')(config[env]);


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

  knex.select()
    .from('famous_people')
    .where({
      first_name: searchName
    })
    .orWhere({
      last_name: searchName
    })
    .then(res => renderPeople(res))
    .catch(err => console.log(err))
    // This always execute
    .finally(() => {
      console.log('query completed');
      // closing the connection
      knex.destroy();
    });
};

searchPerson({});