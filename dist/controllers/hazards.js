'use strict';
import StructAPIs from "./structApis";
class Hazards {
    constructor() {
        this.structApis = {};
        this.formValues = {};
        this.formValues = (item) => {
            let formValues = {};
            $('form').serializeArray().map(item);
            formValues[item.name] = item.value;
            this.structApis = new StructAPIs(formValues);
        };
    }
    calc() {
        const hazards = this.structApis;
        const seisData = hazards.seis;
        const winData = hazards.wind;
        const snowData = hazards.snow;
        const otherInfo = this.formValues.otherInfo;
        return this.renderResult(seisData, winData, snowData, otherInfo);
    }
    ;
    renderResult(seisData, winData, snowData, otherInfo) {
        let cs = (seisData.response.data.sds * otherInfo.seisImpFtr) / otherInfo.respModFtr;
        return `
        <div>
            <ul>
                <li> Date: ${seisData.request.date}</li>
                <li> Project: ${seisData.request.parameters.title}</li>
                <li> Building Type: ${otherInfo.bldgType}</li>
                <li> Address: ${otherInfo.address}</li>
                    <ul>    
                        <li>Latitude:  ${seisData.request.parameters.latitude}</li>
                        <li>Longitude:  ${seisData.request.parameters.longitude}</li>
                        <li>Risk Category:  ${seisData.request.parameters.riskCategory}</li>
                        <li>Site Class:  ${seisData.request.parameters.siteClass}</li>
                    </ul>
                <li> Code: ${seisData.request.referenceDocument}</li>            
            </ul>
        </div>
    
        <div>
            <ul>
                <li class="bold"> USGS Design Criteria </li>
                    <ul>
                        <li> pga: ${seisData.response.data.pga}</li>
                        <li> Fpga: ${seisData.response.data.fpga}</li>
                        <li> PgaM: ${seisData.response.data.pgam}</li>
                        <li> Ss: ${seisData.response.data.ss}</li>
                        <li> S1: ${seisData.response.data.s1}</li> 
                        <li> Sm1: ${seisData.response.data.sm1}</li>
                        <li> Sms: ${seisData.response.data.sms}</li>
                        <li> Fa: ${seisData.response.data.fa}</li>
                        <li> Fv: ${seisData.response.data.fv}</li>
                        <li> Sds: ${seisData.response.data.sds}</li>
                        <li> Sd1: ${seisData.response.data.sd1}</li>
                        <li> SDC.Cntrl: ${seisData.response.data.sdc}</li>
                        <li> TL: ${seisData.response.data['t-sub-l']}<li>
                    </ul>
            </ul>   
        </div>
        <div>
        <ul>
            <li class="bold"> Seismic Properties</li>
                <ul>
                    <li> Cs: ${cs}</li>
                </ul>
        </ul>        
    </div>
    
    <div>
    <ul>
        <li class="bold"> ATC WINDSPEEDS </li>
            <ul>
            <li> ELEVATION: ${winData.data.elevation} </li>
                <li> ASCE 7-16: </li>
                    <ul>
                        <li> riskCat I: ${winData.data.datasets[4].data.value} </li>
                        <li> riskCat II: ${winData.data.datasets[5].data.value}</li>
                        <li> riskCat III: ${winData.data.datasets[6].data.value}</li>
                        <li> riskCat IV: ${winData.data.datasets[7].data.value}</li>
                    </ul>
            </ul>
            <ul>
                <li> ASCE 7-10: </li>
                    <ul>
                        <li> riskCat I: ${winData.data.datasets[12].data.value}</li>
                        <li> riskCat II: ${winData.data.datasets[13].data.value}</li>
                        <li> riskCat III-IV: ${winData.data.datasets[14].data.value}</li>
                    </ul>
            </ul>
    </ul>
    </div>
    
    <div>
    <ul>
        <li class="bold"> ATC SNOW LOADS </li>
            <ul>
            <li> ELEVATION: ${snowData.data.elevation} </li>
                <li> ASCE 7-16: </li>
                    <ul>
                        <li>Grd Snow Load: ${snowData.data.datasets[0].data.value} </li>
                    </ul>
            </ul>
            <ul>
                <li> ASCE 7-10: </li>
                    <ul>
                        <li>Grd Snow Load: ${snowData.data.datasets[1].data.value}</li>
                    </ul>
            </ul>
    </ul>
    </div>
    
      `;
    }
}
export default Hazards;
