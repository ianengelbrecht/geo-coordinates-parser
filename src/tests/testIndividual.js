import convert from '../converter.js'
//const test = '26°44S 29°46E'
//const test = '00.00, 01.00'
const test = `26°05240'S, 27°51448'E`

try {
  let converted = convert(test)
  console.log(converted)
  console.log(converted.toCoordinateFormat(convert.to.DM))

  //and just to make sure it's frozen
  let previous = converted.decimalLatitude
  converted.decimalLatitude = 24
  if(converted.decimalLatitude === previous) {
    console.log('the result is frozen')
  }
  else {
    console.error('!!!The result is not frozen!!!!')
  }
}
catch(err){
  console.log(err.message)
}
