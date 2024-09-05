const GRID_SIZE = 4;

const TILE_SIZE = 90

const TILE_COLORS = [
  { value: 0, color: '', background: '#ccc0b3' },
  { value: 2, color: '#776E65', background: '#eee4da' },
  { value: 4, color: '#776E65', background: '#ede0c8' },
  { value: 8, color: '#FFF', background: '#f2b179' },
  { value: 16, color: '#FFF', background: '#f59563' },
  { value: 32, color: '#FFF', background: '#f67c5f' },
  { value: 64, color: '#FFF', background: '#f65e3b' },
  { value: 128, color: '#FFF', background: '#edcf72' },
  { value: 256, color: '#FFF', background: '#edcc61' },
  { value: 512, color: '#FFF', background: '#edc850' },
  { value: 1024, color: '#FFF', background: '#edc53f' },
  { value: 2048, color: '#FFF', background: '#edc22e' }
]

const MARGIN_TILES = 10

export {
  GRID_SIZE,
  TILE_SIZE,
  TILE_COLORS,
  MARGIN_TILES
}