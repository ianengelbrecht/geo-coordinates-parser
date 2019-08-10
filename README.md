# Geo Coordinate Parser

A Javascript function for reading a variety of coordinate formats and converting to decimal numbers. Builds on other efforts for convenience by returning the verbatim coordinates and the decimal coordinates all in one object.

### Usage
```js
parseCoordsString = require('geo-coordinate-parser');

let coords = parseCoordsString('40° 26.7717, -79° 56.93172');

coords.decimalLatitude; // 40.446195 ✓
coords.decimalLongitude; // -79.948862 ✓
coords.verbatimLatitude; // '40° 26.7717' ✓
coords.verbatimLongitude; // '-79° 56.93172' ✓
```
The returned object includes properties verbatimCoordinates, verbatimLatitude, verbatimLongitude, decimalLatitude, decimalLatitude, and decimalCoordinates.

**Please add coordinate formats that throw an error in the Issues.**

### Supported formats

All formats (except the 'exotic formats') covered by [npm coordinate-parser](https://www.npmjs.com/package/coordinate-parser) and the [coordinate regex in this GitHub Gist](https://gist.github.com/moole/3707127/337bd31d813a10abcf55084381803e5bbb0b20dc), as well as the following:
- -23.3245° S / 28.2344° E
- 27deg 15min 45.2sec S 18deg 32min 53.7sec E
- 18.24S 22.45E // read as degrees and minutes

### License
MIT Licence

### Acknowledgements
Support for development was provided by the [Animal Demography Unit](http://adu.uct.ac.za) of the University of Cape Town.
