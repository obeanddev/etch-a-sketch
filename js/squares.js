class Square {
    #element;
    #sideLength;
    #color
    constructor(container,sideLength,color) {
        this.#element = document.createElement("div");
        this.#element.style.width = this.element.style.height = sideLength;
    this.#element.classList.add("square");
    this.#element.setAttribute("data-num","9");
    this.#element.setAttribute("data-denom","10");
    container.appendChild(this.#element);
    this.#sideLength = sideLength;
    this.#color = color;
    }
    get side() {
        return this.sideLength;
    }
    get color() {
        return this.#color;
    }
    set color(newColor) {
        this.#color= newColor;
    }
}