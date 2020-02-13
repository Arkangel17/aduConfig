'use strict';
import AduConfigCompLib from "./aduConfigLibrary";
export class NdsShearWallCalc {
    constructor(inputs) {
        this.results = {};
        this.inputs = {};
        this.aduConfig = {};
        this.inputs = inputs;
        this.aduConfig = new AduConfigCompLib();
    }
    calc() {
        const inputs = this.inputs;
        const aduConfig = this.aduConfig;
        let res;
        let summaryFlex = inputs.lfd.summaryFlex;
        let totalSwLensCfaXPerpSeis = this.getTotalSwLen(inputs.UXWallSkus.y, summaryFlex.seisFlexWallLenY);
        let totalSwLensCfaXPerpWind = this.getTotalSwLen(inputs.UXWallSkus.y, summaryFlex.seisFlexWallLenY);
        let totalSwLensCfaYPerpSeis = this.getTotalSwLen(inputs.UXWallSkus.x, summaryFlex.seisFlexWallLenX);
        let totalSwLensCfaYPerpWind = this.getTotalSwLen(inputs.UXWallSkus.x, summaryFlex.windFlexWallLenX);
        let getUnitShearCfaXPerpSeis = this.getUnitShear(totalSwLensCfaXPerpSeis);
        let getUnitShearCfaXPerpWind = this.getUnitShear(totalSwLensCfaXPerpWind);
        let getUnitShearCfaYPerpSeis = this.getUnitShear(totalSwLensCfaYPerpSeis);
        let getUnitShearCfaYPerpWind = this.getUnitShear(totalSwLensCfaYPerpWind);
        let getCfaSwTypeXPerpSeis = this.getSwConfig(getUnitShearCfaXPerpSeis, aduConfig.shearWallCaps);
        let getCfaSwTypeXPerpWind = this.getSwConfig(getUnitShearCfaXPerpWind, aduConfig.shearWallCaps);
        let getCfaSwTypeYPerpSeis = this.getSwConfig(getUnitShearCfaYPerpSeis, aduConfig.shearWallCaps);
        let getCfaSwTypeYPerpWind = this.getSwConfig(getUnitShearCfaYPerpWind, aduConfig.shearWallCaps);
        let getDeflUnitShearPlfXPerpSeis = this.wdSwStiffness(getCfaSwTypeXPerpSeis, inputs);
        let getDeflUnitShearPlfXPerpWind = this.wdSwStiffness(getCfaSwTypeXPerpWind, inputs);
        let getDeflUnitShearPlfYPerpSeis = this.wdSwStiffness(getCfaSwTypeYPerpSeis, inputs);
        let getDeflUnitShearPlfYPerpWind = this.wdSwStiffness(getCfaSwTypeYPerpWind, inputs);
        let strDeflSwConfigXPerpSeis = this.getSwConfig(getDeflUnitShearPlfXPerpSeis, aduConfig.shearWallCaps);
        let strDeflSwConfigXPerpWind = this.getSwConfig(getDeflUnitShearPlfXPerpWind, aduConfig.shearWallCaps);
        let strDeflSwConfigYPerpSeis = this.getSwConfig(getDeflUnitShearPlfYPerpSeis, aduConfig.shearWallCaps);
        let strDeflSwConfigYPerpWind = this.getSwConfig(getDeflUnitShearPlfYPerpWind, aduConfig.shearWallCaps);
        let swTypeCntrlYPerpSeis = this.getSwTypeCntrl(strDeflSwConfigYPerpSeis);
        let swTypeCntrlYPerpWind = this.getSwTypeCntrl(strDeflSwConfigYPerpWind);
        let swTypeCntrlXPerpSeis = this.getSwTypeCntrl(strDeflSwConfigXPerpSeis);
        let swTypeCntrlXPerpWind = this.getSwTypeCntrl(strDeflSwConfigXPerpWind);
        let finalSwConfigXPerp = this.getFinalSwConfig(swTypeCntrlXPerpSeis, swTypeCntrlXPerpWind);
        let finalSwConfigYPerp = this.getFinalSwConfig(swTypeCntrlYPerpSeis, swTypeCntrlYPerpWind);
        const yShearWalls = this.getHduConfig(finalSwConfigXPerp, aduConfig.hduCaps);
        const xShearWalls = this.getHduConfig(finalSwConfigYPerp, aduConfig.hduCaps);
        res = {
            yShearWalls,
            yShearWallsCFA: this.cfaShearWallResults(yShearWalls),
            xShearWalls,
            xShearWallsCFA: this.cfaShearWallResults(xShearWalls),
        };
        return res;
    }
    getTotalSwLen(arr, arr2) {
        let swLens = {};
        let totalForce;
        let forceType;
        let newArr = arr.map((item) => {
            let length = (item.xLength) ? item.xLength : item.yLength;
            //per NDS 4.3.6.4.1.1 perWallCo should be applied to sw length
            //per NDS 4.3.4.2 aspectRatioFtr should be applied to nom. SW capcty
            let lengthEff = length * item.perfWallCo * item.aspectRatioFtr;
            swLens[item.coord] = swLens[item.coord] + lengthEff || lengthEff;
            let newItem = {};
            Object.assign(newItem, item);
            newItem['lengthEff'] = lengthEff;
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
        let res = {};
        arr.map((item) => {
            res[item.cfaWebID] = {
                value: item.swTypeCntrl.type
            };
        });
        return res;
    }
}
export default NdsShearWallCalc;
