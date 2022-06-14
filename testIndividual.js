const convert = require('./converter')
const test = '23°45\'12.2\'\'S 18.33\'56.7\'\'E'

try{
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
