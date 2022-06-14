//TODO These formats should throw...

const failingFormats = [
  '50°4\'17.698"south, 24.34532', //different formats on each side
  '90°4\'17.698"south, 23°4\'17.698"east',
  '50°4\'17.698"east, 23°4\'17.698"south', //directions wrong way round
  'E23.34355,S25.324234', // directions wrong way round
  '23°45\'12.2\'\'S 18.33\'56.7\'\'E', //symbols don't match
]

module.exports = failingFormats