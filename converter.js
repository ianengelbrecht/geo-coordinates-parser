//function for converting coordinates from a string to decimal and verbatim

const toCoordinateFormat = require('./toCoordinateFormat.js')

/**
 * Function for converting coordinates in a variety of formats to decimal coordinates
 * @param {string} coordsString The coordinates string to convert
 * @param {number} decimalPlaces The number of decimal places for converted coordinates; default is 5
 * @returns {object} { verbatimCoordinates, decimalCoordinates, decimalLatitude, decimalLongitude }
 */
function converter(coordsString, decimalPlaces) {

  //TODO add exact match to entered string, so that it can be used to filter out superflous text around it
  if(!decimalPlaces) {
    decimalPlaces = 5
  }

  coordsString = coordsString.replace(/\s\s+/g, ' ').trim(); //just to tidy up whitespaces

  var ddLat = null;
  var ddLng = null; 
  var latdir = "";
  var lngdir = "";
  var match = [];	
  var matchSuccess = false;

  if (dd_re.test(coordsString)){
    match = dd_re.exec(coordsString);
    matchSuccess = checkMatch(match);
    if (matchSuccess){
      ddLat = match[2];
      ddLng = match[6];
      
      //need to fix if there are ','s instead of '.'
      if(ddLat.includes(',')) {
        ddLat = ddLat.replace(',','.');
      }
      if(ddLng.includes(',')) {
        ddLng = ddLng.replace(',', '.');
      }

      //validation, we don't want things like 23.00000

      //some more validation: no zero coords or degrees only
      if (Number(Math.round(ddLat)) == Number(ddLat)) {
        throw new Error('degree only coordinate provided')
      }

      if (Number(Math.round(ddLng)) == Number(ddLng)) {
        throw new Error('degree only coordinate provided')
      }
      
      //get directions
      if(match[1]) {
        latdir = match[1];
        lngdir = match[5];
      } 
      else if (match[4]) {
        latdir = match[4];
        lngdir = match[8];
      }

    }
    else {
      throw new Error("invalid decimal coordinate format")		
    }
    
  }
  else if (dms_periods.test(coordsString)) {
    match = dms_periods.exec(coordsString);
    matchSuccess = checkMatch(match);
    if (matchSuccess){

      ddLat = Math.abs(parseInt(match[2]));

      if (match[4]) {
        ddLat += match[4]/60;
      }
        
      if (match[6]){
        ddLat += match[6].replace(',', '.')/3600;
      }
  
      if (parseInt(match[2]) < 0) {
        ddLat = -1 * ddLat;
      }
        
      ddLng = Math.abs(parseInt(match[9]));

      if (match[11]) {
        ddLng += match[11]/60;
      }
        
      if (match[13]) {
        ddLng += match[13].replace(',', '.')/3600;
      }
        
      if (parseInt(match[9]) < 0) {
        ddLng = -1 * ddLng;
      }
        
      //the compass directions
      if(match[1]) {
        latdir = match[1];
        lngdir = match[8];
      } 
      else if (match[7]) {
        latdir = match[7];
        lngdir = match[14];
      }
      else { //we have to catch an edge case where we have no direction indicators
        throw new Error("invalid DMS coordinates format")	
      }

      //we have to catch another edge case here, same or missing direction indicators
      if(!latdir || !lngdir) {
        throw new Error("invalid DMS coordinates format")	
      }

    }
    else {
      throw new Error("invalid DMS coordinates format")
    }
  }
  else if (dms_abbr.test(coordsString)) {
    match = dms_abbr.exec(coordsString);
    matchSuccess = checkMatch(match);

    if (matchSuccess) {
      ddLat = Math.abs(parseInt(match[2]));
      if (match[4]) {
        ddLat += match[4]/60;
        if(!match[3]) {
          match[3] = ' ';
        }
      }

      if (match[6]) {
        ddLat += match[6]/3600;
        if(!match[5]) {
          match[5] = ' ';
        }
      }

      if (parseInt(match[2]) < 0) {
        ddLat = -1 * ddLat;
      }
        
      ddLng = Math.abs(parseInt(match[10]));

      if (match[12]) {
        ddLng += match[12]/60;
        if(!match[11]) {
          match[11] = ' ';
        }
      }

      if (match[14]) {
        ddLng += match[14]/3600;
        if(!match[13]) {
          match[13] = ' ';
        }
      }

      if (parseInt(match[10]) < 0) {
        ddLng = -1 * ddLng;
      }
        
      if(match[1]) {
        latdir = match[1];
        lngdir = match[9];
      } 
      else if (match[8]) {
        latdir = match[8];
        lngdir = match[16];
      }

    }
    else {
      throw new Error("invalid DMS coordinates format")				
    }
  }
  else if (coords_other.test(coordsString)) {
    match = coords_other.exec(coordsString);
    matchSuccess = checkMatch(match);

    if (matchSuccess) {
      ddLat = Math.abs(parseInt(match[2]));
      if (match[4]){
        ddLat += match[4]/60;
        if(!match[3]) {
          match[3] = ' ';
        }
      }

      if (match[6]) {
        ddLat += match[6]/3600;
        if(!match[5]) {
          match[5] = ' ';
        }
      }

      if (parseInt(match[2]) < 0) {
        ddLat = -1 * ddLat;
      }
        
      ddLng = Math.abs(parseInt(match[10]));
      if (match[12]) {
        ddLng += match[12]/60;
        if(!match[11]) {
          match[11] = ' ';
        }
      }

      if (match[14]) {
        ddLng += match[14]/3600;
        if(!match[13]) {
          match[13] = ' ';
        }
      }

      if (parseInt(match[10]) < 0) {
        ddLng = -1 * ddLng;
      }
        
      if(match[1]) {
        latdir = match[1];
        lngdir = match[9];
      } else if (match[8]) {
        latdir = match[8];
        lngdir = match[16];
      }

    }
    else {
      throw new Error("invalid coordinates format")				
    }
  }

  //check longitude value - it can be wrong!
  if (Math.abs(ddLng) >= 180) {
    throw new Error("invalid longitude value")				
  }

  //just to be safe check latitude also...
  if (Math.abs(ddLat) >= 90) {
    throw new Error("invalid latitude value")				
  }
  
  if (matchSuccess){
    
    //make sure the signs and cardinal directions match
    var patt = /S|SOUTH/i;
    if (patt.test(latdir)) {
      if (ddLat > 0) {
        ddLat = -1 * ddLat;
      }
    }
        
    patt = /W|WEST/i;
    if (patt.test(lngdir)){
      if (ddLng > 0) {
        ddLng = -1 * ddLng;
      }
    }


    //we need to get the verbatim coords from the string
    //we can't split down the middle because if there are decimals they may have different numbers on each side
    //so we need to find the separating character, or if none, use the match values to split down the middle
    var verbatimCoordinates = match[0].trim()
    var verbatimLat
    var verbatimLng

    var sepChars = /[,/;\u0020]/g //comma, forward slash and spacebar
    var seps = verbatimCoordinates.match(sepChars)

    if (seps == null) {
      //split down the middle
      var middle = Math.floor(coordsString.length/2)
      verbatimLat = verbatimCoordinates.substring(0, middle).trim()
      verbatimLng = verbatimCoordinates.substring(middle).trim()
    }
    else { //if length is odd then find the index of the middle value
      
      //get the middle index
      var middle
      //easy for odd numbers
      if (seps.length % 2 == 1) {
        middle = Math.floor(seps.length / 2) 
      }
      else {
        middle = (seps.length / 2) - 1
      }

      //walk through seps until we get to the middle
      var splitIndex = 0;
      
      //it might be only one value
      if (middle == 0){
        splitIndex = verbatimCoordinates.indexOf(seps[0])
        verbatimLat = verbatimCoordinates.substring(0, splitIndex).trim()
        verbatimLng = verbatimCoordinates.substring(splitIndex + 1).trim()
      }
      else {
        var currSepIndex = 0
        var startSearchIndex = 0
        while (currSepIndex <= middle){
          splitIndex = verbatimCoordinates.indexOf(seps[currSepIndex], startSearchIndex)
          startSearchIndex = splitIndex + 1
          currSepIndex++
        }

        verbatimLat = verbatimCoordinates.substring(0, splitIndex).trim()
        verbatimLng = verbatimCoordinates.substring(splitIndex + 1).trim()

      }

    }
    
    if(isNaN(ddLat) && ddLat.includes(',')) {
      ddLat = ddLat.replace(',', '.')
    }

    //all done!!
    //just truncate the decimals appropriately
    ddLat = Number(Number(ddLat).toFixed(decimalPlaces))

    if(isNaN(ddLng) && ddLng.includes(',')) {
      ddLng = ddLng.replace(',', '.')
    }

    ddLng = Number(Number(ddLng).toFixed(decimalPlaces))

    return Object.freeze({
      verbatimCoordinates, 
      verbatimLatitude: verbatimLat,
      verbatimLongitude: verbatimLng,
      decimalLatitude:  ddLat,
      decimalLongitude: ddLng,
      decimalCoordinates: `${ddLat},${ddLng}`,
      closeEnough: coordsCloseEnough,
      toCoordinateFormat
    })
  }
  else {
    throw new Error("coordinates pattern match failed")
  }

}

