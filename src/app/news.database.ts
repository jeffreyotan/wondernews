import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { ApikeyStore, CountryDetails, NewsArticle } from './models';
import { WebServices } from './web.service';

@Injectable()
export class NewsDatabase extends Dexie {

    private apikey: Dexie.Table<ApikeyStore, number>;
    private countries: Dexie.Table<CountryDetails, string>;
    private articles: Dexie.Table<NewsArticle, number>;

    countrySrvUrl: string = "https://restcountries.eu/rest/v2/alpha";
    newsApiUrl: string = "https://newsapi.org/v2/top-headlines";

    globalTime: Date = new Date();
    maxLapsedTime = 5*60*1000;

    constructor(private http: HttpClient) {
        super('newsDB');
        this.version(3).stores({
            apiKey: '++id,apikey',
            countryList: 'code',
            newsArticle: '++newsId,country,saved'
        });
        this.apikey = this.table('apiKey');
        this.countries = this.table('countryList');
        this.articles = this.table('newsArticle');
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

    async getHeadlines(country: string) {
        const headline: NewsArticle[] = [];

        const dbArticles = await this.articles.where('country').equals(country.toUpperCase()).toArray();
        if(dbArticles.length <= 0) {
            const queryString = this.newsApiUrl + await this.createQuery(country);
            // console.info("=> getHeadline0: ", queryString);
            const result = await this.http.get(queryString).toPromise();
            // console.info("=> getHeadline1: ", result);
            if(result['status'] === "ok") {
                const currentTime = this.globalTime.getTime();
                console.info("=> CacheTime0: ", currentTime);
                const articleArray = result['articles'];
                for(let i=0; i<articleArray.length; i++) {
                    const newArticle: NewsArticle = {
                        country: country,
                        sourceName: articleArray[i]['source']['name'],
                        author: articleArray[i]['author'],
                        title: articleArray[i]['title'],
                        description: articleArray[i]['description'],
                        articleUrl: articleArray[i]['url'],
                        imageUrl: articleArray[i]['urlToImage'],
                        pubTime: articleArray[i]['publishedAt'],
                        content: articleArray[i]['content'],
                        saved: false,
                        syncTime: currentTime
                    };
                    headline.push(newArticle);
                }
            }

            this.storeHeadlines(headline);
        } else { // there are articles in the db
            const articleTime = dbArticles[0]['syncTime'];
            if(this.globalTime.getTime() - articleTime > this.maxLapsedTime) {
                this.removeHeadlines(country.toUpperCase());
                const queryString = this.newsApiUrl + await this.createQuery(country);
                // console.info("=> getHeadline0: ", queryString);
                const result = await this.http.get(queryString).toPromise();
                // console.info("=> getHeadline1: ", result);
                if(result['status'] === "ok") {
                    const currentTime = this.globalTime.getTime();
                    console.info("=> CacheTime0: ", currentTime);
                    const articleArray = result['articles'];
                    for(let i=0; i<articleArray.length; i++) {
                        const newArticle: NewsArticle = {
                            country: country,
                            sourceName: articleArray[i]['source']['name'],
                            author: articleArray[i]['author'],
                            title: articleArray[i]['title'],
                            description: articleArray[i]['description'],
                            articleUrl: articleArray[i]['url'],
                            imageUrl: articleArray[i]['urlToImage'],
                            pubTime: articleArray[i]['publishedAt'],
                            content: articleArray[i]['content'],
                            saved: false,
                            syncTime: currentTime
                        };
                        headline.push(newArticle);
                    }
                }
            } else {
                for(let j=0; j<dbArticles.length; j++)
                headline.push(dbArticles[j]);
            }
        }

        return headline;
    }

    async storeHeadlines(headline: NewsArticle[]) {
        for(let i=0; i<headline.length; i++) {
            this.articles.put(headline[i]);
        }
    }

    async removeHeadlines(country: string) {
        this.articles.where('country').equals(country).and(result => !(result.saved)).delete();
    }

    async createQuery(country: string) {
        const apiKey = await this.getApiKey();
        console.info("=> CreateQuery: ", apiKey[0]['apikey']);
        const finalQuery = "?country=" + country.toLowerCase() + "&apiKey=" + apiKey[0]['apikey'];
        return finalQuery;
    }

}