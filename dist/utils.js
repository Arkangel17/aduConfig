`use strict`;
// public edgeNailing = (obj, forceType, sheathing, thickness, fastener, spacing,dblSided) => {
//     let res = (dblSided) ? obj[forceType][sheathing][thickness][fastener][spacing] : 
//     0.5 * obj[forceType][sheathing][thickness][fastener][spacing];
//     console.log(res);
//     return res
// }  
export class Utils {
    // MISC FUNCTIONS 
    degrees(radians) {
        /**
        * @desc get radians and return degrees
        * @param degrees: number
        * @return the result of the convertion
        */
        return radians * 180 / Math.PI;
    }
    radians(degrees) {
        /**
    * @desc get degrees and return radians
    * @param degrees: number
    * @return the result of the convertion
    */
        return degrees * Math.PI / 180;
    }
    convertFromObjectToArray(obj) {
        let keys = Object.keys(obj);
        return keys.map((key) => {
            return obj[key];
        });
    }
    getPerfSwCoFactor() {
        /**
    * @desc
    * @param :
    * @return
    */
    }
    getSwAspectRatioFactor() {
        /**
    * @desc
    * @param :
    * @return
    */
    }
    calcDistanceToZero(num1, num2) {
        /**
    * @desc execute Math.abs on both numbers pick the greater (negative or positive)
    * @param num1: number, num2: number
    * @return number - greater number distance of zero negative or positive
    */
        const sig1 = (num1 < 0) ? -1 : 1;
        const sig2 = (num2 < 0) ? -1 : 1;
        const absNum1 = Math.abs(num1);
        const absNum2 = Math.abs(num2);
        const max = Math.max(absNum1, absNum2);
        return (max === absNum1) ? (absNum1 * sig1) : (absNum2 * sig2);
    }
    linearFormula(value, windCcRoofEffArea) {
        /**
* @desc
* @param value:
* @param windCcRoofEffArea:
* @return
*/
        const log10 = Math.log10(10);
        return Math.abs(((1 - value) / (log10 - Math.log10(500))) * (log10 - Math.log10(windCcRoofEffArea)) - 1);
    }
    linearInterpolation(windExp, windCcRoofEffArea) {
        /**
* @desc
* @param windExp:
* @param windCcRoofEffArea:
* @return
*/
        const a = (windExp === "A") ? this.linearFormula(1, windCcRoofEffArea) : 1;
        const b = (windExp === "B") ? this.linearFormula(.9, windCcRoofEffArea) : 1;
        const c = (windExp === "C") ? this.linearFormula(.8, windCcRoofEffArea) : 1;
        const d = (windExp === "D") ? this.linearFormula(.7, windCcRoofEffArea) : 1;
        const e = (windExp === "E") ? this.linearFormula(.6, windCcRoofEffArea) : 1;
        return {
            positive: {
                flat: { 1: 1, 2: 1, 3: 1, 4: d, 5: d },
                mansard: { 1: b, 2: b, 3: b, 4: d, 5: d },
                hip: { 1: b, 2: b, 3: b, 4: d, 5: d },
                monoslope: { 1: c, 2: c, 3: c, 4: d, 5: d },
            },
            negative: {
                flat: { 1: d, 2: d, 3: d, 4: c, 5: e },
                mansard: { 1: b, 2: c, 3: c, 4: c, 5: e },
                hip: { 1: b, 2: c, 3: c, 4: c, 5: e },
                monoslope: { 1: a, 2: b, 3: c, 4: c, 5: e },
            },
            overhang: { 1: a, 2: a, 3: b, 4: 1, 5: 1 },
        };
    }
}
export default Utils;
