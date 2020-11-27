import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { ApikeyStore, CountryDetails } from './models';

@Injectable()
export class NewsDatabase extends Dexie {

    private apikey: Dexie.Table<ApikeyStore, number>;
    private countries: Dexie.Table<CountryDetails, string>;

    constructor() {
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
}