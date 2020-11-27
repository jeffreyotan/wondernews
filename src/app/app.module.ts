import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { SettingComponent } from './components/setting.component';
import { ListComponent } from './components/list.component';
import { NewsComponent } from './components/news.component';
import { HomeComponent } from './components/home.component';
import { NewsDatabase } from './news.database';
import { WebServices } from './web.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'

const ROUTES: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "list", component: ListComponent },
  { path: "setting", component: SettingComponent },
  { path: "news/:country", component: NewsComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  declarations: [
    AppComponent,
    SettingComponent,
    ListComponent,
    NewsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    NewsDatabase,
    WebServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
