const toCoordinateFormat = require('./toCoordinateFormat.js')

let test = {
  decimalCoordinates: '-234.3456, 28.92435',
  toCoordinateFormat
}

console.log(test.toCoordinateFormat('DMS'))