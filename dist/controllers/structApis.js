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
Object.defineProperty(exports, "__esModule", { value: true });
`use strict`;
const axios_1 = require("axios");
class StructAPIs {
    constructor(address, riskCategory, siteClass, title) {
        this.usgsURL = `https://earthquake.usgs.gov/ws/designmaps/asce7-10.json`;
        this.geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?`;
        this.medeekApiURL = `http://design.medeek.com/resources/medeekapi.pl?`;
        this.results = {};
        this.address = address;
        this.riskCategory = riskCategory;
        this.siteClass = siteClass;
        this.title = title;
    }
    calc() {
        let geo = this.getLatLongFromAddress(this.geoCodeURL, this.address);
        let seis = this.usgsApiRequest(geo, this.riskCategory, this.siteClass, this.title);
        let snow = this.getMedeekWindSpeed(this.medeekApiURL, geo);
        let wind = this.getMedeekGrdSnowLoad(this.medeekApiURL, geo);
        this.results = {
            geo,
            seis,
            snow,
            wind
        };
        return this.results;
    }
    getLatLongFromAddress(geoCodeURL, address) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            let latLongObj;
            try {
                res = yield axios_1.default.get(geoCodeURL, {
                    params: {
                        address,
                        key: `AIzaSyAS1ppQZ0RbK3k5Zv121KdtG61DqY_Mrno`
                    }
                });
                latLongObj = this.getLatLong(res);
                return latLongObj;
            }
            catch (e) {
                console.log(`google latlong error`);
            }
        });
    }
    getLatLong(res) {
        let latLong;
        latLong = res.data.results[0].geometry.location;
        return latLong;
    }
    usgsApiRequest(geo, riskCategory, siteClass, title) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                //need to figure out to implement asce7-16 into the usgsURL...
                res = yield axios_1.default.get(this.usgsURL, {
                    params: {
                        latitude: geo,
                        longitude: geo,
                        riskCategory,
                        siteClass,
                        title
                    }
                });
                let { data } = res.data;
                return data;
            }
            catch (err) {
                console.log(`usgs error`);
            }
        });
    }
    getMedeekWindSpeed(medeekApiURL, geo, asce7Code) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios_1.default.get(medeekApiURL, {
                    params: {
                        lat: geo,
                        lng: geo,
                        output: 'json',
                        action: 'asce710wind',
                        key: 'MEDEEK13522911'
                    }
                });
                return res;
            }
            catch (e) {
                console.log(`medeek wind api error`);
            }
        });
    }
    getMedeekGrdSnowLoad(medeekApiURL, geo) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios_1.default.get(medeekApiURL, {
                    params: {
                        lat: geo,
                        lng: geo,
                        output: 'json',
                        action: 'ascesnow',
                        key: 'MEDEEK13522911'
                    }
                });
                return res;
            }
            catch (e) {
                console.log(`medeek snow api error`);
            }
        });
    }
}
exports.default = StructAPIs;