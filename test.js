const convert = require('./converter')
const testFormats = require('./testformats')
const failingFormats = require('./failFormats')

let allPassed = true;

//FORMATS THAT SHOULD BE CONVERTED
for (const t of testFormats) {
  try {
    var converted = convert(t.verbatimCoordinates, 8)

    var testDecimalCoordsString = `${t.decimalLatitude},${t.decimalLongitude}`
    
    //check the calculation is correct
    if(!converted.closeEnough(testDecimalCoordsString)) {
      console.log("Error in decimal conversion")
      console.log(t.verbatimCoordinates)
      console.log(t.decimalLatitude)
      console.log(t.decimalLongitude)
      allPassed = false;
    }
    

    //check the verbatim coords are correct
    if(converted.verbatimLatitude != t.verbatimLatitude || converted.verbatimLongitude != t.verbatimLongitude) {
      console.log("Error in verbatim extraction")
      console.log('For', t.verbatimCoordinates)
      console.log('got', converted.verbatimLatitude, 'should be ', t.verbatimLatitude)
      console.log('got', converted.verbatimLongitude, 'should be', t.verbatimLongitude)
      allPassed = false;
    }

  }
  catch(err) {
    console.log("Failed to convert the following format")
    console.log(t.verbatimCoordinates)
    console.log(err.message)
    allPassed = false;
  }
}


//FORMATS THAT SHOULD NOT BE CONVERTED
const converting = []
for (const f of failingFormats) {
  try {
    let converted = convert(f)
    converting.push(f)
    allPassed = false
  }
  catch {
    //nothing here
  }
}

if(converting.length) {
  console.log("The following coordinates should NOT have converted successfully: " + converting.join(' | '))
}

if (allPassed) {
  console.log("all formats successfully converted")
}




