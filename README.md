# Geo Coordinate Parser

A Javascript function for reading a variety of coordinate formats and converting to decimal numbers. Builds on other efforts for convenience by returning the verbatim coordinates and the decimal coordinates all in one object. Also includes a function to test existing decimal coordinates against those from the converter. 

##If you like this package please [star it on GitHub](https://github.com/ianengelbrecht/geo-coordinates-parser)

### Usage
```js
const convert = require('geo-coordinate-parser');

let converted = convert('40° 26.7717, -79° 56.93172');

converted.decimalLatitude; // 40.446195 ✓
converted.decimalLongitude; // -79.948862 ✓
converted.verbatimLatitude; // '40° 26.7717' ✓
converted.verbatimLongitude; // '-79° 56.93172' ✓
```
The returned object includes properties verbatimCoordinates, verbatimLatitude, verbatimLongitude, decimalLatitude, decimalLatitude, and decimalCoordinates.

Sometimes we may want to validate existing decimal coordinates against those returned from the converter to find errors. Because we're working with decimal numbers we must settle for values that are close enough (in this case the same up to six decimal places).

```js
converted.closeEnough(yourDecimalCoordinatesToTest) //must be a string separated by ,
```

### Supported formats

All formats (except the 'exotic formats') covered by [npm coordinate-parser](https://www.npmjs.com/package/coordinate-parser) and the [coordinate regex in this GitHub Gist](https://gist.github.com/moole/3707127/337bd31d813a10abcf55084381803e5bbb0b20dc), as well as the following:
- -23.3245° S / 28.2344° E
- 27deg 15min 45.2sec S 18deg 32min 53.7sec E
- 40° 26.7717 -79° 56.93172
- 18.24S 22.45E // read as degrees and minutes

Formats used to testing can be be accessed with:

```js
covert.formats
```

**Note to users: Please add coordinate formats that throw an error in the Github Issues.**

### Want to use it in the browser?
A ready bundled script is available the source code, in the bundle directory, named geocoordsparser.js. Include it in a script tag and it adds a function called convert into your environment.

### License
MIT Licence

### Acknowledgements
Support for development was provided by the [Animal Demography Unit](http://adu.uct.ac.za) of the University of Cape Town, and the [Natural Science Collections Facility](http://nscf.co.za).
