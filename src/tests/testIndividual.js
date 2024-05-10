import convert from '../converter.js'
//const test = '26°44S 29°46E'
//const test = '00.00, 01.00'
//const test = `45°5'46.8134"N, 18°30'36.7124"E`
//const test = `50 8.2914,-5 2.4447`
//const test = `8°83S 35°67E`
const test = `N 48° 30,6410', E 18° 57,4583'`

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
