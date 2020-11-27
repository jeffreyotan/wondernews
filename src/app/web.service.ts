import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CountryDetails } from './models';

@Injectable()
export class WebServices {

    countrySrvUrl: string = "https://restcountries.eu/rest/v2/alpha";

    constructor(private http: HttpClient) {}

    getCountryDetails(countryCode: string): Promise<CountryDetails> {
        let retVal: CountryDetails = { code: "", name: "", flagUrl: "" };
        const newDetails: Promise<CountryDetails> = new Promise( () => {
            this.http.get(this.countrySrvUrl + '/' + countryCode).toPromise().then(result => {
                if(result) {
                    retVal.code = result['alpha2Code'];
                    retVal.name = result['name'];
                    retVal.flagUrl = result['flag'];
                }
                console.info("=> CountryDetails: ", result);
                console.info("=> CountryDetails2: ", retVal);
                return retVal;
            });
        });
        return newDetails;
    }

}

