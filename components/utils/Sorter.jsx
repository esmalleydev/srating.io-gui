/**
 * Table sorting helper utility
 */
class Sorter {
    constructor(args) {
    };
    
    descendingComparator(a, b, orderBy) {
        if (a[orderBy] && !b[orderBy]) {
          return 1;
        }
        if (!a[orderBy] && b[orderBy]) {
          return -1;
        }
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    };
    
    getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => this.descendingComparator(a, b, orderBy)
        : (a, b) => -this.descendingComparator(a, b, orderBy);
    };
  
  };
  
  export default Sorter;