function checkMatch(match) { //test if the matched groups arrays are 'balanced'. match is the resulting array
  
  if(!isNaN(match[0])){ //we've matched a number, not what we want....
    return false
  }

  //first remove the empty values from the array
  var filteredMatch = match.filter(x=>x);
  
  //we need to shift the array because it contains the whole coordinates string in the first item
  filteredMatch.shift();
  
  //check the array length is an even number else exit
  if (filteredMatch.length % 2 > 0) {
    return false;
  }

  //regex for testing corresponding values match
  var numerictest = /^[-+]?\d+([\.,]{1}\d+)?$/; //for testing numeric values
  var stringtest = /[eastsouthnorthwest]+/i; //for testing string values (north, south, etc)
  
  
  var halflen = filteredMatch.length/2;
  for (var i = 0; i < halflen; i++) {
    const leftside = filteredMatch[i]
    const rightside = filteredMatch[i + halflen]
    if ((numerictest.test(leftside) && numerictest.test(rightside)) || (stringtest.test(leftside) && stringtest.test(rightside)) || leftside == rightside) {
      continue;
    }
    else {
      return false
    }
  }
  
  return true;
  
}

//functions for coordinate validation

//as decimal arithmetic is not straightforward, we approximate
function decimalsCloseEnough(dec1, dec2){
  var originaldiff = Math.abs(dec1 - dec2)
  diff = Number(originaldiff.toFixed(6))
  if (diff <= 0.00001){
    return true
  }
  else {
    return false
  }
}

