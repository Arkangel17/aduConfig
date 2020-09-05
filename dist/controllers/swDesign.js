'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const simpHrdwreLib_1 = require("../model/simpHrdwreLib");
const ndsEqns_1 = require("../model/ndsEqns");
class swDesignWd {
    constructor(inputs) {
        this.inputs = inputs;
        this.results = {};
        this.aduConfig = {};
        this.ndsEqns = {};
        this.inputs = inputs;
        this.aduConfig = new simpHrdwreLib_1.default();
        this.ndsEqns = new ndsEqns_1.default();
    }
    calc() {
        const inputs = this.inputs;
        const aduConfig = this.aduConfig;
        const ndsEqns = this.ndsEqns;
        let results = this.results;
        return results;
    }
    getTotalSwLen(arr, arr2) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let swLens = {};
        let totalForce;
        let forceType;
        let newArr = arr.map((item) => {
            let length = (item.xLength) ? item.xLength : item.yLength;
            let perfWallCoFtr = this.ndsEqns.perfSwAspectRatioFtr(item);
            let aspectRatioFtr = this.ndsEqns.swAspectRatioFtr(item);
            let lengthEff = length * perfWallCoFtr * aspectRatioFtr;
            swLens[item.coord] = swLens[item.coord] + lengthEff || lengthEff;
            let newItem = {};
            Object.assign(newItem, item);
            newItem['lengthEff'] = lengthEff;
            newItem['perfWallCoFtr'] = perfWallCoFtr;
            newItem['aspectRatioFtr'] = aspectRatioFtr;
            return newItem;
        });
        const rest = newArr.map((item) => {
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i].coord == item.coord) {
                    totalForce = arr2[i].force;
                    forceType = arr2[i].forceType;
                }
            }
            let newItem = {};
            Object.assign(newItem, item);
            newItem['totalSwLen'] = swLens[item.coord];
            newItem['totalForce'] = totalForce;
            newItem['forceType'] = forceType;
            return newItem;
        });
        // console.log('rest', rest)
        return rest;
    }
    getUnitShear(arr) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let forceRatio;
        let swForce;
        let unitShearPlf;
        arr.map((item) => {
            forceRatio = item.lengthEff / item.totalSwLen;
            swForce = item.totalForce * forceRatio;
            unitShearPlf = swForce / item.lengthEff;
            Object.assign(item, {
                forceRatio,
                swForce,
                unitShearPlf
            });
        });
        return arr;
    }
    getSwConfig(arr, obj) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        arr.map((item) => {
            let unitShearStr;
            let unitShearDefl;
            let strCfaSwConfig;
            let deflCfaSwConfig;
            if (item.forceType == 'wind') {
                for (let key in obj['wind']) {
                    if (item.unitShearPlf < key) {
                        unitShearStr = key;
                        break;
                    }
                }
                for (let key in obj['wind']) {
                    if (item.resultGa == obj['wind'][key]['stiffnessGa']) {
                        unitShearDefl = key;
                    }
                }
            }
            else {
                for (let key in obj['eq']) {
                    if (item.unitShearPlf < key) {
                        unitShearStr = key;
                        break;
                    }
                }
                for (let key in obj['eq']) {
                    if (item.resultGa == obj['eq'][key]['stiffnessGa']) {
                        unitShearDefl = key;
                        break;
                    }
                }
            }
            strCfaSwConfig = obj[item.forceType][unitShearStr];
            deflCfaSwConfig = obj[item.forceType][unitShearDefl];
            Object.assign(item, {
                unitShearDefl,
                strCfaSwConfig,
                deflCfaSwConfig
            });
        });
        return arr;
    }
    wdSwStiffness(arr, inputs) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let hdPostDeflConst = {
            elastModulus: 1600000,
            Area: 30.25,
        };
        let hdu14CapPlbs = 14445;
        let deltaAnchor = 0.182;
        let KHDU = deltaAnchor / hdu14CapPlbs;
        let stiffnessGaArr = [16, 20, 22, 28, 40, 44, 56];
        let unitShear;
        let lrfdElastDrift;
        let formula;
        let resultGa;
        let hduForce;
        let deflBending;
        let deflShear;
        let deflAnchorSlip;
        const zPow = 8 * Math.pow(inputs.avgHt, 3);
        // const khuTimes = KHDU * Math.pow(inputs.avgHt, 2);
        const eaTimes = hdPostDeflConst.elastModulus * hdPostDeflConst.Area;
        arr.map((item) => {
            let swLenDefl = item.lengthEff / item.aspectRatioFtr;
            if (item.forceType == "wind") {
                lrfdElastDrift = (inputs.avgHt * inputs.allWindDriftFtr * 12);
                unitShear = (item.unitShearPlf / 0.6) * inputs.windDriftReductFtr * item.aspectRatioFtr;
            }
            else {
                lrfdElastDrift = (inputs.avgHt * inputs.elffpx.allStoryDriftFtr * 12);
                unitShear = (item.unitShearPlf / 0.7) * item.aspectRatioFtr;
            }
            hduForce = unitShear * inputs.avgHt;
            for (let i = 0; i < stiffnessGaArr.length; i++) {
                deflBending = (zPow * unitShear) / (eaTimes * swLenDefl);
                deflShear = (unitShear * inputs.avgHt) / (1000 * stiffnessGaArr[i]);
                deflAnchorSlip = (inputs.avgHt * (KHDU * hduForce)) / swLenDefl;
                formula = (deflBending + deflShear + deflAnchorSlip);
                console.log('formula', formula);
                if (formula < lrfdElastDrift) {
                    resultGa = stiffnessGaArr[i];
                    break;
                }
            }
            console.log('resultGa', resultGa);
            Object.assign(item, {
                resultGa,
                hduForce
            });
        });
        return arr;
    }
    ;
    getSwTypeCntrl(arr) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        arr.map((item) => {
            let swTypeCntrl = (item.strCfaSwConfig.value > item.deflCfaSwConfig.value)
                ? item.strCfaSwConfig : item.deflCfaSwConfig;
            Object.assign(item, {
                swTypeCntrl
            });
        });
        return arr;
    }
    getFinalSwConfig(arr, arr1) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let resArr = [];
        arr.map((item, index) => {
            if (item.swTypeCntrl.value > arr1[index].swTypeCntrl.value) {
                resArr.push(item);
            }
            else {
                resArr.push(arr1[index]);
            }
        });
        return resArr;
    }
    getHduConfig(arr, obj) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let hdu;
        arr.map((item) => {
            let hduCapcity;
            let hduConfig;
            for (hdu in obj) {
                if (obj[hdu] > item.hduForce) {
                    hduConfig = hdu;
                    hduCapcity = obj[hdu];
                    break;
                }
            }
            Object.assign(item, {
                hduConfig,
                hduCapcity
            });
        });
        return arr;
    }
    cfaShearWallResults(arr) {
        /**
        * @desc updates inputs object values accoring to types
        * @param object input:object, flat?: boolean
        * @return object - inputs with serialize values
        */
        let res = {};
        arr.map((item) => {
            res[item.cfaWebID] = {
                value: item.swTypeCntrl.type
            };
        });
        return res;
    }
}
exports.swDesignWd = swDesignWd;
exports.default = swDesignWd;
