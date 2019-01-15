import { Component, OnInit } from '@angular/core';
import { UtilsService } from "../../utils.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  
    public allDeals = [];

    public filterButtons = [
        {  'class': '',  'icon': 'fa-user',  'title': '4 you' },
        {  'class': 'bordered',  'icon': 'fa-list-ul',  'title': 'All' },
        {  'class': '',  'icon': 'fa-map-marker',  'title': 'Local' },
        {  'class': '',  'icon': 'fa-bookmark',  'title': 'Saved' }
    ];
  
      pageId = 1;
  
  
    constructor(
      private utils: UtilsService,
      private router: Router, 
    ){}
  
    ngOnInit() {
      this.utils.returnLoggedInOrNot();
      this.getAllCoupons( this.pageId, undefined);
    }
  
    pushToCollection(where, data){
  
      data.map( oneData => where.push(oneData) );
    }
  
      getAllCoupons(page, filterBy){
  
          this.allDeals = [];
  
          this.utils.getAllCoupons(page, filterBy).subscribe(
              res =>{
                  console.log( res );
                // this.pushToCollection( this.allDeals, res );
              },
              err =>{
                console.log( err );
              }
            );
      
      };
  
  
  
      selectThisButton( btn ){
          let btnTitle = btn.title;
  
          this.filterButtons.map( oneBtn =>{
  
              if(oneBtn.title === btnTitle){
                oneBtn.class = 'bordered';
                  this.filterThisResults(btnTitle);
              }else{
                  oneBtn.class = '';
              }
  
          });
  
      }
  
      filterThisResults(by){
  
          const page = 1;
          let filterBy =  'all';
          let callFiter = false;
  
          if( by === '4 you'){
              filterBy= 'matchedDeals';
              callFiter = true;
  
          }else if( by === 'All'){
              filterBy= undefined;
              callFiter = true;
  
          }else if( by === 'Local'){
  
              this.utils.getTheUserLocation();
  
              if( localStorage.getItem('userLocation') == null ){
                  callFiter = false;
              }else{
                  callFiter = true;
              }
  
              filterBy= 'localDeals'
  
          }else if( by === 'Saved'){
              filterBy= 'savedDeals'
          }
  
          // check and call
          if( callFiter === true ){
              this.callFilteredApi(page,filterBy);
          }
  
      }
  
      callFilteredApi(page,filterBy){
  
          console.log(filterBy);
  
          this.getAllCoupons(page, filterBy);
      }
    
  

}