function coordsCloseEnough(coordsToTest) {
  if (coordsToTest.includes(',')){
    var coords = coordsToTest.split(',')
    if(Number(coords[0]) == NaN || Number(coords[1]) == NaN) {
      throw new Error("coords are not valid decimals")
    }
    else {
      return decimalsCloseEnough(this.decimalLatitude, Number(coords[0])) && decimalsCloseEnough(this.decimalLongitude, coords[1]) //this here will be the converted coordinates object
    }
  }
  else {
    throw new Error("coords being tested must be separated by a comma")
  }
}

//Coordinates pattern matching regex

//decimal degrees
var dd_re = /(NORTH|SOUTH|[NS])?[\s]*([+-]?[0-8]?[0-9](?:[\.,]\d{3,}))[\s]*([•º°]?)[\s]*(NORTH|SOUTH|[NS])?[\s]*[,/;]?[\s]*(EAST|WEST|[EW])?[\s]*([+-]?[0-1]?[0-9]?[0-9](?:[\.,]\d{3,}))[\s]*([•º°]?)[\s]*(EAST|WEST|[EW])?/i;

//degrees minutes seconds with '.' as separator - gives array with 15 values
var dms_periods = /(NORTH|SOUTH|[NS])?\s*([+-]?[0-8]?[0-9])\s*(\.)\s*([0-5]?[0-9])\s*(\.)?\s*((?:[0-5]?[0-9])(?:[\.,]{1}\d{1,3})?)?\s*(NORTH|SOUTH|[NS])?(?:\s*[,/;]\s*|\s*)(EAST|WEST|[EW])?\s*([+-]?[0-1]?[0-9]?[0-9])\s*(\.)\s*([0-5]?[0-9])\s*(\.)?\s*((?:[0-5]?[0-9])(?:[\.,]\d{1,3})?)?\s*(EAST|WEST|[EW])?/i;

//degrees minutes seconds with words 'degrees, minutes, seconds' as separators (needed because the s of seconds messes with the S of SOUTH) - gives array of 17 values
var dms_abbr = /(NORTH|SOUTH|[NS])?[\ \t]*([+-]?[0-8]?[0-9])[\ \t]*(D(?:EG)?(?:REES)?)[\ \t]*([0-5]?[0-9])[\ \t]*(M(?:IN)?(?:UTES)?)[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(S(?:EC)?(?:ONDS)?)?[\ \t]*(NORTH|SOUTH|[NS])?(?:[\ \t]*[,/;][\ \t]*|[\ \t]*)(EAST|WEST|[EW])?[\ \t]*([+-]?[0-1]?[0-9]?[0-9])[\ \t]*(D(?:EG)?(?:REES)?)[\ \t]*([0-5]?[0-9])[\ \t]*(M(?:IN)?(?:UTES)?)[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(S(?:EC)?(?:ONDS)?)[\ \t]*(EAST|WEST|[EW])?/i;

//everything else - gives array of 17 values 
var coords_other = /(NORTH|SOUTH|[NS])?[\ \t]*([+-]?[0-8]?[0-9])[\ \t]*([•º°\.:]|D(?:EG)?(?:REES)?)?[\ \t]*,?([0-5]?[0-9](?:\.\d{1,})?)?[\ \t]*(['′´’\.:]|M(?:IN)?(?:UTES)?)?[\ \t]*,?((?:[0-5]?[0-9])(?:\.\d{1,3})?)?[\ \t]*(''|′′|’’|´´|["″”\.])?[\ \t]*(NORTH|SOUTH|[NS])?(?:\s*[,/;]\s*|\s*)(EAST|WEST|[EW])?[\ \t]*([+-]?[0-1]?[0-9]?[0-9])[\ \t]*([•º°\.:]|D(?:EG)?(?:REES)?)?[\ \t]*,?([0-5]?[0-9](?:\.\d{1,})?)?[\ \t]*(['′´’\.:]|M(?:IN)?(?:UTES)?)?[\ \t]*,?((?:[0-5]?[0-9])(?:\.\d{1,3})?)?[\ \t]*(''|′′|´´|’’|["″”\.])?[\ \t]*(EAST|WEST|[EW])?/i;

const to = Object.freeze({
  DMS: 'DMS',
  DM: 'DM'
})

converter.to = to

module.exports = converter
