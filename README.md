# Geo Coordinates Parser

A Javascript function for reading a variety of coordinate formats and converting to decimal latitude and longitude. Builds on previous efforts and returns the verbatim coordinates and the decimal coordinates together in one object for convenience. Can be used to extract coordinates from longer strings. Also includes a function to test existing decimal coordinates against those from the converter. 

##If you like this tool please [star it on GitHub](https://github.com/ianengelbrecht/geo-coordinates-parser)

### Installation
```
npm install geo-coordinates-parser
```

## NOTE THAT USAGE CHANGED IN V1.6.0 TO BETTER SUPPORT ES6 AND COMMONJS
### Usage
```js
const { convert } = require('geo-coordinates-parser'); //CommonJS
```
OR
```js
import { convert } from 'geo-coordinates-parser' //ES6
```
THEN
```js
let converted;
try {
  converted = convert('40° 26.7717, -79° 56.93172');
}
catch {
  /*we get here if the string is not valid coordinates or format is inconsistent between lat and long*/
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
ALSO
```js
converted.decimalLatitude; // 40.446195 ✓
converted.decimalLongitude; // -79.948862 ✓
converted.verbatimLatitude; // '40° 26.7717' ✓
converted.verbatimLongitude; // '-79° 56.93172' ✓
converted.decimalCoordinates; // for convenience
convert.originalFormat; // 'DM' to indicate degrees and minutes
```
The returned object includes properties verbatimCoordinates, verbatimLatitude, verbatimLongitude, decimalLatitude, decimalLatitude, and decimalCoordinates.

### Validating other conversions
Sometimes we may want to validate existing decimal coordinates against those returned from the converter to find errors. Because we're working with decimal numbers we must settle for values that are close enough (in this case equal up to six decimal places).

```js
converted.closeEnough(yourDecimalCoordinatesToValidate) //must be a numbers separated by ,
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

**Please note that decimal precision needs to be reasonable. The maximum decimal places allowed in DMS, for example, is three (3). DMS coordinates with four decimal places in seconds are measuring position at a precision of less than 
10mm, which is way beyond what even the best professional GPS devices can provide.**

**Please add coordinate formats that throw an error in the Github Issues.**

**CAUTION!!!**
**Coordinates like '24.56S 26.48E' are treated as degrees and minutes and '24, 26' or '24.0, 26.0' will throw an error. If you don't want this behaviour you need to catch these cases with your own code before you use convert.* *

### Want to use it in the browser?
Add ```<script src="https://cdn.jsdelivr.net/npm/geo-coordinates-parser/bundle/geocoordsparser.js"></script>```
to your html head and you'll have the ```convert``` function available globally.

### Convert back to standard formats
Sometimes we might want to convert back to more traditional formats for representing coordinates, such as DMS or DM. This can be useful for standardizing coordinates. The convert function has an enum to help.

```js
converted.toCoordinateFormat(convert.to.DMS) /// '40° 26.771" N, 79° 56.932" W' ✓
```

### License
MIT Licence

### Acknowledgements
Support for development was provided by the [Animal Demography Unit](http://adu.uct.ac.za) of the University of Cape Town, and the [Natural Science Collections Facility](http://nscf.co.za). CommonJS and ESM support was added following [https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html](https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html).
