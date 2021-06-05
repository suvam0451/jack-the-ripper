/** WARNING: This function needs to be updated to be able to handle
 *  numbers other than +1/-1
 */
export const CircularOffset = (curr: number, max: number, isIncrement: boolean) => {
  if (curr == max - 1) return 0;
  else if (curr == 0) return max - 1;
  else return isIncrement ? curr + 1: curr -1;
};
