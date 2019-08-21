//adds the formats to the convert object
//we need to use this as the source for the npm package so that the formats are not included in the bundle

var convert = require('./converter.js')
var formats = require('./testformats').map(format => format.verbatimCoordinates)

convert.formats = formats

module.exports = convert