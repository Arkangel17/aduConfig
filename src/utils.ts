import DoubleBar from './controllers/bldgTypeSpecMeths/doubleBar';
import SingleBar from './controllers/bldgTypeSpecMeths/singleBar';
import BldgTypeMeths from './controllers/bldgTypeMeths';

export class Utils {
  private bldgTypeMeths: any;
  private doubleBar: any;
  private singleBar: any;

  constructor() {
    this.bldgTypeMeths = new BldgTypeMeths();
    this.doubleBar = new DoubleBar();
    this.singleBar = new SingleBar();
  }

  /**
    * @desc updates inputs object values accoring to types
    * @param object input:object, flat?: boolean
    * @return object - inputs with serialize values
  */
  public setInput(inputs: any, flat?: boolean): any {
    const keys = Object.keys(inputs);

    keys.forEach((key, index) => {
      const currentInput = inputs[key];
      const val = parseFloat(currentInput);

      if (currentInput === "undefined") {
        inputs[key] = undefined;
      }

      if (!isNaN(val)) {
        inputs[key] = val;
      } else if (currentInput === "true" || currentInput === "false") {
        inputs[key] = (currentInput === "true");
      } else if (Array.isArray(currentInput)) {
        inputs[key] = currentInput;
      } else {
        inputs[key] = inputs[key];
      }
    });
    
    return inputs;
  }

   /**
    * @desc execute pick the greater from an array of (negative or positive) values
    * @param arr: array of (+/-) numbers
    * @return number - number with max distance from zero
  */
  
  public returnMaxNum(arr: any): any {
    let repo = [];

    arr.forEach((item, index)=>{
      let sig = (item < 0) ? -1 : 1;
      let num = item * sig;
      repo.push(num);
    });

    const max = Math.max.apply(null, repo);
    const maxIndex = repo.indexOf(max);

    return arr[maxIndex]
  };

  /**
    * @desc execute Math.abs on both numbers pick the greater (negative or positive)
    * @param num1: number, num2: number
    * @return number - greater number distance of zero negative or positive
  */
  public calcDistanceToZero(num1: number, num2: number): any {
    const sig1 = (num1 < 0) ? -1 : 1;
    const sig2 = (num2 < 0) ? -1 : 1;
    const absNum1 = Math.abs(num1);
    const absNum2 = Math.abs(num2);

    const max = Math.max(absNum1, absNum2);

    return (max === absNum1) ? (absNum1 * sig1) : (absNum2 * sig2);
  }

  /**
    * @desc execute Math.ceil and apply times number to create index on matrix
    * @param number: number, significance: number
    * @return number - formula result
  */
  public ceilPrecise(number: number, significance: number): any {
    return (Math.ceil(number / significance)) * significance;
  }

  /**
    * @desc execute 0.04 multiplier to convert cubic feet to cubic yard or meter
    * based on string input param
    * @param number: number, Units: 'yards' || 'meters'
    * @return number - formula result
  */
  public cubicFeetConverter(number: number, units: string){
    const unitObj = {
      'yards': 0.04,
      'meters': 0.03
    }
    return  number * unitObj[units]
  }

  /**
    * @desc execute Math.floor and apply times number to create index on matrix
    * @param number: number, significance: number
    * @return number - formula result
  */
  public floorPrecise(number: number, significance: number): any {
    return (Math.floor(number / significance)) * significance;
  }

  public calcAvg(arr: any, property: string): any {
    let max = 0;
    let sum = 0;
    let lg = 0;

    arr.forEach((item, index) => {
      const num = Math.abs(item[property]);

      if (num > max) { max = num }

      sum += num;

      if (num) {
        lg++;
      }
    });

    const avg = sum / lg;
    const res = max / avg;

    return {
      max,
      avg,
      res,
    };
  }

  public getGreaterLens(arr1: any, arr2: any, flag: boolean = false, last?: boolean): any {
    return arr1.map((item, index) => {
      const current = arr2[index];

      const force = (flag) ? item.force : item;
      const comp = (flag) ? current.force : current;

      if (last) { return (force > comp) ? force : comp; }

      let coord = item.coord;

      return (force > comp) ? {
        coord, len: item.len, force: item.force,
      } : {
        coord, len: current.len, force: current.force,
      };
    });
  }

  public mergeArraysIntoObject(arr1: any, arr2: any): any {
    return arr1.map((num, index) => {
      const current = arr2[index];
      return {
        coord: current.coord,
        len: num,
        force: current.force,
      };
    });
  }

