import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class WebServices {

    countrySrvUrl: string = "https://restcountries.eu/rest/v2/alpha";

    constructor(private http: HttpClient) {} 

}

