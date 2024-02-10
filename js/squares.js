class Square {
    #element;
    #sideLength;
    #color;    
    #black
 
    constructor(container,sideLength,color) {
        this.#element = document.createElement("div");
        this.#element.style.width = this.element.style.height = sideLength;
       // this.#element.style.filter="brightness(1) grayscale(0)";
        this.#element.classList.add("square");
        container.appendChild(this.#element);
        this.#sideLength = sideLength;
        this.color = color;
        this.#element.style.backgroundColor=`color-mix(in srgb, black 0% ,${this.color})`;
        this.#black=0;
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
    
   
    darken() {
        if (this.#black <100) { this.#black+=10; }
        this.#element.style.backgroundColor=`color-mix(in srgb, black ${this.#black}% ,${this.color})`;
               
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