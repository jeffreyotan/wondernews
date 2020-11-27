import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NewsDatabase } from '../news.database';
import { CountryDetails, NewsArticle } from '../models';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  countryId: string = "";
  countryName: string = "";
  countryHeadlines: NewsArticle[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.countryId = this.activatedRoute.snapshot.params.country;
    this.getCountryDetails();
    this.getHeadlines();
  }

  async getCountryDetails() {
    let countryDetails: CountryDetails = { code: "", name: "", flagUrl: "" };
    countryDetails = await this.newsDB.getCountryDetail(this.countryId);
    this.countryName = countryDetails.name;
  }

  async getHeadlines() {
    this.countryHeadlines = await this.newsDB.getHeadlines(this.countryId);
  }

  onClickBack() {
    this.router.navigate(['/list']);
  }

}
