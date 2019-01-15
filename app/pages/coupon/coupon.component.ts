import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilsService } from "../../utils.service";
import { Router } from "@angular/router";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {


  public advertisementImage = '../../assets/img/deals_2.png';

  public filterButtons = [
    {  'class': '',  'icon': 'fa-user',  'title': '4 you' },
    {  'class': 'bordered',  'icon': 'fa-list-ul',  'title': 'All' },
    {  'class': '',  'icon': 'fa-map-marker',  'title': 'Local' },
    {  'class': '',  'icon': 'fa-bookmark',  'title': 'Saved' }
  ];

 public userInteractionIcons = this.utils.userInteractionIcons;
 
    public pageId = 1;
    public savedDCoupons = [];
    public allDeals = [];


  constructor(
    private utils: UtilsService,
    private router: Router, 
    private sanitizer: DomSanitizer
  ){}

  ngOnInit() {
  }

  ngAfterViewInit(){
    //   this.getSavedCouponsHere();
    this.getAllCoupons( this.pageId, undefined);
  }

  /*
  get saved deals, then get all deals
  as your pushing the deals
  */
  pushToCollection(where, data){

    if( where === this.allDeals  ){

        data.map( oneData => {

            oneData.formattedDate = `${ new Date( oneData.entryTime ).getDay() }, ${ new Date( oneData.entryTime ).getMonth() }, ${ new Date( oneData.entryTime ).getFullYear()}`;
            console.log( oneData.formattedDate );   

        });


    }


    data.map( oneData => where.push(oneData) );

    this.savedDCoupons.map( data =>{

        this.allDeals.map( oneDeal =>{
                    if(oneDeal.id === data.id ){
                        console.log(oneDeal);
                        oneDeal.isBookmarked = true;
                    }
        });

    });



    this.allDeals = [...this.allDeals];

    console.log( this.allDeals );
  }



    getAllCoupons(page, filterBy){

        this.allDeals = [];

        this.utils.getAllCoupons(page, filterBy).subscribe(
            res =>{
              this.pushToCollection( this.allDeals, res );
              this.getSavedCouponsHere();
            },
            err =>{
              alert('Sorry we could not get the coupons, please try please check your internet connection');
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
            filterBy= 'matchedCoupons';
            callFiter = true;

        }else if( by === 'All'){
            filterBy= undefined;
            callFiter = true;

        }else if( by === 'Local'){

            this.utils.getTheUserLocation();

            filterBy= 'localCoupons';
            callFiter = true;

        }else if( by === 'Saved'){
            
            filterBy= 'savedCoupons';
            callFiter = true;
        }

        // check and call
        if( callFiter === true ){
            this.callFilteredApi(page,filterBy);
        }

    }

    callFilteredApi(page,filterBy){
        this.getAllCoupons(page, filterBy);
    }


    bookmarkThisCoupon(icon,dealId){

        if(icon.title === 'bookmark' && dealId.isBookmarked == true ){

            this.sendTheBookmarkDelete(dealId.id);
        }
        else  if(icon.title === 'bookmark' && dealId.isBookmarked == undefined ){

            this.sendTheBookmarkPost(dealId.id);
        }

    }
  

    getSavedCouponsHere(){
        
        if(this.utils.returnLoggedInOrNot() == true ){


                    this.savedDCoupons = [];

                    this.utils.getSavedCoupons().subscribe(
                        res =>{
                            console.log(res);
                            this.pushToCollection( this.savedDCoupons, res);
                        },
                        err =>{
                        }
                    );


        }
      

    }

    sendTheBookmarkDelete(dealId){

        console.warn(dealId);

        this.utils.deleteACouponBookmark(dealId).subscribe(
            res =>{
                this.getSavedCouponsHere();
            },
            err =>{
                alert('Sorry we unbookmark this deal, please try again');
            }
        );

    }


    sendTheBookmarkPost(dealId){

        console.warn(dealId);

        this.utils.bookmarkACoupon(dealId).subscribe(
            res =>{
                this.getSavedCouponsHere();
            },
            err =>{
                alert('Sorry we could not bookmark this deal, please try again');
            }
        );

    }



}
