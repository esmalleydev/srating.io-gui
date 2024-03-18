// todo write unit tests for closest date function to test different scenarios

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

      // todo this will pick the future date, assuming it was sorted correctly in the array
      // need to add time to these dates, to correctly pick the closest
      // ex: I have games on 2024-03-17 and 2024-03-19, if the dateToMatch is 2024-03-18, both 17th and 19th have the same dist. It should pick 19th?
      if (
        closestDist === null ||
        dist <= closestDist
      ) {
        closestDist = dist;
        closestDate = datesArray[i];
      }
    }

    return closestDate;
  };

  getToday = () => {
    const formatYmd = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1);
      const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate();
    
      return year + '-' + month + '-' + day;
    };
    
    const today = new Date(new Date().toLocaleString('en-US', {'timeZone': 'America/New_York'}));
  
    return formatYmd(today);
  };

};

export default Dates;