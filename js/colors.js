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


class ColorError extends Error {
    constructor(message, ...options) {
        super(message, ...options);
        this.name = "ColorError";
    }
}
class ColorParseError extends ColorError {
    constructor(message, ...options) {
        super(message, ...options);
        this.name = "ColorParseError";
    }
}
class ColorInvalidValueError extends ColorError {
    constructor(message, ...options) {
        super(message, ...options);
        this.name = "ColorInvalidValueError";
    }
}
class ColorNotImplementedError extends ColorError {
    constructor(message, ...options) {
        super(message, ...options);
        this.name = "ColorNotImplementedError";
    }
}
// TODO implement conversions algorithm RGB <->HSL 
class Color {
    static getPercents(val, maxVal) {
        return (val / maxVal) * 100;
    }
    static isValidRGBColor(colorVal) {
        return !Number.isNaN(colorVal) && colorVal >= 0 && colorVal <= 255;
    }
    static isValidAlpha(alphaVal) {
        return !Number.isNaN(alphaVal) && alphaVal >= 0 && alphaVal <= 1;
    }
    get red() { return undefined; }
    get green() { return undefined; }
    //  set green(newGreen) { 
    //      throw new ColorNotImplementedOperation("You can't call green dirGreenly on a pure Color instance");
    // }
    get blue() { return undefined; }
    get alpha() { return undefined; }
    get hue() { return undefined; }
    get saturation() { return undefined; }
    get lightness() { return undefined; }
    rgbValue() { return undefined; }
    rgbValuePercents() { return undefined; }
    hslValue() { return undefined; }

}
let colorClasses = {};
colorClasses["rgb"] = class ColorRGB extends Color {
    #red;
    #green;
    #blue;
    #alpha;
    /**
     *  builds the class with the values defined by its parameter
     * @param values,   values[0] must be the value of the red component,resolves to an integer, range  : 0-255 
     *                  values[1] must be the green component,resolves to an integer, range: 0-255 
     *                  values[2] must be the blue component,resolves to an integer, range: 0-255 
     *                  values[3] must be alpha component,resolves to a real, in range: 0-1
     */
    constructor(...values) {
        super();
        const numValues = values.map((element) => Number(element));
        let colorArray = numValues.filter((element) => {
            return Color.isValidRGBColor(element);
        });
        if (colorArray.length == 3) {
            this.#red = colorArray[0];
            this.#green = colorArray[1];
            this.#blue = colorArray[2];
            this.#alpha = 1;
            if (numValues.length === 4) {
                if (Color.isValidAlpha(numValues[3])) {
                    this.#alpha = numValues[3];
                }
                else {
                    throw new ColorInvalidValueError(`Unexpected value for the alpha component, it is not in the real interval [0,1], alpha: =${numValues[3]}`);
                }
            }
        } else {
            const howMany = (colorArray.length < 3) ? "few" : "many";
            const message = `Too ${howMany} valid components for red, green and blue`;
            throw new ColorInvalidValueError(message);
        }
    }
    rgbValue() {
        if (this.#alpha) {
            return `rgb(${this.#red}, ${this.#green}, ${this.#blue},${$this.#alpha})`;
        } else {
            return `rgb(${this.#red}, ${this.#green}, ${this.#blue})`;
        }
    }
    rgbValuePercents() {
        const red = Color.getPercents(this.#red, 255);
        const green = Color.getPercents(this.#green, 255);
        const blue = Color.getPercents(this.#blue, 255);
        if (this.#alpha) {
            const alpha = Color.getPercents(this.#alpha, 1);
            return `rgb(${red}%, ${green}%, ${blue}%, ${alpha}%})`;
        } else {
            return `rgb(${red}%, ${green}%, ${blue}%})`;
        }
    }
    get red() { return this.#red; }
    get green() { return this.#green; }
    get blue() { return this.#blue; }
    get alpha() { return this.#alpha; }

};
colorClasses["hexa"] = class ColorHexa extends Color {
    #red;
    #green;
    #blue;
    #alpha;
    #colorRGB;
    constructor(...values) {
        super();
        let hexaStr = values.join("").toUpperCase();
        let hexaRegExp3_4 = /(?:(#?))(?<red>[A-F0-9]{1})(?<green>[A-F0-9]{1})(?<blue>[A-F0-9]{1})(?<alpha>[A-F0-9]{1})?/;
        let hexaRegExp6_8 = /(?:(#?))(?<red>[A-F0-9]{2})(?<green>[A-F0-9]{2})(?<blue>[A-F0-9]{2})(?<alpha>[A-F0-9]{2})?/;
        let hexaMatches = null;
        if (hexaRegExp3_4.test(hexaStr)) {
            hexaMatches = hexaStr.match(hexaRegExp3_4);
            this.#red = hexaMatches.groups.red.repeat(2);
            this.#green = hexaMatches.groups.green.repeat(2);
            this.#blue = hexaMatches.groups.blue.repeat(2);
            this.#alpha = "FF";
            if (hexaMatches.groups.alpha !== undefined) {
                this.#alpha = hexaMatches.groups.alpha.repeat(2);
            }
        } else if (hexaRegExp6_8.test(hexaStr)) {
            hexaMatches = hexaStr.match(hexaRegExp6_8);
            this.#red = hexaMatches.groups.red;
            this.#green = hexaMatches.groups.green;
            this.#blue = hexaMatches.groups.blue;
            this.#alpha = "FF";
            if (hexaMatches.groups.alpha !== undefined) {
                this.#alpha = hexaMatches.groups.alpha;
            }


        } else {
            throw new ColorParseError("The value is not a corect hexadecimal representation of a color " + hexaStr);
        }
        this.#colorRGB = new colorClasses["rgb"](
            this.red,
            this.green,
            this.blue,
            this.alpha);
        console.log(hexaMatches);
    }
    get red() {
        return parseInt(this.#red, 16);
    }
    get green() {
        return parseInt(this.#green, 16);
    }
    get blue() {
        return parseInt(this.#blue, 16);
    }
    get alpha() {
        return (this.#alpha) ? parseInt(this.#alpha, 16) / 255 : undefined;
    }
    rgbValue() { return this.#colorRGB.rgbValue(); }
    rgbValuePercents() { return this.#colorRGB.rgbValuePercents(); }
    /*darken(coeff) {

    }
    lighten(coeff) {

    }*/
};
colorClasses["hsl"] = class ColorHSL extends Color {
    #hue;
    #saturation
    #lightness;
    #alpha;
    static isValidHue(hueInDeg) {
        return !Number.isNaN(hueInDeg) && hueInDeg >= 0 && hueInDeg <= 360;
    }
    static isValidSaturation(sat) {
        return !Number.isNaN(sat) && sat >= 0 && sat <= 100;
    }
    static isValidLightness(lightness) {
        return !Number.isNaN(lightness) && lightness >= 0 && lightness <= 100;
    }
    constructor(...values) {
        super(...values);
        const numValues = values.map((element) => Number(element));
        if (numValues.length === 3 || numValues.length === 4) {
            if (ColorHSL.isValidHue(numValues[0])) {
                this.#hue = numValues[0];
            } else {
                throw new ColorInvalidValueError("Hue cannot must be between 0 and 360 degree");
            }
            if (ColorHSL.isValidSaturation(numValues[1])) {
                this.#saturation = numValues[1];
            } else {
                throw new ColorInvalidValueError("Saturation must be a percentage between 0 and 100%");
            }
            if (ColorHSL.isValidLightness(numValues[2])) {
                this.#lightness = numValues[2];
            } else {
                throw new ColorInvalidValueError("Lighness must be a  percentage between 0 and 100%");
            }
            this.#alpha = 1;
            if (numValues.length === 4) {

                if (Color.isValidAlpha(numValues[3])) {
                    this.#alpha = numValues[3];
                } else {
                    throw new ColorInvalidValueError("alpha must be a real in the interval [0-1]");

                }
            }
        } else {
            const howMany = numValues.length < 3 ? "few" : "many";
            const message = `Too ${howMany} componenents for hue, saturation, lighness and optionnaly alpha`;
            throw new ColorInvalidValueError(message);
        }
    }
    get hue() {
        return this.#hue;
    }
    get saturation() {
        return this.#saturation;
    }
    get lightness() {
        return this.#lightness;
    }
    get alpha() {
        return this.#alpha;
    }
    hslValue() {
        if (this.#alpha) {
            return `hsl(${this.#hue}deg, ${this.#saturation}%, ${this.#lightness}%,${this.#alpha})`;

        } else {
            return `hsl(${this.#hue}deg, ${this.#saturation}%, ${this.#lightness}%)`;

        }

    }
    darken(coeff) {
        let result = this.#lightness * ( 1 - coeff) ; 
        result = result >= 0 ? result : 0;
        this.#lightness = result;
    }
    lighten(coeff) {
        let result = this.#lightness * ( 1 +coeff);
        result = result <= 100 ? result : 100;
        this.#lightness = result;
    }
}
class ColorFactory {
    constructor(namespace, ...values) {
        return new colorClasses[namespace](...values);
    }
}

let defaultColor = "rgb(217, 217, 217)";
//TODO improve parsing algorithm
// String.match returns an array!!!!!!!
// One has to use methods of RegExp to get the results he want
function parseColorString(colorString) {
    let result = {};
    if (colorString.startsWith("#")) {
        result = new ColorFactory("hexa", colorString);
    } else {
        const workColString = colorString.trim();
        const idxOpenParen = workColString.indexOf("(");
        const idxCloseParen = workColString.lastIndexOf(")");
        if (idxOpenParen == -1) {
            if (idxCloseParen == -1) {
                // workColString is probably a colorName
            }  else {
                throw ColorParseError(`The sring has unmatched parentheses: ${workColString}`);
            }
        } else {
            if (idxOpenParen !== -1 && idxCloseParen !== workColString.length - 1) {
                throw new ColorParseError("Once trimmed, the last closing parenthesis must be at the end of the String");
            }
            const funcName = workColString.substring(0, idxOpenParen);
            const EXPECTED_NAMES = ["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch", "color"];
            if (!EXPECTED_NAMES.includes(funcName)) {
                throw new ColorParseError(`The function ${funcName} is not a known function color`);

            }
            let stack = [];
            let i = idxOpenParen + 1;
            let top;
            stack.push(workColString[idxOpenParen]);
            while (i < workColString.length) {
                console.log(workColString , i);
                switch (true) {
                    case /\d/.test(workColString[i]):
                        if (stack.length >0){
                            top=stack[length -1];
                            switch (true) {
                                case /\d+\.?\d*/.test(top):
                                    stack[length-1]= top + "" + workColString[i];
                                    break;
                                case /\s/.test(top):
                                    stack.push(workColString[i]);
                                    break;    
                                case /[A-Za-z]+-?/.test(top):
                                    stack[length-1]= top + "" + workColString[i];
                                    break;
                                case /-/.test(top):
                                    stack[length-1]= top + "" + workColString[i];
                                    break;
                                case /\(/.test(top):
                                    stack.push(workColString[i]);
                                    break;                                 
                                default:
                                    throw new ColorParseError(`unexpected Token ${workColString[i]}after ${top}` );
                                    //break;

                                
                            }
                        } else { // stack.length=0
                            stack.push(workColString[i]);


                        }
                        break;

                    case /\./.test(workColString[i]):
                        if (stack.length>0) {
                            top=stack[stack.length - 1];
                            switch (true) {
                                case /\d+/.test(top):
                                    stack[length-1] = top +"" + workColString[i];
                                    break;
                                case /\(|\s+/.test(top):                                
                                    stack.push(workColString[i]);
                                    break;
                                default:
                                    throw new ColorParseError(`unexpected token ${workColString[i]} after ${top}`);
                                
                            }
                        }
                        break;
                    case /-/.test(workColString[i]):
                        if (stack.length >0) {
                            top = stack[stack.length -1];
                            switch(true) {
                                case /[a-zA-Z]+/.test(top):
                                    stack[stack.length -1]+="" + workColString[i];
                                break;
                                case /\s+/.test(top):
                                    stack.push(workColString[i]);
                                default:
                                    throw new ColorParseError(`unexpected token ${workColString[i]} after ${top}`);
                                    //break;
                            }

                        } 
                    break;
                    case /%/.test(workColString[i]):
                        if (stack.length >0) {
                            top= stack[stack.length -1];
                            if (/\d+(.\d*)?/.test(stack[length -1])) {
                                stack.push(workColString[i]);
                            } else {
                                throw new ColorParseError(`unexpected token ${workColString[i]} after ${top}`);
                            }
                        }
                        break;
                    case /,/.test(workColString[i]):
                        break;
                    case /\s/.test(workColString[i]):
                        break;
                    case /\//.test(workColString[i]):
                        break;
                    case /\+|\*/.test(workColString[i]):
                        break;
                    case /[A-Za-z]+/.test(workColString[i]):
                        break;
                    case /\(/.test(workColString[i]):
                        break;
                    case /\)/.test(workColString[i]):
                        break;
                
                    default:
                        throw new ColorParseError(
                            `Unexpected character : ${workColString[i]} in ${workColString}`);
                       // break;

                }
                i++;
            }
        }

    }/*if (colorString.startsWith("rgb")) {
        let arrayRGB = colorString.split(/\(|,|\)/);
        console.log(arrayRGB);
        if (arrayRGB[1] === "") {
            arrayRGB.splice(1,1);
        }
        if (arrayRGB[arrayRGB.length - 1] === "") {
            arrayRGB.pop();
        }
        if (arrayRGB.length === 4 || arrayRGB.length === 5) {
            result = new ColorFactory("rgb",
                arrayRGB[1].trim(),
                arrayRGB[2].trim(),
                arrayRGB[3].trim(),
                arrayRGB.length === 5 ? arrayRGB[4].trim() : 1);
            
            console.log(result);
        }*/

    return result;
}
function setDefaultColor(newColor) {
    if (parseColorString(newColor)) {
        defaultColor = newColor;
    }
    /*let colHexa = parseColorString("#5ADE");    //new ColorFactory("hexa", "5", "A", "D", "E");
    console.log("colHexa");
    console.log(colHexa.red);*/
}
function getDefaultColor() {
    return defaultColor;
}
/**
 * @returns a random rgb color
 */
function chooseRandomColor(oldBackroundColor,coeff) {
    const red = getRandomInt(0, 256);
    const green = getRandomInt(0, 256);
    const blue = getRandomInt(0, 256);
    return `rgb(${red},${green},${blue})`;
}
function darkenColor(oldBackgroundColor,coeff) {

}
function whiteBlackColor(oldBackgroundColor,coeff) {
    return chooseRandomColor(oldBackgroundColor);
}
function blackColor(oldBackgroundColor,coeff) {
    return "rgb(0,0,0)";
}
function eraseColor(oldBackgroundColor,coeff) {
    return getDefaultColor();


}
const MODE_RANDOM_COLOR = 1;
const MODE_DARKENING = 2;
const MODE_WHITE_BLACK = 3;
const MODE_BLACK = 4;
const MODE_ERASE = 5;

function selectColorMode(mode) {
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
    getDefaultColor, setDefaultColor,
    selectColorMode,
    Color,
    ColorError,
    ColorInvalidValueError,
    ColorNotImplementedError,
    ColorParseError
};