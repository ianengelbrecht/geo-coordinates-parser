//TODO These formats should throw...

const failingFormats = [
  '50°4\'17.698"south, 24.34532', //different formats on each side
  '90°4\'17.698"south, 23°4\'17.698"east',
  '50°4\'17.698"east, 23°4\'17.698"south',
]

module.exports = failingFormats