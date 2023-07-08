'use strict';

/** DB access module **/

const sqlite = require('sqlite3');

// open the database
const database = new sqlite.Database('planesDB.sqlite', (err) => {
  if (err) throw err;
  else  {
    console.log('Connected to the SQlite database.');  }
});

module.exports = { database };
