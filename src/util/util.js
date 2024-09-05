const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  const isArraysEqual = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }
  
  export {
    sleep,
    isArraysEqual
  }