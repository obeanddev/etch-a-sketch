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
        if (colorArray.length == 3 || colorArray.length==4)  {
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
            const howMany = (colorArray.length < 3 || colorArray.length <4) ? "few" : "many";
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
    get toHexa() {
        return '#' + Math.round(this.#red).toString(16).padStart(2,"0") + 
                Math.round(this.#green).toString(16).padStart(2,"0") +
                Math.round(this.#blue).toString(16).padStart(2,"0") +
                Math.round(this.#alpha * 255).toString(16).padStart(2,"0");
    }

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
                throw new ColorInvalidValueError("Hue must be between 0 and 360 degree");
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
        let result = Math.abs(this.#lightness * (  coeff) ); 
        result = result > 0 ? result : 0;
        this.#lightness = result;
    }
    lighten(coeff) {
        let result = this.#lightness * ( 1 +coeff);
        result = result <= 100 ? result : 100;
        this.#lightness = result;
    }
    toRGB() {
        //R, G, B, S, et L sont exprimées dans l'intervalle [0, 1].
        // hue H est exprimée dans l'intervalle [0, 360°].
        let hue= this.hue % 360;
        if (hue <0) { hue+=360;}
        let lightness = this.lightness /100;
        let saturation = this.saturation /100;
        //see https://drafts.csswg.org/css-color/#hsl-to-rgb
        function f(n) {
            let k= (n+ hue/30) %12;
            let a= saturation * Math.min(lightness, 1 - lightness);
            return lightness -a *(Math.max(-1, Math.min(k - 3 , 9 - k, 1)));

        }
        return new colorClasses["rgb"](f(0) *255,f(8) *255 ,f(4) *255);



        /*let c = (1 -Math.abs(2 * lightness -1)) * saturation; 
        let hPrime = hue / 60;
        let x =  c * ( 1 - Math.abs( (hPrime % 2) - 1));
        let m= lightness - 0.5 * c;
        let rgbPrimes = [0,0,0];
        if (hPrime >= 0 && hPrime < 1) {
            rgbPrimes=[c,x,0];
        } else if ( hPrime < 2) {
            rgbPrimes=[x,c, 0];
        } else if (hPrime < 3) {
            rgbPrimes=[0,c,x];
        } else if (hPrime < 4) {
            rgbPrimes=[0,x,c];            
        } else if (hPrime < 5) {
            rgbPrimes=[x,0,c];
        } else {
            rgbPrimes=[c,0,x];
            
        }
        
        return new colorClasses["rgb"](Math.round(Math.abs((rgbPrimes[0]) *255 +m)) ,Math.round(Math.abs( (rgbPrimes[1] +m ) *255 )) , Math.round(Math.abs( (rgbPrimes[2] +m ) *255 ))    ,this.alpha );
        */




    }
}
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
        //console.log(hexaMatches);
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
    
};

class ColorFactory {
    constructor(namespace, ...values) {
        return new colorClasses[namespace](...values);
    }
}

/**
 * 
 * @param {*} red red component expressed as an number between  0 and 255 included
 * @param {*} green green component expressed as an number between  0 and 255 included
 * @param {*} blue blue component expressed as an number between  0 and 255 included
 * @param {*} alpha component expressed as a number in the interval [0,1]
 * @returns a Color expressed as an hsl form
 */
function hslFromRgb(red,green,blue,alpha=1){
    //see https://drafts.csswg.org/css-color/#rgb-to-hsl
    red = Color.getPercents(red,255)/100;
    green= Color.getPercents(green,255)/100;
    blue = Color.getPercents(blue,255)/100;    
    let max=Math.max(red,green,blue);
    let min = Math.min(red,green,blue);
    let chroma= max - min;
    let huePrime;
    let hue;
    let saturation;
    let lightness = 0.5 *  (max + min);
    if (chroma!==0) {
        if (max==red) {
            huePrime = ( (green - blue) / chroma ) + (green < blue)?6:0;
        } else if (max==green) {
            huePrime = ( (blue -red)/chroma + 2 )  ;
        } else { //max is blue
            huePrime = ((red - green)/ chroma + 4)  ;

        }
        
        hue = 60 * Math.abs(huePrime);
        
        saturation = (lightness ==0 || lightness == 1 )
            ?  0 
            :  (max - lightness) / Math.min(lightness, 1 - lightness);
        //chroma /(1 - Math.abs(2 * lightness - 1));
        
    } else {
        hue= 0;
        saturation = 0;

    }
    return new ColorFactory("hsl",hue,Math.round(Math.abs(saturation) * 100),lightness * 100,alpha);


}
let defaultColor = "#FFFFFF";
//TODO improve parsing algorithm
// String.match returns an array!!!!!!!
// One has to use methods of RegExp to get the results he want
function parseColorString(colorString) {
    let result = {};
    if (colorString.startsWith("#")) {
        result = new ColorFactory("hexa", colorString);
    } else {
        throw new ColorNotImplementedError("At this time the function only works for hexadecimal color strings");
    }
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
    const red = getRandomInt(0, 256).toString(16).padStart(2,"0");
    const green = getRandomInt(0, 256).toString(16).padStart(2,"0");
    const blue = getRandomInt(0, 256).toString(16).padStart(2,"0");
    const alpha= getRandomInt(0, 256).toString(16).padStart(2,"0");
    return `#${red}${green}${blue}${alpha}`;
}
function darkenColor(oldBackgroundColor,coeff) {
    let hexColor = parseColorString(oldBackgroundColor);
    let alpha= hexColor.alpha === undefined?1:hexColor.alpha;
    let hslColor = hslFromRgb(hexColor.red,hexColor.green, hexColor.blue,alpha);
    hslColor.darken(coeff);
    return hslColor.toRGB().toHexa;

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