import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

import { CountryDetails } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  countryList: CountryDetails[] = [];

  countryCodes: string[] = ['ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn',
                            'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu',
                            'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma',
                            'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro',
                            'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw',
                            'ua', 'us', 've', 'za'];

  constructor(private router: Router, private newsDB: NewsDatabase, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCountryDetails();
  }

  async getCountryDetails() {
    for(let i=0; i< this.countryCodes.length; i++) {
      const newDetail = await this.newsDB.getCountryDetail(this.countryCodes[i]);
      // console.info("=> ListComponent: ", newDetail);
      this.countryList.push(newDetail);
    }
  }

  onClickSetting(): void {
    this.router.navigate(['/setting']);
  }

}