  /**
    * @desc sets worse case
    * @param sumPlus: number, sumMinus: number, arrPlus: any, arrMinus: any, mainArr: any, index: string
    * @return object
  */
  public calcWorseCaseYDir(sumPlus: number, sumMinus: number, arrPlus: any, arrMinus: any, mainArr: any, index: string) {

    const arrPlusMax = Math.max.apply(null, arrPlus.filter(Number));
    const arrPlusMin = Math.min.apply(null, arrPlus.filter(Number));
    
    const arrMinusMax = Math.max.apply(null, arrMinus.filter(Number));
    const arrMinusMin = Math.min.apply(null, arrMinus.filter(Number));

    const arrPlusMaxIndex = arrPlus.indexOf(arrPlusMax);
    const arrPlusMinIndex = arrPlus.indexOf(arrPlusMin);
    const arrMinusMaxIndex = arrMinus.indexOf(arrMinusMax);
    const arrMinusMinIndex = arrMinus.indexOf(arrMinusMin);

    const response: any = {
      plusAccMax: {
        y: arrPlusMax,
        x: mainArr[arrPlusMaxIndex][index]
      },
      plusAccMin: {
        y: arrPlusMin,
        x: mainArr[arrPlusMinIndex][index]
      },
      negAccMax: {
        y: arrMinusMax,
        x: mainArr[arrMinusMaxIndex][index]
      },
      negAccMin: {
        y: arrMinusMin,
        x: mainArr[arrMinusMinIndex][index]
      },
    };

    response.accPlusSlope = {
      y: (response.plusAccMax.y === 0 && response.plusAccMin.y === 0 ) ? 0 : (response.plusAccMax.y - response.plusAccMin.y) / (response.plusAccMax.x - response.plusAccMin.x),
    };

    response.accPlusB = {
      y: - (response.plusAccMin.y - response.accPlusSlope.y * (response.plusAccMin.x)),
    };

    response.accNegSlope = {
      y: (response.negAccMax.y === 0 && response.negAccMin.y === 0 ) ? 0 : (response.negAccMax.y - response.negAccMin.y) / (response.negAccMax.x - response.negAccMin.x),
    };

    response.accNegB = {
      y: - (response.negAccMin.y - response.accNegSlope.y * (response.negAccMin.x)),
    };
 
    return response;
  }

  /**
    * @desc sets worse case
    * @param sumPlus: number, sumMinus: number, arrPlus: any, arrMinus: any, mainArr: any, index: string
    * @return object
  */
  public calcWorseCaseXDir(sumPlus: number, sumMinus: number, arrPlus: any, arrMinus: any, mainArr: any, index: string): any {
    const arrPlusMax = Math.max.apply(null, arrPlus.filter(Number));
    const arrPlusMin = Math.min.apply(null, arrPlus.filter(Number));
    
    const arrMinusMax = Math.max.apply(null, arrMinus.filter(Number));
    const arrMinusMin = Math.min.apply(null, arrMinus.filter(Number));

    const arrPlusMaxIndex = arrPlus.indexOf(arrPlusMax);
    const arrPlusMinIndex = arrPlus.indexOf(arrPlusMin);
    const arrMinusMaxIndex = arrMinus.indexOf(arrMinusMax);
    const arrMinusMinIndex = arrMinus.indexOf(arrMinusMin);

    const response: any = {
      plusAccMax: {
        x: arrPlusMax,
        y: mainArr[arrPlusMaxIndex][index]
      },
      plusAccMin: {
        x: arrPlusMin,
        y: mainArr[arrPlusMinIndex][index]
      },
      negAccMax: {
        x: arrMinusMax,
        y: mainArr[arrMinusMaxIndex][index]
      },
      negAccMin: {
        x: arrMinusMin,
        y: mainArr[arrMinusMinIndex][index]
      },
    };

    response.accPlusSlope = {
      x: (response.plusAccMax.x === 0 && response.plusAccMin.x === 0 ) ? 0 : (response.plusAccMax.x - response.plusAccMin.x) / (response.plusAccMax.y - response.plusAccMin.y),
    };

    response.accPlusB = {
      x: - (response.plusAccMin.x - response.accPlusSlope.x * (response.plusAccMin.y)),
    };

    response.accNegSlope = {
      x: (response.negAccMax.x === 0 && response.negAccMin.x === 0 ) ? 0 : (response.negAccMax.x - response.negAccMin.x) / (response.negAccMax.y - response.negAccMin.y),
    };

    response.accNegB = {
      x: - (response.negAccMin.x - response.accNegSlope.x * (response.negAccMin.y)),
    };

    return response;
  }

  /**
    * @desc iterate over array of numbers
    * @param arr: array of numbers
    * @return arr: with parsed values
  */
  public setNumberArr(arr: any) : any{
    return arr.map((num) => {
      return parseFloat(num);
    });
  }

  /**
    * @desc iterate over array of objects and parse every value of every key of object.
    * @param matrix: array of objects
    * @return matrix: with parsed values
  */
  public settingMatrix(matrix: any): any {
    let array = (Array.isArray(matrix)) ? matrix : this.convertFromObjectToArray(matrix);
        
    return array.map((obj, index, arr) => {
      const keys = Object.keys(obj);

      keys.map((key) => {
        if (!Number.isNaN(parseFloat(obj[key]))) {
          obj[key] = parseFloat(obj[key]);
        }
      });
      return arr[index] = obj;
    });
  }

