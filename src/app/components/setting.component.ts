import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      apikey: this.fb.control("", [ Validators.required ] )
    });
  }

  onClickAdd(): void {
    const apiKey: string = this.form.get('apikey').value;
    this.newsDB.setApiKey(apiKey);
    this.router.navigate(['/home']);
  }

  onClickDelete(): void {
    const apiKey: string = this.form.get('apikey').value;
    this.newsDB.deleteApiKey(apiKey);
    this.router.navigate(['/home']);
  }

  onClickBack(): void {
    this.router.navigate(['/']);
  }

}
