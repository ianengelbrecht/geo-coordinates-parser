//function for converting coordinates from a string to decimal and verbatim
function converter(coordsString) {

  coordsString = coordsString.replace(/\s\s+/g, ' '); //just to tidy up whitespaces

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
        ddLat.replace(',','.');
      }
      if(ddLng.includes(',')) {
        ddLng.replace(',', '.');
      }
      //
      if(match[1]){
        latdir = match[1];
        lngdir = match[5];
      } else if (match[4]){
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
      if (match[4])
        ddLat += match[4]/60;
      if (match[6])
        ddLat += match[6]/3600;
      if (parseInt(match[2]) < 0) //needed to 
        ddLat = -1 * ddLat;
      ddLng = Math.abs(parseInt(match[9]));
      if (match[11])
        ddLng += match[11]/60;
      if (match[13])
        ddLng += match[13]/3600;
      if (parseInt(match[9]) < 0) //needed to 
        ddLng = -1 * ddLng;
      
      if(match[1]){
        latdir = match[1];
        lngdir = match[8];
      } else if (match[7]){
        latdir = match[7];
        lngdir = match[14];
      }

    }
    else {
      throw new Error("invalid DMS coordinates format")				
    }
  }
  else if (dms_abbr.test(coordsString)) {
    match = dms_abbr.exec(coordsString);
    matchSuccess = checkMatch(match);
    if (matchSuccess){
      ddLat = Math.abs(parseInt(match[2]));
      if (match[4]){
        ddLat += match[4]/60;
        if(!match[3])
          match[3] = ' ';
      }
      if (match[6]) {
        ddLat += match[6]/3600;
        if(!match[5])
          match[5] = ' ';
      }
      if (parseInt(match[2]) < 0) 
        ddLat = -1 * ddLat;
      ddLng = Math.abs(parseInt(match[10]));
      if (match[12]){
        ddLng += match[12]/60;
        if(!match[11])
          match[11] = ' ';
      }
      if (match[14]){
        ddLng += match[14]/3600;
        if(!match[13])
          match[13] = ' ';
      }
      if (parseInt(match[10]) < 0)  
        ddLng = -1 * ddLng;
        
      if(match[1]){
        latdir = match[1];
        lngdir = match[9];
      } else if (match[8]){
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
    if (matchSuccess){
      ddLat = Math.abs(parseInt(match[2]));
      if (match[4]){
        ddLat += match[4]/60;
        if(!match[3])
          match[3] = ' ';
      }
      if (match[6]) {
        ddLat += match[6]/3600;
        if(!match[5])
          match[5] = ' ';
      }
      if (parseInt(match[2]) < 0) 
        ddLat = -1 * ddLat;
        
      ddLng = Math.abs(parseInt(match[10]));
      if (match[12]){
        ddLng += match[12]/60;
        if(!match[11])
          match[11] = ' ';
      }
      if (match[14]){
        ddLng += match[14]/3600;
        if(!match[13])
          match[13] = ' ';
      }
      if (parseInt(match[10]) < 0) 
        ddLng = -1 * ddLng;
      
      if(match[1]){
        latdir = match[1];
        lngdir = match[9];
      } else if (match[8]){
        latdir = match[8];
        lngdir = match[16];
      }

    }
    else {
      throw new Error("invalid coordinates format")				
    }
  }

  //check longitude value - it can be wrong!
  if (Math.abs(ddLng) >=180) {
    throw new Error("invalid longitude value")				
  }
  
  if (matchSuccess){
    
    //make sure the signs and cardinal directions match
    var patt = /S|SOUTH/i;
    if (patt.test(latdir))
      if (ddLat > 0)
        ddLat = -1 * ddLat;
        
    patt = /W|WEST/i;
    if (patt.test(lngdir))
      if (ddLng > 0)
        ddLng = -1 * ddLng;


    //we need to get the verbatim coords from the string
    //we can't split down the middle because if there are decimals they may have different numbers on each side
    //so we need to find the separating character, or if none, use the match values to split down the middle
    var verbatimLat
    var verbatimLng

    var sepChars = /[,/\u0020]/g //comma, forward slash and spacebar
    var seps = coordsString.match(sepChars)

    if (seps == null) {
      //split down the middle
      var middle = Math.floor(coordsString.length/2)
      verbatimLat = coordsString.substring(0, middle).trim()
      verbatimLng = coordsString.substring(middle).trim()
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
        splitIndex = coordsString.indexOf(seps[0])
        verbatimLat = coordsString.substring(0, splitIndex).trim()
        verbatimLng = coordsString.substring(splitIndex + 1).trim()
      }
      else {
        var currSepIndex = 0
        var startSearchIndex = 0
        while (currSepIndex <= middle){
          splitIndex = coordsString.indexOf(seps[currSepIndex], startSearchIndex)
          startSearchIndex = splitIndex + 1
          currSepIndex++
        }

        verbatimLat = coordsString.substring(0, splitIndex).trim()
        verbatimLng = coordsString.substring(splitIndex + 1).trim()

      }

    }

    //all done!!
    //just truncate the decimals appropriately
    ddLat = ddLat.toString()
    if(ddLat.includes(',')) {
      var parts = ddLat.split(',')
      if(parts[1].length > 6){
        parts[1] = parts[1].substr(0,6)
      }
    }
    else {
      var parts = ddLat.split('.')
      if(parts[1].length > 6){
        parts[1] = parts[1].substr(0,6)
      }
    }

    ddLat = parts.join('.')

    ddLng = ddLng.toString()
    if(ddLng.includes(',')) {
      var parts = ddLng.split(',')
      if(parts[1].length > 6){
        parts[1] = parts[1].substr(0,6)
      }
    }
    else {
      var parts = ddLng.split('.')
      if(parts[1].length > 6){
        parts[1] = parts[1].substr(0,6)
      }
    }

    ddLng = parts.join('.')
    

    return {
      verbatimCoordinates: coordsString, 
      verbatimLatitude: verbatimLat,
      verbatimLongitude: verbatimLng,
      decimalLatitude:  Number(ddLat),
      decimalLongitude: Number(ddLng),
      decimalCoordinates: `${ddLat},${ddLng}`,
      closeEnough: coordsCloseEnough
    }
  }
  else {
    throw new Error("coordinates pattern match failed")
  }

}

