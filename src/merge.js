//adds the formats to the convert object
//we need to use this as the source for the npm package so that the formats are not included in the bundle

import converter from './converter.js'
import testFormats from './tests/testformats.js'

converter.formats = testFormats.map(format => format.verbatimCoordinates)

export const convert = converter