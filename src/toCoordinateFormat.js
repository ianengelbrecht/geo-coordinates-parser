
//borrowed from https://www.codegrepper.com/code-examples/javascript/javascript+converting+latitude+longitude+to+gps+coordinates

/**
 * Converts decimalCoordinates to other formats commonly used
 * @param {*} format Either DMS or DM
 */
function toCoordinateFormat(format) {

  if(!['DMS', 'DM', 'DD'].includes(format)) throw new Error('invalid format specified')

  if(this.decimalCoordinates && this.decimalCoordinates.trim()) {

    if(format == 'DD'){
      return this.decimalCoordinates
    }

    const parts = this.decimalCoordinates.split(',').map(x => Number(x.trim()))
    let convertedLat = convert(parts[0], format, true)
    let convertedLong = convert(parts[1], format, false)

    //some custom cleaning for DMS
    if (convertedLat.endsWith('.0"') && convertedLong.endsWith('.0"')){
      convertedLat = convertedLat.replace(/\.0"$/, '"')
      convertedLong = convertedLong.replace(/\.0"$/, '"')
    }

    const latDirection = parts[0] >= 0 ? " N" : " S";
    const longDirection = parts[1] >= 0 ? " E" : " W";

    return `${convertedLat + latDirection}, ${convertedLong + longDirection}`
  }
  else {
    throw new Error('no decimal coordinates to convert')
  }
}

//assumes everything is valid...
function convert(coord, format) {

  const absolute = Math.abs(coord);

  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;

  if(format == 'DM') {
    let dmMins = round(minutesNotTruncated, 3).toFixed(3).padStart(6, '0')
    return `${degrees}° ${dmMins}'`;
  }

  //else
  let minutes = Math.floor(minutesNotTruncated)
  let seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1).padStart(4, '0');
  minutes = minutes.toString().padStart(2, '0')

  return `${degrees}° ${minutes}' ${seconds}"`;
}

function round(num, places) {
  const d = Math.pow(10, places);
  return Math.round((num + Number.EPSILON) * d) / d;
}

export default toCoordinateFormat