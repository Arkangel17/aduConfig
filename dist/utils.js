"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
`use strict`;
class Utils {
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
    setInput(inputs, flat) {
        /**
          * @desc updates inputs object values accoring to types
          * @param object input:object, flat?: boolean
          * @return object - inputs with serialize values
        */
        const keys = Object.keys(inputs);
        keys.forEach((key, index) => {
            const currentInput = inputs[key];
            const val = parseFloat(currentInput);
            if (currentInput === "undefined") {
                inputs[key] = undefined;
            }
            if (!isNaN(val)) {
                inputs[key] = val;
            }
            else if (currentInput === "true" || currentInput === "false") {
                inputs[key] = true;
            }
            else if (Array.isArray(currentInput)) {
                inputs[key] = currentInput;
            }
            else {
                inputs[key] = inputs[key];
            }
        });
        return inputs;
    }
    calcDistanceToZero(num1, num2) {
        /**
        * @desc execute Math.abs on both numbers pick the greater (negative or positive)
        * @param num1: number
        * @param num2: number
        * @return number - greater number distance of zero negative or positive
        */
        const sig1 = (num1 < 0) ? -1 : 1;
        const sig2 = (num2 < 0) ? -1 : 1;
        const absNum1 = Math.abs(num1);
        const absNum2 = Math.abs(num2);
        const max = Math.max(absNum1, absNum2);
        return (max === absNum1) ? (absNum1 * sig1) : (absNum2 * sig2);
    }
    ceilPrecise(number, significance) {
        /**
          * @desc execute Math.ceil and apply times number to create index on matrix
          * @param number: number, significance: number
          * @return number - formula result
        */
        return (Math.ceil(number / significance)) * significance;
    }
    floorPrecise(number, significance) {
        /**
          * @desc execute Math.floor and apply times number to create index on matrix
          * @param number: number, significance: number
          * @return number - formula result
        */
        return (Math.floor(number / significance)) * significance;
    }
    cubicFeetConverter(number, units) {
        /**
          * @desc execute 0.04 multiplier to convert cubic feet to cubic yard or meter
          * based on string input param
          * @param number: number, Units: 'yards' || 'meters'
          * @return number - formula result
        */
        const unitObj = {
            'yards': 0.04,
            'meters': 0.03
        };
        return number * unitObj[units];
    }
    returnMaxNum(arr) {
        let repo = [];
        arr.forEach((item, index) => {
            let sig = (item < 0) ? -1 : 1;
            let num = item * sig;
            repo.push(num);
        });
        const max = Math.max.apply(null, repo);
        const maxIndex = repo.indexOf(max);
        return arr[maxIndex];
    }
    getGreaterForce(arr1, arr2, omega = 1) {
        return arr1.map((item, index) => {
            const current = arr2[index];
            if (item.force * omega > current.force) {
                item.colForce = item.force * omega;
                return item;
            }
            else {
                current.colForce = current.force;
                return current;
            }
        });
    }
}
exports.Utils = Utils;
exports.default = Utils;
