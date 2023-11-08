const containerEl=document.querySelector("#container");
const COLORS=[
            "bisque","black","blue","brown",
            "cadetblue","cyan","darkseagreen",
            "gray","green","orange",
            "red","salmon","turquoise","yellow","white"
];
function chooseColor()  {
    return COLORS[Math.floor(Math.random() *COLORS.length)];

}
function createSquare(sideLength) {
    const squareEl=document.createElement("div");
    squareEl.style.width=squareEl.style.height=sideLength;
    squareEl.classList.add("square");
    containerEl.appendChild(squareEl);
    squareEl.addEventListener("click",(e)=> {
       squareEl.style.backgroundColor=chooseColor();

    });

    
}
function createGridOfSquares(nSquareBySide) {
    const containerStyles= window.getComputedStyle(containerEl);
    const height = containerStyles.getPropertyValue("height");
    let squareSide="100px";
    /* height contains the unit of measure
     * we search for a pattern of the form: 
     *  possibly empty string of digits followed by an eventual decimal point
     * followed by a possibly empty string of digits
     * followed by a unit of measure(px, pt, ...) 
    */
    const heightMatch = height.match(/(\d*\.?\d*)([a-z]*)/i);
    if (heightMatch.length ===3) {
        //item at index [0] is the whole string
        //item at index[1] is the number of units
        squareSide=Math.floor(Number(heightMatch[1])/nSquareBySide) + heightMatch[2] ;

        //item at index[2] is the unit;

    }
    for(let i=1; i <= nSquareBySide ** 2;i++) {
        createSquare(squareSide);
    }




}
createGridOfSquares(10);