  /**
    * @desc iterate over array of objects and return value of passed key
    * @param arr: array of objects, index, key
    * @return value
  */
  public getKeyValue(arr: any, match: string, keys: any): any {
    let value = null;

    arr.map((item, index) => {
      const isMatched = ((item.xCoord || item.yCoord || item.yCoordEff) === match);
      if (isMatched) {
        value = {};
        keys.forEach((key) => {
          value[key] = (item.yCoordEff === match) ? arr[index - 1][key] : item[key];
        });
      }
    });

    return value;
  }

  /**
    * @desc iterate over array of objects and return value of passed key
    * @param arr: array of objects, keys, properties
    * @return value
  */
  public getIndexes(arr: any, match: any, keys: any, property: string): any {
    const data = {};
    const found = false;

    arr.map((item, index) => {
      const isMatched = (item[property] === match);

      if (isMatched) {
        keys.forEach((key) => {
          data[key] = data[key] || item[key];
        });
      }
    });

    return data;
  }

  /**
    * @desc iterate over array of objects and sums set of values
    * @param arr: array of objetcs, match: value to match, key: value key, property, indexer
    * @return value
  */
  public sumArrayIndex(arr: any, match: string, key: string, property: string): any {
    let value = 0;

    arr.map((item, index) => {
      if (item[property] === match) {
        value += parseFloat(item[key]);
      }
    });

    return value;
  }

  /**
    * @desc iterate over array of objects and return object with closers numbers
    * @param arr: array of objects, matcher: number
    * @return object with smaller an bigger number
  */
  public getCloserNumbers(arr: any, arr2: any, matcher: number): any {
    let results = {};

    arr.map((item, index, arr) => {
      if (item <= matcher) {
        results = {
          coordSmaller: arr[index] || 0,
          coordBigger: arr[index + 1] || 0,
          demandSmaller: arr2[index] || 0,
          demandBigger: arr2[index + 1] || 0,
        };
      }
    });

    return results;
  }

  /**
    * @desc get values depending of params from a matrix
    * @param windExp: string, windCcRoofEffArea: number
    * @return set of objects depending of the conditions pased
  */

  public linearInterpolation(windExp: string, windCcRoofEffArea: number): any {
    const a = (windExp === "A") ? this.linearFormula(1, windCcRoofEffArea) : 1;
    const b = (windExp === "B") ? this.linearFormula(.9, windCcRoofEffArea) : 1;
    const c = (windExp === "C") ? this.linearFormula(.8, windCcRoofEffArea) : 1;
    const d = (windExp === "D") ? this.linearFormula(.7, windCcRoofEffArea) : 1;
    const e = (windExp === "E") ? this.linearFormula(.6, windCcRoofEffArea) : 1;

    return {
      positive: {
        flat:       { 1: 1, 2: 1, 3: 1, 4: d, 5: d },
        mansard:    { 1: b, 2: b, 3: b, 4: d, 5: d },
        hip:        { 1: b, 2: b, 3: b, 4: d, 5: d },
        monoslope:  { 1: c, 2: c, 3: c, 4: d, 5: d },
      },
      negative: {
        flat:       { 1: d, 2: d, 3: d, 4: c, 5: e },
        mansard:    { 1: b, 2: c, 3: c, 4: c, 5: e },
        hip:        { 1: b, 2: c, 3: c, 4: c, 5: e },
        monoslope:  { 1: a, 2: b, 3: c, 4: c, 5: e },
      },
      overhang:  { 1: a, 2: a, 3: b, 4: 1, 5: 1 },
    };
  }

  /**
    * @desc get degrees and return radians
    * @param degrees: number
    * @return the result of the convertion
  */

  public radians(degrees: number): any {
    return degrees * Math.PI / 180;
  }

  /**
    * @desc get radians and return degrees
    * @param degrees: number
    * @return the result of the convertion
  */

  public degrees(radians: number): any {
    return radians * 180 / Math.PI;
  }

