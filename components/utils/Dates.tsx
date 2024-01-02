
class Dates {
  constructor() {
  };

  /**
   * Find the closest date in an array of dates
   * @param  {string} dateToMatch a date to match YYYY-MM-DD
   * @param  {array} datesArray a date to match YYYY-MM-DD
   * @return {?string}
   */
  getClosestDate = (dateToMatch, datesArray) => {
    let closestDist: number | null = null;
    let closestDate = null;

    for (let i = 0; i < datesArray.length; i++) {
      const a = new Date(datesArray[i]).getTime();
      const b = new Date(dateToMatch).getTime();

      const dist = Math.abs(a - b);

      if (
        !closestDist ||
        dist < closestDist
      ) {
        closestDist = dist;
        closestDate = datesArray[i];
      }
    }

    return closestDate;
  };

};

export default Dates;