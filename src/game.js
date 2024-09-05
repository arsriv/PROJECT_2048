// Import necessary functions and classes from other modules
import { isArraysEqual, sleep } from './util/util.js';
import { GRID_SIZE } from './util/enum.js';
import { getTile, TilesHelper, findMovements } from './helpers/tiles.js';
import Grid from './helpers/grid.js';

// Get references to HTML elements
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('scoreValue');


// Add event listeners for mouse clicks
document.querySelectorAll('.direction-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const direction = event.target.dataset.direction; // Assume buttons have data-direction attributes
      await move(direction);
    });
});

  let touchStartX = 0;
  let touchStartY = 0;
  
  grid.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });
  
  grid.addEventListener('touchend', async (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
  
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        await move('right');
      } else {
        await move('left');
      }
    } else {
      if (dy > 0) {
        await move('down');
      } else {
        await move('up');
      }
    }
  });
  
  

// Initialize game-related variables
let score = 0;
let tiles = [];

// Create instances of helper classes
const tilesHelper = new TilesHelper({ score, scoreDisplay });
const gridHelper = new Grid({ grid, tiles });

// Function to handle the movement of tiles in the grid
async function move(direction) {
  // Create an array to store the current state of each tile on the grid
  const tilesValues = Array(16).fill({ value: 0, tile: null });

  // Copy the current state of the tiles to the tilesValues array
  gridHelper.tiles.forEach(el => {
    tilesValues[el.position] = { value: el.value, tile: el.tile };
  });

  // Variables to keep track of the movements and actions taken during the movement
  let moved = false;
  let tilesToRemove = [[]];
  let tilesToCreate = [[]];
  let tilesToSlide = [[]];

  // Handle left or right movement
  if (direction === 'left' || direction === 'right') {
    // Iterate through each row of the grid
    for (let i = 0; i < GRID_SIZE; i++) {
      // Initialize arrays to store tile movements, removals, and creations for each row
      tilesToSlide[i] = [];
      tilesToRemove[i] = [];
      tilesToCreate[i] = [];

      // Extract the values of the current row
      const row = tilesValues.slice(i * 4, i * 4 + 4).map(el => el.value);

      // Slide the row to the specified direction using the TilesHelper class
      const { newRow } = tilesHelper.slide(row, direction);

      // Check if any movement occurred
      if (!isArraysEqual(newRow, row)) {
        // Find movements and merges to update the tiles' positions and values
        const { movements, merges } = findMovements(row, newRow, direction);

        // Update tilesToSlide array with the necessary tile movements
        movements.forEach((movement) => {
          const tile = getTile(tilesValues, i, movement.initialPosition);
          if (movement.initialPosition !== movement.finalPosition) {
            tilesToSlide[i].push({ tile: tile.tile, currentPosition: movement.initialPosition, newPosition: movement.finalPosition, absoluteCurrentPosition: i * GRID_SIZE + movement.initialPosition, absoluteFinalPosition: i * GRID_SIZE + movement.finalPosition });
          }
        });

        // Update tilesToRemove and tilesToCreate arrays for tile merging and creation
        merges.forEach((merge, index) => {
          const tile = getTile(tilesValues, i, merge.initialPosition);
          tilesToRemove[i].push({ tile: tile.tile, position: i * GRID_SIZE + merge.finalPosition, value: row[merge.initialPosition] });
          if (index % 2 === 1) {
            tilesToCreate[i].push({ position: i * GRID_SIZE + merge.finalPosition, value: newRow[merge.finalPosition] });
          }
        });

        // Mark that a move occurred
        moved = true;
      }
    }
  }

  // Handle up or down movement
  if (direction === 'up' || direction === 'down') {
    // Iterate through each column of the grid
    for (let i = 0; i < GRID_SIZE; i++) {
      // Extract the values of the current column
      const col = tilesValues.map(el => el.value).filter((el, index) => {
        return index % 4 === i;
      });

      // Initialize arrays to store tile movements, removals, and creations for each column
      tilesToSlide[i] = [];
      tilesToRemove[i] = [];
      tilesToCreate[i] = [];

      // Slide the column to the specified direction using the TilesHelper class
      const { newRow: newCol } = tilesHelper.slide(col, direction);

      // Check if any movement occurred
      if (!isArraysEqual(newCol, col)) {
        // Find movements and merges to update the tiles' positions and values
        const { movements, merges } = findMovements(col, newCol, direction);

        // Update tilesToSlide array with the necessary tile movements
        movements.forEach((movement) => {
          const tile = getTile(tilesValues, movement.initialPosition, i);
          if (movement.initialPosition !== movement.finalPosition) {
            tilesToSlide[i].push({ tile: tile.tile, currentPosition: movement.initialPosition, newPosition: movement.finalPosition, absoluteCurrentPosition: movement.initialPosition * GRID_SIZE + i, absoluteFinalPosition: movement.finalPosition * GRID_SIZE + i });
          }
        });

        // Update tilesToRemove and tilesToCreate arrays for tile merging and creation
        merges.forEach((merge, index) => {
          const tile = getTile(tilesValues, merge.initialPosition, i);
          tilesToRemove[i].push({ tile: tile.tile, position: merge.finalPosition * GRID_SIZE + i, value: col[merge.initialPosition] });
          if (index % 2 === 1) {
            tilesToCreate[i].push({ position: merge.finalPosition * GRID_SIZE + i, value: newCol[merge.finalPosition] });
          }
        });

        // Mark that a move occurred
        moved = true;
      }
    }
  }

  // If any tiles were moved, execute animations, update the grid, and generate a new tile
  if (moved) {
    for (let i = 0; i < GRID_SIZE; i++) {
      gridHelper.executeAnimation({ tilesToSlide: tilesToSlide[i], tilesToCreate: tilesToCreate[i], tilesToRemove: tilesToRemove[i], direction });
    }
    await sleep(300);
    gridHelper.generateTile();
  }
}

// Game class to handle game initialization and user input
class Game {
  // Method to start a new game
  newGame = async () => {
    // Create the grid and set up event listener for user input
    gridHelper.createGrid();
    window.addEventListener('keydown', async event => {
      const movements = {
        u: 'left',
        w: 'up',
        d: 'right',
        s: 'down'
      };
      if (movements[event.key]) {
        await move(movements[event.key]);
      }
    });

    // Add mouse event listeners for direction buttons
    document.querySelectorAll('.direction-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const direction = event.target.dataset.direction;
        if (['left', 'right', 'up', 'down'].includes(direction)) {
          await move(direction);
        }
      });
    });
  }
}

// Export the Game class as the default export of this module
export default Game;