  public getSwLen(arr: any, frogDefaults: any, calc: string, coord: string, inputs: any, flex?: boolean): any {
    const isDoubleBar = this.isDoubleBar(inputs);
    let swSkuCpcty;
    let keys;

    const coordLesserThanCorner1X = coord < inputs.reEntryCorner1XCoord;
    const coordGreaterThanCorner2X = coord > inputs.reEntryCorner2XCoord;
    const halfTotalBldgYLen = inputs.totalBldgYLen / 2;

    const firstCondition = ((coordLesserThanCorner1X && inputs.reEntryCorner1YCoord < halfTotalBldgYLen) ||
    coordGreaterThanCorner2X &&  (inputs.reEntryCorner2YCoord > 0 && inputs.reEntryCorner2YCoord < halfTotalBldgYLen));

    const secondCondition = ((coordLesserThanCorner1X && inputs.reEntryCorner1YCoord > halfTotalBldgYLen) ||
    coordGreaterThanCorner2X && (inputs.reEntryCorner2YCoord > 0 && inputs.reEntryCorner2YCoord > halfTotalBldgYLen));

    if(isDoubleBar && flex) {
      if(firstCondition || secondCondition){
        swSkuCpcty = frogDefaults.singleBarSwSkuCpcty[calc][coord];
        keys = Object.keys(swSkuCpcty);
      }else{
        swSkuCpcty = frogDefaults.doubleBarSwSkuCpcty[calc][coord];
        keys = Object.keys(swSkuCpcty);
      }
    } else {
      swSkuCpcty = frogDefaults.singleBarSwSkuCpcty[calc][coord];
      keys = Object.keys(swSkuCpcty);
    }

    return arr.map((item, index) => {
      const newItem = {
        coord: item.coord,
        force: item.force,
      };

      return this.getLen(newItem.force, keys, swSkuCpcty, inputs);
    });
  }

  public getRxnsSum(arr: any, condProperty: string, sumProperty: string): any {
    const obj = {};

    arr.forEach((row, index) => {
      if (row[condProperty] > 0) {
        obj[row.coord] = obj[row.coord] + row[sumProperty] || row[sumProperty];
      }
    });

    return obj;
  }

  public getLen(num: number, keys: any, swSkuCpcty: any, inputs: any): any {
    let val: any = 0;

    for (let i = 0; i < keys.length; i++) {
      if (swSkuCpcty[keys[i]] > num) {
        val = keys[i];
        break;
      } else {
        val = keys[keys.length - 1];
      }
    }
    return parseFloat(val);
  }

  /**
    * @desc get set of parameters and according to conditional return array of numbers
    * @param initialNumber: number, splitNumber: number, limit: number
    * @return array of numbers
  */
  public getSum(initialNumber: number, splitNumber: number, limit: number, inputs?: any): any {
    const arr = [];
    arr.push(initialNumber);

    const inititalNum = (
      (inputs.reEntryCorner1XCoord || inputs.reEntryCorner2XCoord) === initialNumber
    ) ? 0 : initialNumber;

    let num = inititalNum + splitNumber;

    while (num < limit) {
      arr.push(num);
      num += splitNumber;
    }

    return arr;
  }

  /**
    * @desc split number as much as possible
    * @param num: number to be split and max: contional number
    * @return split number that is allow by the condition
  */
  public splitNumber(num: number, max: number, swSkuLenX: number = 8): any {
    const number = Math.ceil(num / swSkuLenX) * swSkuLenX;

    return (number > max) ? this.splitNumber(number / 2, max) : number;
  }

  public compareLens(arr1: any, arr2: any): any {
    const arr1Len = arr1.length;
    const arr2Len = arr2.length;

    const isSameSize = (arr1Len === arr2Len);

    return (isSameSize) ?
      this.getGreaterLens(arr1, arr2, false, true) :
      (arr1Len > arr2Len) ? arr1 : arr2;
  }

  public getGreaterForces(arr1: any, arr2: any, omega: number = 1): any {
    const arr1Len = arr1.length;
    const arr2Len = arr2.length;

    const isSameSize = (arr1Len === arr2Len);

    return (isSameSize) ?
      this.getGreaterForce(arr1, arr2, omega) :
      (arr1Len > arr2Len) ? arr1 : arr2;
  }



  public getGreaterForce(arr1: any, arr2: any, omega: number = 1): any {
    return arr1.map((item, index) => {
      const current = arr2[index];

      if (item.force * omega > current.force) {
        item.colForce = item.force * omega;
        return item;
      }else {
        current.colForce = current.force;
        return current;
      }
    });
  }

  public getAllSwLenY(yCollectorLinesOpt: any, inputs: any): any {
    const isDoubleBar = this.isDoubleBar(inputs);

    const conf: any = (isDoubleBar) ? this.doubleBar : this.singleBar;

    return yCollectorLinesOpt.map((num, index, arr) => {
      return conf.getAllSwLenY(inputs, num, index);
    });
  }

