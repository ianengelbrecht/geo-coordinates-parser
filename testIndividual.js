const convert = require('./converter')
const test = '42:12:4S 27:17:18E'

try{
  let converted = convert(test)
  console.log(converted)
  console.log(converted.toCoordinateFormat(convert.to.DM))

  //and just to make sure it's frozen
  converted.decimalLatitude = 24
  console.log(converted)
}
catch(err){
  console.log(err.message)
}
