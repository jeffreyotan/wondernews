import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { ApikeyStore, CountryDetails } from './models';
import { WebServices } from './web.service';

@Injectable()
export class NewsDatabase extends Dexie {

    private apikey: Dexie.Table<ApikeyStore, number>;
    private countries: Dexie.Table<CountryDetails, string>;

    countrySrvUrl: string = "https://restcountries.eu/rest/v2/alpha";

    constructor(private http: HttpClient) {
        super('newsDB');
        this.version(2).stores({
            apiKey: '++id,apikey',
            countryList: 'code'
            // newsArticle: '++newId'
        });
        this.apikey = this.table('apiKey');
        this.countries = this.table('countryList');
    }

    async getApiKey(): Promise<any> {
        return this.apikey.toArray();
    }

    setApiKey(newKey: string): number {
        console.info("==> Inside setApiKey: ", newKey);
        let index: number = -1;
        const key: ApikeyStore = {
            apikey: newKey
        };
        this.apikey.put(key).then(result => {
            console.info("=> apikey: ", result);
            if(result > 0) {
                index = result;
            }
        });
        return index;
    }

    // returns true if delete is successful, false otherwise
    deleteApiKey(newKey: string): boolean {
        let isSuccessful = false;
        this.apikey.where('apikey').equals(newKey).delete()
            .then(result => {
                console.info('==> Delete result: ', result);
                if(result > 0) {
                    isSuccessful = true;
                }
            });
        return isSuccessful;
    }

    async getCountryDetail(code: string): Promise<any> {
        let retVal: CountryDetails = { code: "", name: "", flagUrl: "" };

        const result = await this.countries.where('code').equals(code.toUpperCase()).toArray();
        // console.info("=> Details0: ", result);
        if(result.length <= 0) {
            const newResult = await this.http.get(this.countrySrvUrl + '/' + code).toPromise();
            if(newResult) {
                // console.info("=> Details1: ", newResult);
                retVal.code = newResult['alpha2Code'];
                retVal.name = newResult['name'];
                retVal.flagUrl = newResult['flag'];
                this.countries.put(retVal, retVal[code]);
            }
        } else {
            // console.info("=> Details2: ", result);
            retVal.code = result[0]['code'];
            retVal.name = result[0]['name'];
            retVal.flagUrl = result[0]['flagUrl'];
        }
        return retVal;
    }

    async addCountryDetail(country: CountryDetails) {
        return this.countries.put(country, country.code);
    }
}