  public getSets(inputs: any, coordinates: any): any {
    const isDoubleBar = this.isDoubleBar(inputs);

    const sets = {
      xColLinesWalls: [],
      allSwLen: [],
      swXOffset: [],
    };

    const halfTotalBldgYLen = 0.5 * inputs.totalBldgYLen;

    coordinates.forEach((coord) =>  {
      sets.xColLinesWalls.push(coord - inputs.barAOhYLen1);

      const coordEff = coord - inputs.barAOhYLen1;

      if (isDoubleBar) {
        sets.allSwLen.push((coordEff <= halfTotalBldgYLen) ? inputs.barAXLen : inputs.barBXLen);
      } else {
        sets.allSwLen.push(inputs.totalBldgXLen);
      }

      let swX = 0;

      if ( (inputs.reEntryCorner1XCoord > 0 && inputs.reEntryCorner1YCoord < halfTotalBldgYLen) &&
          (coordEff < halfTotalBldgYLen) || (inputs.reEntryCorner1XCoord > 0 &&
          inputs.reEntryCorner1YCoord > halfTotalBldgYLen) && (coordEff > halfTotalBldgYLen))
      {
        swX = inputs.reEntryCorner1XCoord;
      }

      sets.swXOffset.push(swX);
    });

    return sets;
  }

  public getCollectorLineOpt(allDiaSpanY: number, yCollectorLines: any, inputs: any): any {
    const isSwInvalid = inputs.isSwInvalid;
    const isEventTwo = inputs.isEventTwo;
    const span = inputs.totalBldgXLen;

    let responseArr = this.getResponseArr(allDiaSpanY, yCollectorLines, inputs, isEventTwo);

    if (isEventTwo) {
      responseArr = responseArr.map((item) => parseInt(item.coord));
    }

    let res1 = [].concat.apply([], responseArr);
    let res2;

    if(this.bldgTypeMeths.isBox(inputs)) {
      res1.push(inputs.reEntryCorner1XCoord, inputs.reEntryCorner2XCoord);
      res2 = res1.sort((a, b) => a - b);
    }else{
      res2 = [].concat.apply([], responseArr)
    }
    
    let collectorLinesOpt = [].concat.apply([], responseArr);
    
    return this.removeDuplicates(collectorLinesOpt);
  }

  public getFlexTribY(yCollectorLines: any, sets: any): any {
    return yCollectorLines.map((num, index, arr) => {
      const before = arr[index - 1];
      const after = arr[index + 1];

      const halfAfter = Math.abs(num - after) / 2;
      const halfBefore = Math.abs(num - before) / 2;

      if (index === 0) {

        return  [halfAfter];
      }else if (num == sets.reEntryCorner1XCoord) {

        return [halfBefore, halfAfter];
      }else if (num === sets.reEntryCorner2XCoord) {

        return [halfBefore, halfAfter];
      }else if (num === sets.totalBldgXLen) {

        return [halfBefore];
      } else {

        return [Math.abs(before - after) / 2];
      }
    });
  }

  public getBldgDepthYaxis(xCoordShearY: any, inputs: any): any {
    const totalbldgYLenEff = (inputs.barBXLen > 0) ?
      inputs.totalBldgYLen +
      inputs.barAOhYLen1 +
      inputs.barBOhYLen :
      inputs.totalBldgYLen +
      inputs.barAOhYLen1 +
      inputs.barAOhYLen2;

    return xCoordShearY.map((num, index, arr) => {
      return this.getYColLen(num, inputs, totalbldgYLenEff);
    });
  }

  public getYColLen(num: number, inputs: any, totalbldgYLenEff: any): any {
    if ((inputs.reEntryCorner1XCoord == 0 && inputs.reEntryCorner2XCoord == 0)) {

      return totalbldgYLenEff;
    } else if ((num < inputs.reEntryCorner1XCoord && inputs.reEntryCorner1XCoord > 0 && inputs.reEntryCorner1YCoord < 0.5 * totalbldgYLenEff) ||
     (num > inputs.reEntryCorner2XCoord && inputs.reEntryCorner2XCoord > 0 &&  inputs.reEntryCorner2YCoord < 0.5 * totalbldgYLenEff)){

      return inputs.barAYLen + inputs.barAOhYLen1 + inputs.corrYLen;
    } else if ((num < inputs.reEntryCorner1XCoord && inputs.reEntryCorner1XCoord > 0 && inputs.reEntryCorner1YCoord > 0.5 * totalbldgYLenEff) ||
     (num > inputs.reEntryCorner2XCoord && inputs.reEntryCorner2XCoord > 0 &&  inputs.reEntryCorner2YCoord > 0.5 * totalbldgYLenEff)) {

      return inputs.barBYLen + inputs.barBOhYLen + inputs.corrYLen;
    } else {

      return totalbldgYLenEff;
    }
  }

  public getBldgDepthXaxis(coord: string, inputs: any): any {
    if (parseFloat(coord) === 0 && inputs.barBYLen > 0){

      return inputs.barAXLen;
    }else if (parseFloat(coord) === inputs.totalBldgYLen && inputs.barBYLen > 0) {

      return inputs.barBXLen;
    }else{

      return inputs.totalBldgXLen;
    }
  }


  public setForceType(arr: any, forceType: string): any {
    return arr.map((item) => {
      item.forceType = forceType;

      return item;
    });
  }

