# Geo Coordinates Parser

A Javascript function for reading a variety of coordinate formats and converting to decimal latitude and longitude. Builds on other efforts for convenience by returning the verbatim coordinates and the decimal coordinates all in one object. Can be used to extract coordinates from longer strings. Also includes a function to test existing decimal coordinates against those from the converter. 

##If you like this package please [star it on GitHub](https://github.com/ianengelbrecht/geo-coordinates-parser)

### Installation
```
npm install geo-coordinates-parser
```

### Usage
```js
const convert = require('geo-coordinates-parser');
```
OR
```js
import convert from 'geo-coordinates-parser' //ES6
```
THEN
```js
let converted;
try {
  converted = convert('40° 26.7717, -79° 56.93172');
}
catch {
  //we get here if the string is not valid coordinates
}

```
OR add the number of decimal places you want (but be reasonable, [see Coordinate Precision here](https://en.wikipedia.org/wiki/Decimal_degrees)) -- default is 5

```js
try{
  let converted = convert(coordinatesString, integerDecimalPlaces)
  //do stuff with coordinates...
}
catch{
  //coordinates not valid
}
```
THEN
```js
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

All formats (except the 'exotic formats') covered by [npm coordinate-parser](https://www.npmjs.com/package/coordinate-parser) and the [coordinate regex in this GitHub Gist](https://gist.github.com/moole/3707127/337bd31d813a10abcf55084381803e5bbb0b20dc), including the following:
- -23.3245° S / 28.2344° E
- 27deg 15min 45.2sec S 18deg 32min 53.7sec E
- 40° 26.7717 -79° 56.93172
- 18.24S 22.45E // read as degrees and minutes
- 27.15.45S 18.32.53E

...and others.

Formats used for testing can be be accessed with:

```
convert.formats
```

**Please add coordinate formats that throw an error in the Github Issues.**

### Want to use it in the browser?
A ready bundled script is available in the source code, in the bundle directory, named geocoordsparser.js. [Download](https://stackoverflow.com/a/13593430/3210158), include it in a script tag in your html, and you'll have a function called `convert()` available in your environment.

### Other implementations
There is an [MS Excel plugin here](http://bit.ly/convertcoords). See the README for instructions.
More to come...

### License
MIT Licence

### Acknowledgements
Support for development was provided by the [Animal Demography Unit](http://adu.uct.ac.za) of the University of Cape Town, and the [Natural Science Collections Facility](http://nscf.co.za).
