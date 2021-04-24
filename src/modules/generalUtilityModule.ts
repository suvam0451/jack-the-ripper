/** WARNING: This function needs to be updated to be able to handle
 *  numbers other than +1/-1
 */
export const CircularOffset = (curr: number, ceil: number, offset: number) => {
    console.log("offset is", offset);
    
    curr += offset;
    if(curr < 0) return ceil - 1
    else if(curr > ceil) return 0

    console.log(curr);
    return curr
}