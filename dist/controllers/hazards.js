'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var structApis_1 = require("./structApis");
var googleApis_1 = require("./googleApis");
var Hazards = /** @class */ (function () {
    function Hazards() {
        var _this = this;
        this.structApis = {};
        this.formValues = {};
        this.placesAPI = googleApis_1.default['placesAPI'];
        this.formValues = function (item) {
            var formValues = {};
            $('form').serializeArray().map(item);
            formValues[item.name] = item.value;
            _this.structApis = new structApis_1.default(formValues);
        };
    }
    Hazards.prototype.calc = function () {
        var hazards = this.structApis;
        var seisData = hazards.seis;
        var winData = hazards.wind;
        var snowData = hazards.snow;
        var otherInfo = this.formValues.otherInfo;
        this.placesAPI();
        return this.renderResult(seisData, winData, snowData, otherInfo);
    };
    ;
    Hazards.prototype.renderResult = function (seisData, winData, snowData, otherInfo) {
        var cs = (seisData.response.data.sds * otherInfo.seisImpFtr) / otherInfo.respModFtr;
        return "\n        <div>\n            <ul>\n                <li> Date: " + seisData.request.date + "</li>\n                <li> Project: " + seisData.request.parameters.title + "</li>\n                <li> Building Type: " + otherInfo.bldgType + "</li>\n                <li> Address: " + otherInfo.address + "</li>\n                    <ul>    \n                        <li>Latitude:  " + seisData.request.parameters.latitude + "</li>\n                        <li>Longitude:  " + seisData.request.parameters.longitude + "</li>\n                        <li>Risk Category:  " + seisData.request.parameters.riskCategory + "</li>\n                        <li>Site Class:  " + seisData.request.parameters.siteClass + "</li>\n                    </ul>\n                <li> Code: " + seisData.request.referenceDocument + "</li>            \n            </ul>\n        </div>\n    \n        <div>\n            <ul>\n                <li class=\"bold\"> USGS Design Criteria </li>\n                    <ul>\n                        <li> pga: " + seisData.response.data.pga + "</li>\n                        <li> Fpga: " + seisData.response.data.fpga + "</li>\n                        <li> PgaM: " + seisData.response.data.pgam + "</li>\n                        <li> Ss: " + seisData.response.data.ss + "</li>\n                        <li> S1: " + seisData.response.data.s1 + "</li> \n                        <li> Sm1: " + seisData.response.data.sm1 + "</li>\n                        <li> Sms: " + seisData.response.data.sms + "</li>\n                        <li> Fa: " + seisData.response.data.fa + "</li>\n                        <li> Fv: " + seisData.response.data.fv + "</li>\n                        <li> Sds: " + seisData.response.data.sds + "</li>\n                        <li> Sd1: " + seisData.response.data.sd1 + "</li>\n                        <li> SDC.Cntrl: " + seisData.response.data.sdc + "</li>\n                        <li> TL: " + seisData.response.data['t-sub-l'] + "<li>\n                    </ul>\n            </ul>   \n        </div>\n        <div>\n        <ul>\n            <li class=\"bold\"> Seismic Properties</li>\n                <ul>\n                    <li> Cs: " + cs + "</li>\n                </ul>\n        </ul>        \n    </div>\n    \n    <div>\n    <ul>\n        <li class=\"bold\"> ATC WINDSPEEDS </li>\n            <ul>\n            <li> ELEVATION: " + winData.data.elevation + " </li>\n                <li> ASCE 7-16: </li>\n                    <ul>\n                        <li> riskCat I: " + winData.data.datasets[4].data.value + " </li>\n                        <li> riskCat II: " + winData.data.datasets[5].data.value + "</li>\n                        <li> riskCat III: " + winData.data.datasets[6].data.value + "</li>\n                        <li> riskCat IV: " + winData.data.datasets[7].data.value + "</li>\n                    </ul>\n            </ul>\n            <ul>\n                <li> ASCE 7-10: </li>\n                    <ul>\n                        <li> riskCat I: " + winData.data.datasets[12].data.value + "</li>\n                        <li> riskCat II: " + winData.data.datasets[13].data.value + "</li>\n                        <li> riskCat III-IV: " + winData.data.datasets[14].data.value + "</li>\n                    </ul>\n            </ul>\n    </ul>\n    </div>\n    \n    <div>\n    <ul>\n        <li class=\"bold\"> ATC SNOW LOADS </li>\n            <ul>\n            <li> ELEVATION: " + snowData.data.elevation + " </li>\n                <li> ASCE 7-16: </li>\n                    <ul>\n                        <li>Grd Snow Load: " + snowData.data.datasets[0].data.value + " </li>\n                    </ul>\n            </ul>\n            <ul>\n                <li> ASCE 7-10: </li>\n                    <ul>\n                        <li>Grd Snow Load: " + snowData.data.datasets[1].data.value + "</li>\n                    </ul>\n            </ul>\n    </ul>\n    </div>\n    \n      ";
    };
    return Hazards;
}());
exports.default = Hazards;
