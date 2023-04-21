import fs from 'fs'
import testFormats from './testformats.js'

fs.writeFile("testFormats.json", JSON.stringify(testFormats, null, 2), 'utf8', function (err) {
  if (err) {
  console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
  }

  console.log("JSON file has been saved.");
});