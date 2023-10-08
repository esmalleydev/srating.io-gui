class Arrayifer {
    constructor(args) {
    };
    

    /**
     * Shuffle / ranomize elements in an array
     * @param {Array} array The array to shuffle
     * @return Array
     */
    shuffle(array) {
      let currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    };

    /**
     * 
     * @param {Array} arr 
     * @param {number} n 
     * @param {number} r 
     * @param {number} index 
     * @param {Array} data 
     * @param {number} i 
     * @param {Array} results 
     * @returns Array
     */
    combination (arr, n, r, index, data, i, results) {
      if (index == r) {
        let result = [];
        for (let j=0; j<r; j++){
          result.push(data[j]);
        }
        results.push(result);
        return results;
      }
    
      if (i >= n) {
        return results;
      }
    
      data[index] = arr[i];
      this.combination(arr, n, r, index+1, data, i+1, results);
      this.combination(arr, n, r, index, data, i+1, results);
    
      return results;
    };

    /**
     * 
     * @param {Array} arr 
     * @param {number} n 
     * @param {number} r 
     * @returns Array
     */
    getCombinations(arr, n, r,) {
      let data = new Array(r);
    
      let results = [];
      results = this.combination(arr, n, r, 0, data, 0, results);
      return results;
    };
  
  
  };
  
  export default Arrayifer;