import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {AppComponent} from './app.component';
import {Topnavbar} from "./components/topnavbar/topnavbar.component";
import {Navigation} from "./components/navigation/navigation.component";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./app.routes";
import {HttpClientModule} from '@angular/common/http';

import {HomeComponent} from "./pages/home/home.component";
import { UtilsService } from "./utils.service";
import { EventComponent } from './pages/event/event.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { DealsComponent } from './pages/deals/deals.component';

import { ProfileComponent } from './components/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { safeContent } from './safeContent.pipe';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';


import {
  MatSnackBarModule,
} from '@angular/material';

import { SearchComponent } from './pages/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    Navigation,
    Topnavbar,
    HomeComponent,
    EventComponent,
    CouponComponent,
    WishlistComponent,
    DealsComponent,
    ProfileComponent,
    safeContent,
    SearchComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    LoadingBarHttpClientModule
  ],
  providers: [
    UtilsService,
  ],
  bootstrap: [
    AppComponent, 
  ]
})
export class AppModule { }
