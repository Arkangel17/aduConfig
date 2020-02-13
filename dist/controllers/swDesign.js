'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var aduConfigLibrary_1 = require("./aduConfigLibrary");
var NdsShearWallCalc = /** @class */ (function () {
    function NdsShearWallCalc(inputs) {
        this.results = {};
        this.inputs = {};
        this.aduConfig = {};
        this.inputs = inputs;
        this.aduConfig = new aduConfigLibrary_1.default();
    }
    NdsShearWallCalc.prototype.calc = function () {
        var inputs = this.inputs;
        var aduConfig = this.aduConfig;
        var res;
        var summaryFlex = inputs.lfd.summaryFlex;
        var totalSwLensCfaXPerpSeis = this.getTotalSwLen(inputs.UXWallSkus.y, summaryFlex.seisFlexWallLenY);
        var totalSwLensCfaXPerpWind = this.getTotalSwLen(inputs.UXWallSkus.y, summaryFlex.seisFlexWallLenY);
        var totalSwLensCfaYPerpSeis = this.getTotalSwLen(inputs.UXWallSkus.x, summaryFlex.seisFlexWallLenX);
        var totalSwLensCfaYPerpWind = this.getTotalSwLen(inputs.UXWallSkus.x, summaryFlex.windFlexWallLenX);
        var getUnitShearCfaXPerpSeis = this.getUnitShear(totalSwLensCfaXPerpSeis);
        var getUnitShearCfaXPerpWind = this.getUnitShear(totalSwLensCfaXPerpWind);
        var getUnitShearCfaYPerpSeis = this.getUnitShear(totalSwLensCfaYPerpSeis);
        var getUnitShearCfaYPerpWind = this.getUnitShear(totalSwLensCfaYPerpWind);
        var getCfaSwTypeXPerpSeis = this.getSwConfig(getUnitShearCfaXPerpSeis, aduConfig.shearWallCaps);
        var getCfaSwTypeXPerpWind = this.getSwConfig(getUnitShearCfaXPerpWind, aduConfig.shearWallCaps);
        var getCfaSwTypeYPerpSeis = this.getSwConfig(getUnitShearCfaYPerpSeis, aduConfig.shearWallCaps);
        var getCfaSwTypeYPerpWind = this.getSwConfig(getUnitShearCfaYPerpWind, aduConfig.shearWallCaps);
        var getDeflUnitShearPlfXPerpSeis = this.wdSwStiffness(getCfaSwTypeXPerpSeis, inputs);
        var getDeflUnitShearPlfXPerpWind = this.wdSwStiffness(getCfaSwTypeXPerpWind, inputs);
        var getDeflUnitShearPlfYPerpSeis = this.wdSwStiffness(getCfaSwTypeYPerpSeis, inputs);
        var getDeflUnitShearPlfYPerpWind = this.wdSwStiffness(getCfaSwTypeYPerpWind, inputs);
        var strDeflSwConfigXPerpSeis = this.getSwConfig(getDeflUnitShearPlfXPerpSeis, aduConfig.shearWallCaps);
        var strDeflSwConfigXPerpWind = this.getSwConfig(getDeflUnitShearPlfXPerpWind, aduConfig.shearWallCaps);
        var strDeflSwConfigYPerpSeis = this.getSwConfig(getDeflUnitShearPlfYPerpSeis, aduConfig.shearWallCaps);
        var strDeflSwConfigYPerpWind = this.getSwConfig(getDeflUnitShearPlfYPerpWind, aduConfig.shearWallCaps);
        var swTypeCntrlYPerpSeis = this.getSwTypeCntrl(strDeflSwConfigYPerpSeis);
        var swTypeCntrlYPerpWind = this.getSwTypeCntrl(strDeflSwConfigYPerpWind);
        var swTypeCntrlXPerpSeis = this.getSwTypeCntrl(strDeflSwConfigXPerpSeis);
        var swTypeCntrlXPerpWind = this.getSwTypeCntrl(strDeflSwConfigXPerpWind);
        var finalSwConfigXPerp = this.getFinalSwConfig(swTypeCntrlXPerpSeis, swTypeCntrlXPerpWind);
        var finalSwConfigYPerp = this.getFinalSwConfig(swTypeCntrlYPerpSeis, swTypeCntrlYPerpWind);
        var yShearWalls = this.getHduConfig(finalSwConfigXPerp, aduConfig.hduCaps);
        var xShearWalls = this.getHduConfig(finalSwConfigYPerp, aduConfig.hduCaps);
        res = {
            yShearWalls: yShearWalls,
            yShearWallsCFA: this.cfaShearWallResults(yShearWalls),
            xShearWalls: xShearWalls,
            xShearWallsCFA: this.cfaShearWallResults(xShearWalls),
        };
        return res;
    };
    NdsShearWallCalc.prototype.getTotalSwLen = function (arr, arr2) {
        var swLens = {};
        var totalForce;
        var forceType;
        var newArr = arr.map(function (item) {
            var length = (item.xLength) ? item.xLength : item.yLength;
            //per NDS 4.3.6.4.1.1 perWallCo should be applied to sw length
            //per NDS 4.3.4.2 aspectRatioFtr should be applied to nom. SW capcty
            var lengthEff = length * item.perfWallCo * item.aspectRatioFtr;
            swLens[item.coord] = swLens[item.coord] + lengthEff || lengthEff;
            var newItem = {};
            Object.assign(newItem, item);
            newItem['lengthEff'] = lengthEff;
            return newItem;
        });
        var rest = newArr.map(function (item) {
            for (var i = 0; i < arr2.length; i++) {
                if (arr2[i].coord == item.coord) {
                    totalForce = arr2[i].force;
                    forceType = arr2[i].forceType;
                }
            }
            var newItem = {};
            Object.assign(newItem, item);
            newItem['totalSwLen'] = swLens[item.coord];
            newItem['totalForce'] = totalForce;
            newItem['forceType'] = forceType;
            return newItem;
        });
        // console.log('rest', rest)
        return rest;
    };
    NdsShearWallCalc.prototype.getUnitShear = function (arr) {
        var forceRatio;
        var swForce;
        var unitShearPlf;
        arr.map(function (item) {
            forceRatio = item.lengthEff / item.totalSwLen;
            swForce = item.totalForce * forceRatio;
            unitShearPlf = swForce / item.lengthEff;
            Object.assign(item, {
                forceRatio: forceRatio,
                swForce: swForce,
                unitShearPlf: unitShearPlf
            });
        });
        return arr;
    };
    NdsShearWallCalc.prototype.getSwConfig = function (arr, obj) {
        arr.map(function (item) {
            var unitShearStr;
            var unitShearDefl;
            var strCfaSwConfig;
            var deflCfaSwConfig;
            if (item.forceType == 'wind') {
                for (var key in obj['wind']) {
                    if (item.unitShearPlf < key) {
                        unitShearStr = key;
                        break;
                    }
                }
                for (var key in obj['wind']) {
                    if (item.resultGa == obj['wind'][key]['stiffnessGa']) {
                        unitShearDefl = key;
                    }
                }
            }
            else {
                for (var key in obj['eq']) {
                    if (item.unitShearPlf < key) {
                        unitShearStr = key;
                        break;
                    }
                }
                for (var key in obj['eq']) {
                    if (item.resultGa == obj['eq'][key]['stiffnessGa']) {
                        unitShearDefl = key;
                        break;
                    }
                }
            }
            strCfaSwConfig = obj[item.forceType][unitShearStr];
            deflCfaSwConfig = obj[item.forceType][unitShearDefl];
            Object.assign(item, {
                unitShearDefl: unitShearDefl,
                strCfaSwConfig: strCfaSwConfig,
                deflCfaSwConfig: deflCfaSwConfig
            });
        });
        return arr;
    };
    NdsShearWallCalc.prototype.wdSwStiffness = function (arr, inputs) {
        var hdPostDeflConst = {
            elastModulus: 1600000,
            Area: 30.25,
        };
        var hdu14CapPlbs = 14445;
        var deltaAnchor = 0.182;
        var KHDU = deltaAnchor / hdu14CapPlbs;
        var stiffnessGaArr = [16, 20, 22, 28, 40, 44, 56];
        var unitShear;
        var lrfdElastDrift;
        var formula;
        var resultGa;
        var hduForce;
        var deflBending;
        var deflShear;
        var deflAnchorSlip;
        var zPow = 8 * Math.pow(inputs.avgHt, 3);
        // const khuTimes = KHDU * Math.pow(inputs.avgHt, 2);
        var eaTimes = hdPostDeflConst.elastModulus * hdPostDeflConst.Area;
        arr.map(function (item) {
            var swLenDefl = item.lengthEff / item.aspectRatioFtr;
            if (item.forceType == "wind") {
                lrfdElastDrift = (inputs.avgHt * inputs.allWindDriftFtr * 12);
                unitShear = (item.unitShearPlf / 0.6) * inputs.windDriftReductFtr * item.aspectRatioFtr;
            }
            else {
                lrfdElastDrift = (inputs.avgHt * inputs.elffpx.allStoryDriftFtr * 12);
                unitShear = (item.unitShearPlf / 0.7) * item.aspectRatioFtr;
            }
            hduForce = unitShear * inputs.avgHt;
            for (var i = 0; i < stiffnessGaArr.length; i++) {
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
                resultGa: resultGa,
                hduForce: hduForce
            });
        });
        return arr;
    };
    ;
    NdsShearWallCalc.prototype.getSwTypeCntrl = function (arr) {
        arr.map(function (item) {
            var swTypeCntrl = (item.strCfaSwConfig.value > item.deflCfaSwConfig.value)
                ? item.strCfaSwConfig : item.deflCfaSwConfig;
            Object.assign(item, {
                swTypeCntrl: swTypeCntrl
            });
        });
        return arr;
    };
    NdsShearWallCalc.prototype.getFinalSwConfig = function (arr, arr1) {
        var resArr = [];
        arr.map(function (item, index) {
            if (item.swTypeCntrl.value > arr1[index].swTypeCntrl.value) {
                resArr.push(item);
            }
            else {
                resArr.push(arr1[index]);
            }
        });
        return resArr;
    };
    NdsShearWallCalc.prototype.getHduConfig = function (arr, obj) {
        var hdu;
        arr.map(function (item) {
            var hduCapcity;
            var hduConfig;
            for (hdu in obj) {
                if (obj[hdu] > item.hduForce) {
                    hduConfig = hdu;
                    hduCapcity = obj[hdu];
                    break;
                }
            }
            Object.assign(item, {
                hduConfig: hduConfig,
                hduCapcity: hduCapcity
            });
        });
        return arr;
    };
    NdsShearWallCalc.prototype.cfaShearWallResults = function (arr) {
        var res = {};
        arr.map(function (item) {
            res[item.cfaWebID] = {
                value: item.swTypeCntrl.type
            };
        });
        return res;
    };
    return NdsShearWallCalc;
}());
exports.NdsShearWallCalc = NdsShearWallCalc;
exports.default = NdsShearWallCalc;