function checkMatch(match) { //test if the matched groups arrays are 'balanced'. match is the resulting array
				
  //first remove the empty values from the array
  var filteredMatch = match.filter(function(item){
    if (!item || item == ''){
      return false;
    }
    else {
      return true;
    }
  });
  
  //we need to shift the array because it contains the whole coordinates string in the first item
  filteredMatch.shift();
  
  /*
  //if minutes or seconds are out of bounds, the array length is wrong
  if (filteredMatch.length == 4) {
    return false
  }
  */
  
  //then check the array length is an even number else exit
  if (filteredMatch.length % 2 > 0) {
    return false;
  }

  //regex for testing corresponding values match
  var numerictest = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/; //for testing numeric values
  var stringtest = /[A-Za-z]+/; //strings - the contents of strings are already matched when this is used
  
  
  var halflen = filteredMatch.length/2;
  result = true;
  for (var i = 0; i < halflen; i++) {
    if (numerictest.test(filteredMatch[i]) != numerictest.test(filteredMatch[i + halflen]) || stringtest.test(filteredMatch[i]) != stringtest.test(filteredMatch[i + halflen])) {
      result = false;
      break;
    }
  }
  
  return result;
}

//functions for coordinate validation

//as decimal arithmetic is not straightforward, we approximate
function decimalsCloseEnough(dec1, dec2){
  var diff = Math.abs(dec1 - dec2)
  return diff <= 0.0000011
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
var dd_re = /(NORTH|SOUTH|[NS])?[\s]*([+-]?[0-8]?[0-9](?:[\.,]\d{3,}))([•º°]?)[\s]*(NORTH|SOUTH|[NS])?[\s]*[,/]?[\s]*(EAST|WEST|[EW])?[\s]*([+-]?[0-1]?[0-9]?[0-9](?:[\.,]\d{3,}))([•º°]?)[\s]*(EAST|WEST|[EW])?/i;
//degrees minutes seconds with '.' as separator - gives array with 15 values
var dms_periods = /(NORTH|SOUTH|[NS])?[\ \t]*([+-]?[0-8]?[0-9])[\ \t]*(\.)[\ \t]*([0-5]?[0-9])[\ \t]*(\.)?[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(NORTH|SOUTH|[NS])?(?:[\ \t]*[,/][\ \t]*|[\ \t]*)(EAST|WEST|[EW])?[\ \t]*([+-]?[0-1]?[0-9]?[0-9])[\ \t]*(\.)[\ \t]*([0-5]?[0-9])[\ \t]*(\.)?[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(EAST|WEST|[EW])?/i;
//degrees minutes seconds with words 'degrees, minutes, seconds' as separators (needed because the s of seconds messes with the S of SOUTH) - gives array of 17 values
var dms_abbr = /(NORTH|SOUTH|[NS])?[\ \t]*([+-]?[0-8]?[0-9])[\ \t]*(D(?:EG)?(?:REES)?)[\ \t]*([0-5]?[0-9])[\ \t]*(M(?:IN)?(?:UTES)?)[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(S(?:EC)?(?:ONDS)?)?[\ \t]*(NORTH|SOUTH|[NS])?(?:[\ \t]*[,/][\ \t]*|[\ \t]*)(EAST|WEST|[EW])?[\ \t]*([+-]?[0-1]?[0-9]?[0-9])[\ \t]*(D(?:EG)?(?:REES)?)[\ \t]*([0-5]?[0-9])[\ \t]*(M(?:IN)?(?:UTES)?)[\ \t]*((?:[0-5]?[0-9])(?:\.\d{1,3})?)?(S(?:EC)?(?:ONDS)?)[\ \t]*(EAST|WEST|[EW])?/i;
//everything else - gives array of 17 values 
var coords_other = /(NORTH|SOUTH|[NS])?[\ \t]*([+-]?[0-8]?[0-9])[\ \t]*([•º°\.:]|D(?:EG)?(?:REES)?)?[\ \t]*,?([0-5]?[0-9](?:\.\d{1,})?)?[\ \t]*(['′´’\.:]|M(?:IN)?(?:UTES)?)?[\ \t]*,?((?:[0-5]?[0-9])(?:\.\d{1,3})?)?[\ \t]*(''|′′|’’|´´|["″”\.])?[\ \t]*(NORTH|SOUTH|[NS])?(?:[\ \t]*[,/][\ \t]*|[\ \t]*)(EAST|WEST|[EW])?[\ \t]*([+-]?[0-1]?[0-9]?[0-9])[\ \t]*([•º°\.:]|D(?:EG)?(?:REES)?)?[\ \t]*,?([0-5]?[0-9](?:\.\d{1,})?)?[\ \t]*(['′´’\.:]|M(?:IN)?(?:UTES)?)?[\ \t]*,?((?:[0-5]?[0-9])(?:\.\d{1,3})?)?[\ \t]*(''|′′|´´|’’|["″”\.])?[\ \t]*(EAST|WEST|[EW])?/i;

module.exports = converter