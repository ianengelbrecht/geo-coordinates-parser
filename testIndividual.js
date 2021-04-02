const convert = require('./converter')
const test = 'Between Sannieshof and Bessiesvlei. 26.4558°S; 25.8644°E.'
try{
  let converted = convert(test)
  console.log(converted)
}
catch(err){
  console.log(err.message)
}
