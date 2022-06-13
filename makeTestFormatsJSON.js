const fs = require('fs');
const testFormats = require('./testformats')

fs.writeFile("testFormats.json", JSON.stringify(testFormats, null, 2), 'utf8', function (err) {
  if (err) {
  console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
  }

  console.log("JSON file has been saved.");
});