  public getChrdDepthY(bldgDepthYaxis: any, diaSpanY: any, inputs: any): any {
    const chordDepthListY: any = Array.from(new Set(bldgDepthYaxis));
    
    let sum = 0;
    const barOhYLenCond = (inputs.barBYLen > 0) ? inputs.barBOhYLen : inputs.barAOhYLen2;
    const barOhSum = inputs.barAOhYLen1 + barOhYLenCond;
    const halfTotalBldgYLen = 0.5 * inputs.totalBldgYLen;

    const isDoubleBar = this.isDoubleBar(inputs);

    const conf: any = (isDoubleBar) ? this.doubleBar : this.singleBar;

    return diaSpanY.map((num) => {
      sum += num;
      return conf.getChrdDepthY(num, inputs, barOhSum, chordDepthListY, sum, halfTotalBldgYLen, barOhYLenCond);
    });
  }

  public getUniquesObj(arr: any): any {
    const res = {};

    arr.map((item, index) => {
      if (!res[item.coord]) {
        res[item.coord] = item;
      }
    });

    const keys = Object.keys(res);

    return keys.map((key) => {
      return res[key];
    });
  }

  public getTotalSwLen(arr: any): any {
    const utils = new Utils;
    const swLens = {};

    arr.map((item) => {
      const length = (item.xLength) ? item.xLength : item.yLength;
      swLens[item.coord] = swLens[item.coord] + length || length;
    });

    const keys = Object.keys(swLens);

    return keys.map((key, index) => {
      return {
        coord: key,
        totalSwlen: swLens[key],
      };
    });
  }

  public compareUxWallsVsFlexAnalisys(UXWalls: any, wallSkus: any, err: any): any {
    const uxwX = this.getTotalSwLen(UXWalls.x);
    const wallSkusX = this.getTotalSwLen(wallSkus.x);

    const uxwY = this.getTotalSwLen(UXWalls.y);
    const wallSkusY = this.getTotalSwLen(wallSkus.y);

    const xValid = this.compareSkus(uxwX, wallSkusX, "y", err);
    const yValid = this.compareSkus(uxwY, wallSkusY, "x", err);

    const valid = xValid && yValid;
    const arr = (valid) ? UXWalls : wallSkus;

    return {
      valid,
      arr
    };
  }

  public getBldgType(inputs: any): string {
    return this.bldgTypeMeths.getType(inputs);
  }

  public isDoubleBar(inputs: any): boolean {
    return this.bldgTypeMeths.isDoubleBar(inputs);
  }

  public isSingleBar(inputs: any): boolean {
    return (inputs.bldgType === "singleBar");
  }

  public isSingleBarWithCorr(inputs: any): boolean {
    return (inputs.bldgType === "singleBarWithCorr");
  }

  public isBox(inputs: any): boolean {
    return this.bldgTypeMeths.isBox(inputs);
  }

  public isLBldg(inputs: any): boolean {
    return this.bldgTypeMeths.isLBldg(inputs);
  }

  public removeZeros(arr: any): any {
    const list = [];
    arr.forEach((item, index) => {
      if (item[0] !== 0 && item[1] !== 0){
        list.push(item);
      }
    });
    return list;
  }

  public getNewArray(arr1: any, arr2: any, properties: any, coordinate: string): any {
    const sameLength = (arr1.length === arr2.length);

    if (!sameLength) {
      return (arr1.length > arr2.length) ? arr1 : arr2;
    }

    return arr1.map((item, index) => {
      const current = arr2[index];
      const newItem: any = {};

      properties.forEach((property, index) => {
        newItem[property] = item[property];
      });

      Object.assign(newItem, {
        forceType: (item.force > current.force) ? item.forceType : current.forceType,
        force: (item.force > current.force) ? item.force : current.force,
        analysisType: (item.force > current.force) ? item.analysisType: current.analysisType
      });

      if (coordinate === "x") {
        const xLength = (current.xLengthCntrl) ?
          (item.xLength > current.xLengthCntrl) ? item.xLength : current.xLengthCntrl :
            (item.xLength > current.xLength) ?  item.xLength : current.xLength;

        newItem.xLength = xLength;
        newItem.xCenter = newItem.xStart + newItem.xLength / 2;
        newItem.xEnd = newItem.xStart + newItem.xLength;
      }else {
        const yLength = (current.yLengthCntrl) ?
          (item.yLength > current.yLengthCntrl) ? item.yLength : current.yLengthCntrl :
            (item.yLength > current.yLength) ?  item.yLength : current.yLength;

        newItem.yLength = yLength;
      }

      return newItem;
    });
  }

