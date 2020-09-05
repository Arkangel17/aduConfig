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
const apiKeys_1 = require("../apiKeys");
class StructAPIs {
    constructor(formValues) {
        this.formValues = formValues;
        this.usgsUrlBase = `https://earthquake.usgs.gov/ws/designmaps/`;
        this.geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?`;
        this.medeekApiURL = `http://design.medeek.com/resources/medeekapi.pl?`;
        this.results = {};
        this.calc = () => __awaiter(this, void 0, void 0, function* () {
            return this.getLatLongFromAddress(this.geoCodeURL, this.formValues, this.googleApiKey)
                .then(latLong => {
                let promises = [
                    this.usgsApiRequest(latLong, this.usgsUrlBase, this.formValues),
                    this.getMedeekWindSpeed(this.medeekApiURL, latLong, this.medeekApiKey),
                    this.getMedeekGrdSnowLoad(this.medeekApiURL, latLong, this.medeekApiKey),
                    latLong,
                    this.formValues
                ];
                let promiseAll = Promise.all(promises).then(res => {
                    let data = {
                        'seismic': res[0],
                        'wind': res[1],
                        'snow': res[2],
                        'geo': res[3],
                        'formValues': res[4]
                    };
                    console.log(data);
                    return data;
                })
                    .catch(err => { console.log('usgsApiPromiseAllError:', err); });
                return promiseAll.then(data => data);
            })
                .catch(err => { console.log('overallError', err); });
        });
        this.formValues = formValues;
        this.googleApiKey = apiKeys_1.default.usgsSeisAPI;
        this.medeekApiKey = apiKeys_1.default.medeekAPI;
    }
    getLatLongFromAddress(geoCodeURL, formValues, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * @desc get radians and return degrees
            * @param degrees: number
            * @return the result of the convertion
            */
            let res;
            let latLongObj;
            try {
                res = yield axios_1.default.get(geoCodeURL, {
                    params: {
                        address: formValues.address,
                        key: apiKey
                    }
                });
                latLongObj = res['data']['results'][0]['geometry']['location'];
                console.log('latLongObj', latLongObj);
                return latLongObj;
            }
            catch (err) {
                console.log(`getLatLongFromAddressError`, err);
            }
        });
    }
    usgsApiRequest(geo, usgsUrlBase, formValues) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * @desc get radians and return degrees
            * @param degrees: number
            * @return the result of the convertion
            */
            let usgsURL = usgsUrlBase + formValues.asceCodeVers + '.json?';
            console.log('usgsURL', usgsURL);
            let res;
            try {
                //need to figure out to implement asce7-16 into the usgsURL...
                res = yield axios_1.default.get(usgsURL, {
                    params: {
                        latitude: geo['lat'],
                        longitude: geo['lng'],
                        riskCategory: formValues.riskCat,
                        siteClass: formValues.siteSoilClass,
                        title: formValues.projectName
                    }
                });
                let { data } = res['data']['response'];
                return data;
            }
            catch (err) {
                console.log('usgsApiRequestError', err);
            }
        });
    }
    getMedeekWindSpeed(medeekApiURL, geo, apiKey, asce7Code) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * @desc get radians and return degrees
            * @param degrees: number
            * @return the result of the convertion
            */
            let res;
            let engrCode = (asce7Code === 'asce7-10') ? 'asce710wind' : 'asce716wind';
            try {
                res = yield axios_1.default.get(medeekApiURL, {
                    params: {
                        lat: geo['lat'],
                        lng: geo['lng'],
                        output: 'json',
                        action: engrCode,
                        key: apiKey
                    }
                });
                //   let { data } = res['data']['results']
                return res.data.results;
            }
            catch (err) {
                console.log(`getMedeekWindSpeed`, err);
            }
        });
    }
    getMedeekGrdSnowLoad(medeekApiURL, geo, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * @desc get radians and return degrees
            * @param degrees: number
            * @return the result of the convertion
            */
            let res;
            try {
                res = yield axios_1.default.get(medeekApiURL, {
                    params: {
                        lat: geo['lat'],
                        lng: geo['lng'],
                        output: 'json',
                        action: 'ascesnow',
                        key: apiKey
                    }
                });
                //   let { data } = res['data']['results']
                return res.data.results;
            }
            catch (err) {
                console.log(`getMedeekGrdSnowLoad`, err);
            }
        });
    }
}
exports.default = StructAPIs;
