const convert = require('./converter')
const test = '± 1 km on Schweizer rd (R504) from Schweizer Reinecke to Ipelegeng.'
try{
  let converted = convert(test)
  console.log(converted)
}
catch(err){
  console.log(err.message)
}