  public getXstarts(item: any, inputs: any, omega: number, s2: number, stlSplice50: number, 
                    allSw: number,  xOff: number, defaults: any, swSkuLenX: number = 8): any {
        
    const xCollLen = this.getBldgDepthXaxis(item.coord, inputs);
    const fpxFxRatio = (inputs.vertDistrFpxLbsCntrl / inputs.vertDistrFxLbsCntrl);
    const swSkuPlfCap = defaults.wdSwSkuProps.shearCapcty.eq;

    let isSingleBar = this.bldgType.isSingleBar(inputs);
    
    let stlSpliceCoords = (item.coord === inputs.barAYLen || item.coord === inputs.barAYLen + inputs.corrYLen);

    let maxStrapCapacity = (!isSingleBar && stlSpliceCoords) ? stlSplice50 : s2 ;

    if (item.colCoordForce) {
      item.colCoordForce *= fpxFxRatio;
    } else {
      item.colForce *= fpxFxRatio;
    }

    const colForcePlf = (item.colCoordForce || item.colForce) / xCollLen;
    const colForce = (item.colCoordForce || item.colForce);
    const maxColStrapSwSpacing = Math.floor( ((maxStrapCapacity / colForcePlf) * 2 ) / swSkuLenX ) * swSkuLenX;

    const maxSwCapPlf = swSkuPlfCap * fpxFxRatio * omega;
    const maxSwCapPlfSwlen = Math.ceil((colForce / maxSwCapPlf) / swSkuLenX) * swSkuLenX;

    const swForceSwNum = item.len / swSkuLenX;
    
    let maxColStrapSwNum = Math.ceil((colForce / maxStrapCapacity) * 0.5);
    let maxSwCapPlfSwNum = Math.ceil(maxSwCapPlfSwlen / swSkuLenX);

    let maxSwNum = Math.max(maxSwCapPlfSwNum, swForceSwNum);
    let mult = Math.max(maxColStrapSwNum, maxSwNum);
    const maxSwNumSpacing = Math.floor( (allSw / (maxSwNum + 1)) / swSkuLenX ) * swSkuLenX;

    let swDrivenMult = this.multRecursion(allSw, mult, maxSwNumSpacing);

    const swForcePlf = colForce / (mult * swSkuLenX);
    const netForcePlf = colForcePlf - swForcePlf;

    let colRange = [];

    for(let i = swSkuLenX; i <= maxColStrapSwSpacing; i += swSkuLenX) {
      colRange.push(i);
    }

    let result;

    if((allSw / maxColStrapSwSpacing) < mult && maxSwNumSpacing*colForcePlf < maxStrapCapacity) {
      result = this.getXSpacingSwCap(item, swDrivenMult, allSw, maxSwNumSpacing, xOff, swSkuLenX, inputs);
    } else {
      result = this.getxStart(maxStrapCapacity, colForcePlf, netForcePlf, colRange, xOff, mult);
    }

    return result
  }

  private multRecursion(allSw: number, mult: number, maxSwNumSpacing: number) {
    const spacing = allSw / maxSwNumSpacing;
    const finalSwNum = spacing - 1;

    if(mult < finalSwNum) {
      mult += 1;
      return this.multRecursion(allSw, mult, maxSwNumSpacing);
    }else{
      return mult
    } 
  }

  private getXSpacingSwCap(item: any, mult: number, allSw: number, maxSwNumSpacing: number, xOff: number, swSkuLenX: number, inputs: any): any {
    let res = [];
    let halfTotalBldgYLen = 0.5 * inputs.totalBldgYLen;
    let reEntryCond = ( (inputs.reEntryCorner1XCoord > 0 && inputs.reEntryCorner1YCoord < halfTotalBldgYLen && item.coord === inputs.barAYLen) 
                      || (inputs.reEntryCorner1XCoord > 0 && inputs.reEntryCorner1YCoord > halfTotalBldgYLen && item.coord === inputs.barAYLen + inputs.corrYLen) );

    if(reEntryCond){
      for(let i = 0; i < mult; i++){
        const lastIndex = i - 1;
        const start = (i === 0) ? xOff : maxSwNumSpacing * i + xOff;
        const xStart = (start >= allSw + xOff) ? (allSw + xOff) - swSkuLenX : start;
        res.push(xStart);
      }

    }else{
      for(let i = 0; i < mult; i++){
        const start = (maxSwNumSpacing * (i + 1)) + xOff;
        const xStart = (start >= allSw + xOff) ? (allSw + xOff) - swSkuLenX : start;
        res.push(xStart);
      }
    }

    return res
  }

  private getxStart(maxStrapCapacity: number, colForcePlf: number, netForcePlf: number, colRange: any, xOff: number, mult: number): any {
    let iterations = (mult * 2) + 1;

    let spaces = this.getSpacing(maxStrapCapacity, colForcePlf, netForcePlf, colRange, iterations);

    let res = [];
    let addCoord = xOff; 

    let coords = spaces.map((space, index) => {
      addCoord += space;
      return addCoord;
    });

    coords.forEach((coord, index) => {
      let isEven = index %2 === 0;

      if(isEven && res.length < mult) {
        res.push(coord);
      }
    });

    return res;
  }

