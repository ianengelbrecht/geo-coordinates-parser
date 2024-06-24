import convert from '../converter.js'
//const test = '26°44S 29°46E'
//const test = '00.00, 01.00'
//const test = `45°5'46.8134"N, 18°30'36.7124"E`
//const test = `50 8.2914,-5 2.4447`
//const test = `8°83S 35°67E`
//const test = `N 48° 30,6410', E 18° 57,4583'`
//const test = '-254.4602, 31.53681'
const test = '25.62S, 27.77E'
//const correctDecimals = '-25.533333, 27.283333'

let converted
try {
  converted = convert(test)
}
catch(err){
  console.log(err.message)
  process.exit()
}

console.log(converted)
console.log('DM:', converted.toCoordinateFormat(convert.to.DM).replace(/\s/g, '')) // shortened format

if (!converted.closeEnough(correctDecimals)) {
  console.error('!!! conversion is incorrect !!!')
}