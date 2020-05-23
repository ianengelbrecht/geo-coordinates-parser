const convert = require('./converter')
const testFormats = require('./testformats')

let allPassed = true;

//find the first one that doesn't work
testFormats.some(t => {  //.some so we can break

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
      return true;
    }
    

    //check the verbatim coords are correct
    if(converted.verbatimLatitude != t.verbatimLatitude || converted.verbatimLongitude != t.verbatimLongitude) {
      console.log("Error in verbatim extraction")
      console.log(t.verbatimCoordinates)
      console.log(t.verbatimLatitude)
      console.log(t.verbatimLongitude)
      allPassed = false;
      return true
    }


  }
  catch(err) {
    console.log("Failed to convert the following format")
    console.log(t.verbatimCoordinates)
    console.log(err.message)
    allPassed = false;
    return true;
  }
  
})

if (allPassed) {
  console.log("all formats successfully converted")
}




