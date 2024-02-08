class Square {
    #element;
    #sideLength;
    #color;
    #num;
    #denom;
    constructor(container,sideLength,color) {
        this.#element = document.createElement("div");
        this.#element.style.width = this.element.style.height = sideLength;
        
    this.#element.classList.add("square");
    // this.#element.setAttribute("data-num","9");
    // this.#element.setAttribute("data-denom","10");
    container.appendChild(this.#element);
    this.#sideLength = sideLength;
    this.color = color;
    this.#num=9;
    this.#denom=10;
    }
    get element() {
        return this.#element;
    }
    get side() {
        return this.#sideLength;
    }
    get color() {
        return this.#color;
    }
    set color(newColor) {
        this.#color= newColor;
        this.#element.style.backgroundColor= newColor;
    }
    get num() {
        return this.#num;
    }
    get coeff() {
        if (this.#denom> 0) {
            return this.#num / this.#denom;

        } else if (num > 0) {
            return this.#num;

        } else throw new RangeError("Can't calculate coefficient, both num and denom have invalid values");
         
    }
    decreaseCoeff() {
        this.#num--;
        this.#denom--;
    }

}

class SquareArray {
    #squares;
    constructor(container,nSquaresBySide,squareSide,color) {
        this.#squares=[];
        for (let i = 1; i <= nSquaresBySide ** 2; i++) {
            this.#squares.push( new Square(container,squareSide ,color));

        }
    }
     getSquare(element) {
        return this.#squares.filter(square=>{  
           
            return square.element===element});

    }
 

}
export {
    Square,
    SquareArray
};