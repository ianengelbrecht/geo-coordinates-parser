import toCoordinateFormat from '../toCoordinateFormat.js'

let test = {
  decimalCoordinates: '-24.3456, 28.92435',
  toCoordinateFormat
}

console.log(test.toCoordinateFormat('DMS'))

test.decimalCoordinates = '-25.76887,28.26939'
console.log(test.toCoordinateFormat('DMS'))
console.log(test.toCoordinateFormat('DM'))
console.log(test.toCoordinateFormat('DD'))

test.decimalCoordinates = '-25.815928, 28.070318'
console.log(test.toCoordinateFormat('DM'))

test.decimalCoordinates = '-25.000, 28.000'
console.log(test.toCoordinateFormat('DMS'))
console.log(test.toCoordinateFormat('DM'))


