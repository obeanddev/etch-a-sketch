class Square {
    #element;
    #sideLength;
    #color;
    #multiplierNum;
    #multiplierDenom;
    #coeff;
    #grayScale;
    #brightness;
    constructor(container,sideLength,color) {
        this.#element = document.createElement("div");
        this.#element.style.width = this.element.style.height = sideLength;
        this.#element.style.filter="brightness(1) grayscale(0)";
        this.#element.classList.add("square");
        container.appendChild(this.#element);
        this.#sideLength = sideLength;
        this.color = color;
        this.#multiplierNum=90; this.#multiplierDenom=100;
        this.#coeff=40/100;
        this.#grayScale=0;
        this.#brightness=1;
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
    
    get coeff() {
      return this.#coeff;
         
    }
    increaseCoeff() {
        
        this.#coeff*=this.#multiplierNum/this.#multiplierDenom;
        if (this.#grayScale <0.7){
            this.#grayScale+=0.0250;
        } else {
            this.#grayScale=1;
        }
        if (this.#brightness >0.05) {
            this.#brightness-=0.05;
            
        } else {
            this.#brightness=0;
        }
        this.#element.style.filter=`brightness(${this.#brightness}) grayscale(${this.#grayScale})`;
        this.#multiplierNum-=0.1;
      //  this.#multiplierDenom-=0.3;

       

        
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