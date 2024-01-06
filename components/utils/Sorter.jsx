/**
 * Table sorting helper utility
 */
class Sorter {
    constructor(args) {
    };
    
    descendingComparator(a, b, orderBy, direction_) {
      if ((orderBy in a) && b[orderBy] === null) {
        return 1;
      }
      if (a[orderBy] === null && (orderBy in b)) {
        return -1;
      }
    
      let a_value = a[orderBy];
      let b_value = b[orderBy];
    
      const direction = direction_ || 'lower';
    
      if (b_value < a_value) {
        return direction === 'higher' ? 1 : -1;
      }
      if (b_value > a_value) {
        return direction === 'higher' ? -1 : 1;
      }
      return 0;
    };
    
    getComparator(order, orderBy, direction) {
      return order === 'desc'
        ? (a, b) => this.descendingComparator(a, b, orderBy, direction)
        : (a, b) => -this.descendingComparator(a, b, orderBy, direction);
    };
  
  };
  
  export default Sorter;