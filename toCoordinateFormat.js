
//borrowed from https://www.codegrepper.com/code-examples/javascript/javascript+converting+latitude+longitude+to+gps+coordinates

/**
 * Converts decimalCoordinates to other formats commonly used
 * @param {*} format Either DMS or DM
 */
function toCoordinateFormat(format) {

  if(!['DMS', 'DM'].includes(format)) throw new Error('invalid format specified')

  if(this.decimalCoordinates && this.decimalCoordinates.trim()) {
    const parts = this.decimalCoordinates.split(',').map(x => x.trim())
    const convertedLat = convert(parts[0], format, true)
    const convertedLong = convert(parts[1], format, false)
    return `${convertedLat}, ${convertedLong}`
  }
  else {
    throw new Error('no decimal coordinates to convert')
  }
}

//assumes everything is valid...
function convert(coordString, format, isLatitude) {

  const coord = Number(coordString)

  let direction
  if (isLatitude) {
    direction = coord >= 0 ? "N" : "S";
  } 
  else {
    direction = coord >= 0 ? "E" : "W";
  }

  const absolute = Math.abs(coord);

  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;

  if(format == 'DM') {
    return `${degrees}° ${minutesNotTruncated.toFixed(3).replace(/\.0+$/, '')}' ${direction}`;
  }

  //else
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1).replace(/\.0$/, '');

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

module.exports = toCoordinateFormat