//TODO These formats should throw...

const failingFormats = [
  'N 52d12m42s E 000d0m0s', //degree only coordinate and zero coordinate
  'N49 0.000 E02 33.314', //degree only coordinate
  '0,0', //another zero coordinate, numbers only
  '0, 24.34532', //zero coordinate on one size only
  '50°4\'17.698"south, 24.34532', //different formats on each side
]

module.exports = failingFormats