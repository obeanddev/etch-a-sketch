const containerEl=document.querySelector("#container");
const COLORS=[
            "bisque","black","blue","brown",
            "cadetblue","cyan","darkseagreen",
            "gray","green","orange",
            "red","salmon","turquoise","yellow"
];
const lengthStyleRegEx=/(\d*\.?\d*)([a-z]*)/i;
function chooseColor()  {
    return COLORS[Math.floor(Math.random() *COLORS.length)];

}
function createSquare(sideLength) {
    const squareEl=document.createElement("div");
    squareEl.style.width=squareEl.style.height=sideLength;
    squareEl.classList.add("square");
    containerEl.appendChild(squareEl);
    

    
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
    const heightStrings = height.match(lengthStyleRegEx);
    if (heightStrings.length ===3) {
        //item at index [0] is the whole string
        //item at index[1] is the number of units
        squareSide=Number(heightStrings[1])/nSquareBySide + heightStrings[2] ;

        //item at index[2] is the unit;

    }
    for(let i=1; i <= nSquareBySide ** 2;i++) {
        createSquare(squareSide);
    }




}
function changeSquareColor(e) {
    console.log("relatedTarget",e.relatedTarget);
    if (    e.relatedTarget!==null &&
            e.relatedTarget.tagName !=="BODY" &&
            e.relatedTarget.tagName!=="HTML"              
    ) {
        e.relatedTarget.style.backgroundColor=chooseColor();
    }


}
//Doesn't work when the mouse comes from body
containerEl.addEventListener("mouseover",changeSquareColor);
containerEl.addEventListener("mousemove",(e)=>{
    /* we are going to work with the coordinates relative
     * to the parent div containerEl 
     * here there is no related target
    * 
    */ 
   
    const squareStyles=window.getComputedStyle(containerEl.firstChild);
    const squareSide=squareStyles.getPropertyValue("height");
    const squareStrings=squareSide.match( lengthStyleRegEx);
    
    if (squareStrings.length === 3) {
        let squareSideUnitLess = squareStrings[1];
        //get the size of the container
        //divide the container height by square height
        // then we have the number of square by side
        // we compare this values using maybe the % operator    
        // and with client x and y we calculate on which square we are,
        // then we can change square colors

    }



});
createGridOfSquares(20);