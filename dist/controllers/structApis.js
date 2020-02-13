"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var apiKeys_1 = require("../apiKeys");
var StructAPIs = /** @class */ (function () {
    function StructAPIs(formValues) {
        this.usgsURL = "https://earthquake.usgs.gov/ws/designmaps/asce7-10.json";
        this.geoCodeURL = "https://maps.googleapis.com/maps/api/geocode/json?";
        this.medeekApiURL = "http://design.medeek.com/resources/medeekapi.pl?";
        this.formValues = {};
        this.results = {};
        this.googleApiKey = apiKeys_1.default['usgsSeisAPI'];
        this.formValues = formValues;
    }
    StructAPIs.prototype.calc = function () {
        var geo = this.getLatLongFromAddress(this.geoCodeURL, this.formValues.address, this.googleApiKey);
        var seis = this.usgsApiRequest(geo, this.formValues.riskCategory, this.formValues.siteClass, this.formValues.title);
        var snow = this.getMedeekWindSpeed(this.medeekApiURL, geo);
        var wind = this.getMedeekGrdSnowLoad(this.medeekApiURL, geo);
        this.results = {
            geo: geo,
            seis: seis,
            snow: snow,
            wind: wind
        };
        return this.results;
    };
    StructAPIs.prototype.getLatLongFromAddress = function (geoCodeURL, address, googleApiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var res, latLongObj, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(geoCodeURL, {
                                params: {
                                    address: address,
                                    key: googleApiKey
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        latLongObj = this.getLatLong(res);
                        return [2 /*return*/, latLongObj];
                    case 2:
                        e_1 = _a.sent();
                        console.log("google latlong error");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StructAPIs.prototype.getLatLong = function (res) {
        var latLong;
        latLong = res.data.results[0].geometry.location;
        return latLong;
    };
    StructAPIs.prototype.usgsApiRequest = function (geo, riskCategory, siteClass, title) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(this.usgsURL, {
                                params: {
                                    latitude: geo,
                                    longitude: geo,
                                    riskCategory: riskCategory,
                                    siteClass: siteClass,
                                    title: title
                                }
                            })];
                    case 1:
                        //need to figure out to implement asce7-16 into the usgsURL...
                        res = _a.sent();
                        data = res.data.data;
                        return [2 /*return*/, data];
                    case 2:
                        err_1 = _a.sent();
                        console.log("usgs error");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StructAPIs.prototype.getMedeekWindSpeed = function (medeekApiURL, geo, asce7Code) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(medeekApiURL, {
                                params: {
                                    lat: geo,
                                    lng: geo,
                                    output: 'json',
                                    action: 'asce710wind',
                                    key: 'MEDEEK13522911'
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        e_2 = _a.sent();
                        console.log("medeek wind api error");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StructAPIs.prototype.getMedeekGrdSnowLoad = function (medeekApiURL, geo) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(medeekApiURL, {
                                params: {
                                    lat: geo,
                                    lng: geo,
                                    output: 'json',
                                    action: 'ascesnow',
                                    key: 'MEDEEK13522911'
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        e_3 = _a.sent();
                        console.log("medeek snow api error");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return StructAPIs;
}());
exports.default = StructAPIs;