  private getSpacing(maxStrapCapacity: number, colForcePlf: number, netForcePlf: number, colRange: any, iterations: number): any {
    let spacing = [];
    let demands = [];

    for(let i = 0; i < iterations; i++) {
      
      let isEven = (i % 2 === 0);
      let multiplier = isEven ? colForcePlf : netForcePlf;

      for(let index = 0; index < colRange.length; index ++) {
        const demand = colRange[index] * multiplier;

        const condition = maxStrapCapacity < Math.abs(demand + (demands[ i - 1 ] || 0));

        if (condition) {
          let d = colRange[index - 1] * multiplier;

          spacing.push((colRange[index - 1] || colRange[index]));
          demands.push(d + (demands[ i - 1 ] || 0));
          break;
        }else if(index === colRange.length -1 ) {

          let d = colRange[index] * multiplier;
          spacing.push(colRange[index]);
          demands.push(d + (demands[ i - 1 ] || 0));
        }
      }
    }
    return spacing;
  }

  public getForcesByCoord(arr: any): any {
    let res = {};

    arr.forEach((item) => {
      res[item.coord] = res[item.coord] ? 
        res[item.coord] + (item.force || item.maxRigidWallForce || 0) :
        (item.force || item.maxRigidWallForce || 0);
    });

    return res;
  }

  public getGreaterForceByCoord(obj: any, obj2: any): any {
    let res = {};

    let coords = Object.keys(obj);

    coords.forEach((coord) => {
      res[coord] = (obj[coord] >= obj2[coord]) ? obj[coord] : obj2[coord]
    });

    return res;
  }

  public flattenObject(object: any): any {
    const res = {};

    for (const i in object) {
      if (!object.hasOwnProperty(i)) { continue; }

      if ((typeof object[i]) == "object") {
        const flatObject = this.flattenObject(object[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) { continue; }

          res[i + "." + x] = flatObject[x];
        }
      } else {
        res[i] = object[i];
      }
    }
    return res;
  }

  public removeDuplicates(arr: any): any {
    return arr.filter((el, i, a) => i === a.indexOf(el));
  }

  private getResponseArr(allDiaSpanY: number, yCollectorLines: any, inputs: any, isEventTwo: boolean): any {
    return yCollectorLines.map((item, index, arr) => {
      const nx = arr[index + 1];
      const next = isEventTwo ? (nx) ? nx.coord : undefined : nx;

      if (next) {
        const span = inputs.totalBldgXLen;

        if (span > allDiaSpanY || inputs.isSwInvalid) {
          const split = this.incDivider(span, allDiaSpanY, inputs.splitNumber);

          inputs.splitNumber = split.inc;

          const param = isEventTwo ? item.coord : item;
          return this.getSum(param, split.value, next, inputs);
        }
      }
      return item;
    });
  } 

  private incDivider(span: number, allDiaSpanY: number, incremental: number = 1, swSkuLenX: number = 8): any {
    const number = span / incremental;

    if (number > allDiaSpanY) {
      const inc = incremental + 1;

      return this.incDivider(span, allDiaSpanY, inc);
    } else {
      const value = Math.ceil(number / swSkuLenX) * swSkuLenX;
      const inc = incremental;

      return {
        value,
        inc
      };
    }
  }

  private iterateMult(allSwSpacn: number, mult: number, allSw: number, swSkuLenX: number = 8): any {
    let swSpacn = Math.ceil( (allSw / (mult + 1)) / swSkuLenX) * swSkuLenX;

    while(swSpacn > allSwSpacn) {
      mult += 1;
      swSpacn = Math.ceil( (allSw / (mult + 1)) / swSkuLenX) * swSkuLenX;
    }

    return {
      mult,
      swSpacn,
    }
  }

  private linearFormula(value: number, windCcRoofEffArea: number): any {
    const log10 = Math.log10(10);

    return Math.abs(((1 - value) / (log10 - Math.log10(500))) * (log10 - Math.log10(windCcRoofEffArea)) - 1);
  }

  public convertFromObjectToArray(obj: any) {
    let keys = Object.keys(obj);

    return keys.map((key) => {
      return obj[key];
    });
  }

  private compareSkus(arr1: any, arr2: any, coord: string,  err: any): any {
    let valid = true;

    arr1.map((item, index) => {
      const len = item.totalSwlen;
      const currentLen = arr2[index].totalSwlen;

      if (len < currentLen) {
        valid = false;

        const message = "Total Shear Wall Length at " + coord + "-coordinate: " + item.coord + " needs to be >= than: " + currentLen;
        err.setErr("WallSkus", message);
      }
    });

    return valid;
  }
}

export default Utils;