import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.newsDB.getApiKey()
      .then(result => {
        if(result.length > 0) {
          const apikey = result[0].apikey;
          console.info("=> Home Key:", apikey);
          if(apikey) {
            this.router.navigate(['/list']);
          } else {
            this.router.navigate(['/setting']);
          }
        } else {
          this.router.navigate(['/setting']);
        }
        
      });
  }

}
