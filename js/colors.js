/** * 
 * @param {Number} min lower bound, if it's not an integer, will be raised to the next integer
 * @param {Number} max greater bound, if it's not an integer, will be lowered to the previous integer
 * @returns {Number} 
 * @description returns a integer value between min included 
 * and max excluded
 */
function getRandomInt(min, max) {
    /* see MDN page on Math.random */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
/**
 * @returns a random rgb color
 */
function chooseRandomColor(oldBackroundColor) {
    const red = getRandomInt(0, 256);
    const green = getRandomInt(0, 256);
    const blue = getRandomInt(0, 256);
    return `rgb(${red},${green},${blue})`;
}
function darkenColor(oldBackgroundColor) {

}
function whiteBlackColor(oldBackgroundColor) {
    console.log(oldBackgroundColor);
    return chooseRandomColor(oldBackgroundColor);
}
function blackColor(oldBackgroundColor) {
return "rgb(0,0,0)";
}
function eraseColor(oldBackgroundColor) {
     

}
const MODE_RANDOM_COLOR=1;
const MODE_DARKENING=2;
const MODE_WHITE_BLACK=3;
const MODE_BLACK=4;
const MODE_ERASE=5;

function selectColorMode(mode){
switch (mode) {
    case MODE_RANDOM_COLOR: return chooseRandomColor;        
    case MODE_DARKENING: return darkenColor;        
    case MODE_BLACK: return blackColor;    
    case MODE_WHITE_BLACK: return whiteBlackColor;
}
}
export {    
    MODE_RANDOM_COLOR,
    MODE_DARKENING,
    MODE_WHITE_BLACK,
    MODE_BLACK,
    MODE_ERASE,
    /*chooseRandomColor,
    darkenColor,
    whiteBlackColor,
    blackColor,
    eraseColor,*/
    selectColorMode
};