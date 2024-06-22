//function for converting coordinates from a string to decimal and verbatim
//this is just a comment

import { dm_numbers, dd_re, dms_periods, dms_abbr, coords_other } from './regex.js'

import toCoordinateFormat from './toCoordinateFormat.js'

/**
 * Function for converting coordinates in a variety of formats to decimal coordinates
 * @param {string} coordsString The coordinates string to convert
 * @param {number} [decimalPlaces] The number of decimal places for converted coordinates; default is 5
 * @returns {{verbatimCoordinates: string, decimalCoordinates: string, decimalLatitude: string, decimalLongitude: string, closeEnough: function(string): boolean, toCoordinateFormat: toCoordinateFormat}}
 */
function converter(coordsString, decimalPlaces) {

  //TODO add exact match to entered string, so that it can be used to filter out superflous text around it
  if(!decimalPlaces) {
    decimalPlaces = 5
  }

  coordsString = coordsString.replace(/\s+/g, ' ').trim(); //just to tidy up whitespaces

  let ddLat = null;
  let ddLng = null; 
  let latdir = "";
  let lngdir = "";
  let match = [];	
  let matchSuccess = false;

  if (dm_numbers.test(coordsString)) {
    match = dm_numbers.exec(coordsString)
    matchSuccess = checkMatch(match)
    
    if (matchSuccess){

      ddLat = Math.abs(match[1]) + match[2]/60
      if (Number(match[1]) < 0) {
        ddLat *= -1
      }

      ddLng = Math.abs(match[3]) + match[4]/60
      if(Number(match[3]) < 0) {
        ddLng *= -1
      }

    }
    else {
      throw new Error("invalid coordinate format")		
    }
  }

  else if (dd_re.test(coordsString)){
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
        throw new Error('integer only coordinate provided')
      }

      if (Number(Math.round(ddLng)) == Number(ddLng)) {
        throw new Error('integer only coordinate provided')
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
      }

      if (match[6]) {
        ddLat += match[6]/3600;
      }

      if (parseInt(match[2]) < 0) {
        ddLat = -1 * ddLat;
      }
        
      ddLng = Math.abs(parseInt(match[10]));

      if (match[12]) {
        ddLng += match[12]/60;
      }

      if (match[14]) {
        ddLng += match[14]/3600;
      }

      if (parseInt(match[10]) < 0) {
        ddLng = -1 * ddLng;
      }
      
      //the compass directions
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
        
        ddLat += match[4].replace(',', '.')/60;
      }

      if (match[6]) {
        ddLat += match[6].replace(',', '.')/3600;
      }

      if (parseInt(match[2]) < 0) {
        ddLat = -1 * ddLat;
      }
        
      ddLng = Math.abs(parseInt(match[10]));
      if (match[12]) {
        ddLng += match[12].replace(',', '.')/60;
      }

      if (match[14]) {
        ddLng += match[14].replace(',', '.')/3600;
      }

      if (parseInt(match[10]) < 0) {
        ddLng = -1 * ddLng;
      }
      
      //the compass directions
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

  if (matchSuccess){

    //more validation....

      //check longitude value - it can be wrong!
      if (Math.abs(ddLng) >= 180) {
        throw new Error("invalid longitude value")				
      }

      //just to be safe check latitude also...
      if (Math.abs(ddLat) >= 90) {
        throw new Error("invalid latitude value")				
      }

    //if we have one direction we must have the other
    if((latdir && !lngdir) || (!latdir && lngdir)) {
      throw new Error("invalid coordinates value")	
    }

    //the directions can't be the same
    if(latdir && latdir == lngdir) {
      throw new Error("invalid coordinates format")	
    }

    //make sure the signs and cardinal directions match
    let patt = /S|SOUTH/i;
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
    const verbatimCoordinates = match[0].trim()
    let verbatimLat
    let verbatimLng

    const sepChars = /[,/;\u0020]/g //comma, forward slash and spacebar
    const seps = verbatimCoordinates.match(sepChars)

    if (seps == null) {
      //split down the middle
      const middle = Math.floor(coordsString.length/2)
      verbatimLat = verbatimCoordinates.substring(0, middle).trim()
      verbatimLng = verbatimCoordinates.substring(middle).trim()
    }
    else { //if length is odd then find the index of the middle value
      
      //get the middle index
      let middle
      //easy for odd numbers
      if (seps.length % 2 == 1) {
        middle = Math.floor(seps.length / 2) 
      }
      else {
        middle = (seps.length / 2) - 1
      }

      //walk through seps until we get to the middle
      let splitIndex = 0;
      
      //it might be only one value
      if (middle == 0){
        splitIndex = verbatimCoordinates.indexOf(seps[0])
        verbatimLat = verbatimCoordinates.substring(0, splitIndex).trim()
        verbatimLng = verbatimCoordinates.substring(splitIndex + 1).trim()
      }
      else {
        let currSepIndex = 0
        let startSearchIndex = 0
        while (currSepIndex <= middle){
          splitIndex = verbatimCoordinates.indexOf(seps[currSepIndex], startSearchIndex)
          startSearchIndex = splitIndex + 1
          currSepIndex++
        }

        verbatimLat = verbatimCoordinates.substring(0, splitIndex).trim()
        verbatimLng = verbatimCoordinates.substring(splitIndex + 1).trim()

      }

    }

    //validation again...

    //we only allow zeros after the period if its DM
    const splitLat = verbatimLat.split('.')
    if(splitLat.length == 2) {
      if(splitLat[1] == 0 && splitLat[1].length != 2){
        throw new Error('invalid coordinates format')
      }
    }

    const splitLon = verbatimLng.split('.')
    if(splitLon.length == 2) {
      if(splitLon[1] == 0 && splitLon[1].length != 2){
        throw new Error('invalid coordinates format')
      }
    }

    //no integer coords allowed
    if(/^\d+$/.test(verbatimLat) || /^\d+$/.test(verbatimLng)) {
      throw new Error('degree only coordinate/s provided')
    }
    
    // last bit of tidying up...
    if(isNaN(ddLat) && ddLat.includes(',')) {
      ddLat = ddLat.replace(',', '.')
    }

    if(isNaN(ddLng) && ddLng.includes(',')) {
      ddLng = ddLng.replace(',', '.')
    }

    //all done!!
    //just truncate the decimals appropriately
    ddLat = Number(Number(ddLat).toFixed(decimalPlaces))
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
  const filteredMatch = [...match]
  
  //we need to shift the array because it contains the whole coordinates string in the first item
  filteredMatch.shift();
  
  //check the array length is an even number
  if (filteredMatch.length % 2 > 0) {
    return false;
  }

  // regex for testing corresponding values match
  const numerictest = /^[-+]?\d+([\.,]\d+)?$/; //for testing numeric values
  const stringtest = /[eastsouthnorthwest]+/i; //for testing string values (north, south, etc)
  
  
  const halflen = filteredMatch.length/2;

  for (let i = 0; i < halflen; i++) {
    const leftside = filteredMatch[i]
    const rightside = filteredMatch[i + halflen]
    const bothAreNumbers = numerictest.test(leftside) && numerictest.test(rightside)
    const bothAreStrings = stringtest.test(leftside) && stringtest.test(rightside)
    const valuesAreEqual = leftside == rightside
    
    if (leftside == undefined && rightside == undefined) { //we have to handle undefined because regex converts it to string 'undefined'!!
      continue
    }
    else if (leftside == undefined || rightside == undefined) { //no we need to handle the case where one is and the other not...
      return false
    }
    else if (bothAreNumbers || bothAreStrings || valuesAreEqual) {
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
  const originaldiff = Math.abs(dec1 - dec2)
  const diff = Number(originaldiff.toFixed(6))
  if (diff <= 0.00001){
    return true
  }
  else {
    return false
  }
}

function coordsCloseEnough(coordsToTest) {
  if (coordsToTest.includes(',')){
    const coords = coordsToTest.split(',')
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

// An enum for coordinates formats
const to = Object.freeze({
  DMS: 'DMS',
  DM: 'DM',
  DD: 'DD'
})

converter.to = to

export default converter
