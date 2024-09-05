import { GRID_SIZE, TILE_COLORS, TILE_SIZE, MARGIN_TILES } from '../util/enum.js'
import { sleep } from '../util/util.js'

class Grid {
  constructor({ grid, tiles }) {
    this.grid = grid
    this.tiles = tiles
  }

  // Creating the game grid
  createGrid = () => {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      this.grid.appendChild(tile);
    }

    this.generateTile();
    this.generateTile();
  }

  // Generating a new tile in the grid randomly
  generateTile = () => {
    const positionsFilled = this.tiles.map(el => el.position)
    const positionsAvailable = Array(16).fill(0).map((_, index) => (index)).filter(el => !positionsFilled.includes(el))

    if (positionsAvailable.length === 0) {
      // game over
      return false;
    }

    const position = positionsAvailable[Math.floor(Math.random() * positionsAvailable.length)];
    const value = Math.random() < 0.8 ? 2 : 4;

    this.generateTileWithPositionAndValue(position, value)
  }

  // Generating a new tile in the grid with a given position
  generateTileWithPositionAndValue = (position, value) => {

    const colorTile = TILE_COLORS.find(el => el.value === value)
    const tileNumber = document.createElement('div')

    tileNumber.classList.add('tile-number')
    tileNumber.innerText = value
    tileNumber.style.background = colorTile.background
    tileNumber.style.color = colorTile.color
    tileNumber.style.top = `${Math.floor(position / GRID_SIZE) * TILE_SIZE + MARGIN_TILES}px`
    tileNumber.style.left = `${Math.floor(position % GRID_SIZE) * TILE_SIZE + MARGIN_TILES}px`
    this.tiles.push({
      tile: tileNumber,
      value,
      position
    })
    this.grid.appendChild(tileNumber)
  }

  executeAnimation = async ({ tilesToSlide, tilesToCreate, tilesToRemove, direction }) => {

    for (let i = 0; i < tilesToSlide.length; i++) {
      if (direction === 'down') {
        let tile = tilesToSlide[tilesToSlide.length - i - 1]
        tile.tile.style.top = `${tile.newPosition * TILE_SIZE + MARGIN_TILES}px`
        this.tiles.find(el => el.position === tile.absoluteCurrentPosition).position = tile.absoluteFinalPosition
      } else if (direction === 'up') {
        let tile = tilesToSlide[i]
        tile.tile.style.top = `${tile.newPosition * TILE_SIZE + MARGIN_TILES}px`
        this.tiles.find(el => el.position === tile.absoluteCurrentPosition).position = tile.absoluteFinalPosition
      } else if (direction === 'left') {
        let tile = tilesToSlide[i]
        tile.tile.style.left = `${tile.newPosition * TILE_SIZE + MARGIN_TILES}px`
        this.tiles.find(el => el.position === tile.absoluteCurrentPosition).position = tile.absoluteFinalPosition
      } else if (direction === 'right') {
        let tile = tilesToSlide[tilesToSlide.length - i - 1]
        tile.tile.style.left = `${tile.newPosition * TILE_SIZE + MARGIN_TILES}px`
        this.tiles.find(el => el.position === tile.absoluteCurrentPosition).position = tile.absoluteFinalPosition
      }
    }

    await sleep(300)

    tilesToCreate.forEach(tileToCreate => {
      this.generateTileWithPositionAndValue(tileToCreate.position, tileToCreate.value)
    })

    tilesToRemove.forEach(tileToRemove => {
      this.grid.removeChild(tileToRemove.tile)
      this.tiles = this.tiles.filter(tile => !(tile.position === tileToRemove.position && tile.value === tileToRemove.value))
    })
  }
}

export default Grid