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
 * 
 * @returns a random rgb color
 */
function chooseRandomColor() {

    const red = getRandomInt(0, 256);
    const green = getRandomInt(0, 256);
    const blue = getRandomInt(0, 256);
    return `rgb(${red},${green},${blue})`;

}
function createSquare(container, sideLength) {
    const squareEl = document.createElement("div");
    squareEl.style.width = squareEl.style.height = sideLength;
    squareEl.classList.add("square");
    container.appendChild(squareEl);
    return squareEl;
}
/**
 * @param {*} element the element of which we want to obtain a property
 * @param {*} propertyName the propertName of a length property
 * @returns if it an array of two values then it is [unitLessLenght,lenghtUnit],
 * else the first element is the whole styleLength string
 */
function splitStyleLength(element, propertyName) {
    /* styleLength contains the unit of measure
     * we search for a pattern of the form: 
     * possibly empty string of digits followed
     * by an eventual decimal point
     * followed by a possibly empty string of digits
     * followed by a unit of measure(px, pt, ...) 
    */
    const styleLengthRegEx = /(\d*\.?\d*)([a-z]*)/i;
    const elementStyles = window.getComputedStyle(element);
    const propertyValue = elementStyles.getPropertyValue(propertyName);
    const styleLengthArray = propertyValue.match(styleLengthRegEx);
    if (styleLengthArray.length === 3) {
        // styleLengthArray[0] is the whole string
        // styleLengthArray[1] is the number of units
        // styleLengthArray[2] is the unit;
        return styleLengthArray.slice(1);
    } else {
        return styleLengthArray;
    }
}
/**
 * 
 * @param {*} container the element in which we want to create a square grid
 * @param {*} nSquareBySide the number of square by side, must be an integer
 * @returns an array of two values then it is [unitLessLenght,lenghtUnit],
 *          when there is more elements in the array, the first element is the whole styleLength string
 */
function getSquareSide(container, nSquareBySide) {
    let squareSide = "100px";
    const heightStrings = splitStyleLength(container, "height");
    if (heightStrings.length === 2) {
        //item at index [0] is the whole string
        //item at index[1] is the number of units
        squareSide = Number(heightStrings[0]) / nSquareBySide + heightStrings[1];
    }
    return squareSide;
}
function getOffsetLeftTop(fromEl, toEl) {
    let el = toEl;
    let offsets = { offsetLeft: el.offsetLeft, offsetTop: el.offsetTop };
    while (
        el &&
        el.offsetParent !== undefined &&
        el.offsetParent !== null
    ) {
        el = el.offsetParent;
        if (el) {
            offsets.offsetLeft += el.offsetLeft;
            offsets.offsetTop += el.offsetTop;
        }
    }
    return offsets;
}

function createGridOfSquares(container, nSquareBySide) {
    const squareSide = getSquareSide(container, nSquareBySide);
    let squareEl;
    let row;
    let col;
    for (let i = 1; i <= nSquareBySide ** 2; i++) {
        squareEl = createSquare(container, squareSide);
        row = Math.floor((i - 1) / nSquareBySide);
        col = (i - row * nSquareBySide - 1) % nSquareBySide;
        squareEl.setAttribute("data-row", row);
        squareEl.setAttribute("data-col", col);
    }
}

function changeSquareColor(squareEl) {
    if (squareEl !== null &&
        squareEl.tagName !== "BODY" &&
        squareEl.tagName !== "HTML"
    ) {
        squareEl.style.backgroundColor = chooseRandomColor();
    }
}
const containerEl = document.querySelector("#container");
let previousVisitedSquareEl = null;

containerEl.addEventListener("mouseleave", (e) => {
    previousVisitedSquareEl = null;
});
/* containerEl.addEventListener("click", (e) => {
    console.log(e);
}) */
containerEl.addEventListener("mousemove", (e) => {
    /* we are going to work with the coordinates relative
     * to the parent div containerEl 
     * here there is no related target    * 
    */
    const squareSideArray = splitStyleLength(containerEl.firstChild, "height");
    const containerLengthArray = splitStyleLength(containerEl, "height");
    if (squareSideArray.length === 2 && containerLengthArray.length === 2) {
        let squareSideUnitLess = squareSideArray[0];
        let squareSideUnits = squareSideArray[1];
        let containerLengthUnitLess = containerLengthArray[0];
        let containerLengthUnits = containerLengthArray[1];
        if (squareSideUnits === containerLengthUnits) {
            let nSquareBySide = Math.floor(containerLengthUnitLess / squareSideUnitLess);
            /* offsetX, offsetY are relative to the target element 
             * that is a square div here
             * and that 's not what we want
             * we want values relative to the container 
             */
            const offsets = getOffsetLeftTop(document.querySelector("body"), containerEl);
            let row = Math.floor((e.pageY - (offsets.offsetTop)) / squareSideUnitLess);
            let col = Math.floor((e.pageX - (offsets.offsetLeft)) / squareSideUnitLess);
            let visitedSquareElOld;
            let visitedSquareEl;
            let element = document.elementFromPoint(e.x, e.y);

            if (element !== null && element!== undefined && element.classList.contains("square")) {
                visitedSquareEl = element;
            }

            if (visitedSquareEl === null || visitedSquareEl === undefined) {
             //   console.log("still null");
                return;
            }
            //we calculate on which square we are on
            const squareNumber = row * (nSquareBySide) + (col) + 1;
            visitedSquareElOld = containerEl.querySelector(
                `div:nth-of-type(${squareNumber}`);

            if (visitedSquareEl.classList.contains("square")) {
                if (previousVisitedSquareEl === null) {
                    previousVisitedSquareEl = visitedSquareEl;
                    changeSquareColor(visitedSquareEl);
                } else {
                    let sameNode = previousVisitedSquareEl.isSameNode(visitedSquareEl)
                    if (!sameNode) {
                        changeSquareColor(visitedSquareEl);
                        previousVisitedSquareEl = visitedSquareEl;
                        if (visitedSquareEl === visitedSquareElOld) {
                            visitedSquareEl.innerText = squareNumber;
                        }
                    }
                }
            } //end if it's a square
        } //end if units are the same
    }//end if the arrays returned by splitStyleLength are of length 2
});

createGridOfSquares(containerEl, 20);