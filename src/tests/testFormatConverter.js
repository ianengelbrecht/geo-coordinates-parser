import toCoordinateFormat from '../src/toCoordinateFormat.js/index.js'

let test = {
  decimalCoordinates: '-234.3456, 28.92435',
  toCoordinateFormat
}

console.log(test.toCoordinateFormat('DMS'))