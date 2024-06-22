
//borrowed from https://www.codegrepper.com/code-examples/javascript/javascript+converting+latitude+longitude+to+gps+coordinates

/**
 * Converts decimalCoordinates to commonly used string formats 
 * Note that this will add degree and direction symbols to decimal coordinates
 * @param {string} format Either DMS or DM
 * @returns {string}
 */
function toCoordinateFormat(format) {

  if(!['DMS', 'DM', 'DD'].includes(format)) throw new Error('invalid format specified')

  if(this.decimalCoordinates && this.decimalCoordinates.trim()) {

    const parts = this.decimalCoordinates.split(',').map(x => Number(x.trim()))
    const decimalLatitude = Number(parts[0])
    const decimalLongitude = Number(parts[1])
    const absoluteLatitude = Math.abs(decimalLatitude)
    const absoluteLongitude = Math.abs(decimalLongitude)
    const latDir = decimalLatitude > 0 ? "N" : "S"
    const longDir = decimalLongitude > 0 ? "E" : "W"

    let result

    if(format == 'DD'){
      result = `${absoluteLatitude}° ${latDir}, ${absoluteLongitude}° ${longDir}`
    }

    //else we need some more things

    const degreesLatitude = Math.floor(absoluteLatitude);
    const degreesLongitude = Math.floor(absoluteLongitude)
    const minutesLatitudeNotTruncated = (absoluteLatitude - degreesLatitude) * 60;
    const minutesLongitudeNotTruncated = (absoluteLongitude - degreesLongitude) * 60

    if (format == 'DM') {
      const dmMinsLatitude = round(minutesLatitudeNotTruncated, 3).toFixed(3).padStart(6, '0')
      const dmMinsLongitude = round(minutesLongitudeNotTruncated, 3).toFixed(3).padStart(6, '0')
      result = `${degreesLatitude}° ${dmMinsLatitude}' ${latDir}, ${degreesLongitude}° ${dmMinsLongitude}' ${longDir}`
    }

    if (format == "DMS") {
      const latMinutes = Math.floor(minutesLatitudeNotTruncated)
      const longMinutes = Math.floor(minutesLongitudeNotTruncated)
      let latSeconds = ((minutesLatitudeNotTruncated - latMinutes) * 60).toFixed(1).padStart(4, '0');
      let longSeconds = ((minutesLongitudeNotTruncated - longMinutes) * 60).toFixed(1).padStart(4, '0');
      const latMinutesString = latMinutes.toString().padStart(2, '0')
      const longMinutesString = longMinutes.toString().padStart(2, '0')

      // if they both end in .0 we drop the .0
      if (latSeconds.endsWith('.0"') && longSeconds.endsWith('.0"')){
        latSeconds = latSeconds.replace(/\.0"$/, '"')
        longSeconds = longSeconds.replace(/\.0"$/, '"')
      }

      result = `${degreesLatitude}° ${latMinutesString}' ${latSeconds}" ${latDir}, ${degreesLongitude}° ${longMinutesString}' ${longSeconds}" ${longDir}`;
    }

    return result

  }
  else {
    throw new Error('no decimal coordinates to convert')
  }
}

function round(num, places) {
  const d = Math.pow(10, places);
  return Math.round((num + Number.EPSILON) * d) / d;
}

export default toCoordinateFormat