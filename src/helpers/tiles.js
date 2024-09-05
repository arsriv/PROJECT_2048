import { GRID_SIZE } from '../util/enum.js'

const getTile = (tiles, i, j) => {
  return tiles[i * GRID_SIZE + j]
}

class TilesHelper {
  constructor({ score, scoreDisplay }) {
    this.score = score
    this.scoreDisplay = scoreDisplay
  }

  slide = (row, direction) => {
    let newRow = structuredClone(row);

    switch (direction) {
      case "up":
      case "left":

        newRow = slideRow(row)
        this.combine(newRow)
        newRow = slideRow(newRow)

        break;

      case "right":
      case "down":

        newRow = slideRow(row).reverse()
        this.combine(newRow)
        newRow = slideRow(newRow).reverse()
        break;

      default:
        return row;
    }

    return { newRow };
  }

  combine = (row) => {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] += row[i + 1]
        row[i + 1] = 0
        this.score += row[i]
        this.scoreDisplay.innerText = this.score
      }
    }
  }
}

const slideRow = (row) => {
  let arr = row.filter(val => val)
  let missing = 4 - arr.length
  let zeros = Array(missing).fill(0)
  arr = arr.concat(zeros)
  return arr
}

/**
 * This function gets the old array and returns its movements through the slide
 * 
 * For example:
 * 
 * If we get old array [2,2,0,0] and new array [0,0,0,4], we return the initial and final positions for the two elements from the initial array and we also return if there was a merge
 * 
 */
const findMovements = (oldArray, newArray, direction) => {
  let newArrayClone = structuredClone(newArray)

  const nZeros = newArrayClone.length - newArrayClone.filter(el => el).length

  if (direction === "left" || direction === "up") {
    newArrayClone = slideRowRight(newArrayClone)
  }

  const newArrayTracked = newArrayClone.map(el => {
    return { value: el, visited: false, slot: 0 }
  })

  let movements = []
  let merges = []

  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i] != 0) {
      for (let j = i; j < newArrayClone.length; j++) {
        if (oldArray[i] === newArrayClone[j] && newArrayTracked[j].slot < 1) {
          movements.push({ initialPosition: i, initialValue: oldArray[i], finalValue: newArrayClone[j], finalPosition: direction === "left" || direction === "up" ? j - nZeros : j })
          newArrayTracked[j].slot++
          newArrayTracked[j].visited = true
          break
        } else if (2 * oldArray[i] === newArrayClone[j] && newArrayTracked[j].slot < 2 && !newArrayTracked[j].visited) {
          movements.push({ initialPosition: i, initialValue: oldArray[i], finalValue: newArrayClone[j], finalPosition: direction === "left" || direction === "up" ? j - nZeros : j })
          newArrayTracked[j].slot++
          merges.push({ initialPosition: i, value: newArrayClone[j], finalPosition: direction === "left" || direction === "up" ? j - nZeros : j })
          break
        }
      }
    }
  }

  return { movements, merges }
}

const slideRowRight = (row) => {
  let arr = row.filter(val => val)
  let missing = 4 - arr.length
  let zeros = Array(missing).fill(0)
  arr = zeros.concat(arr)
  return arr
}

export {
  getTile,
  findMovements,
  TilesHelper,
}