    import { Component, OnInit } from '@angular/core';
    import { UtilsService } from "../../utils.service";
    import {Router} from "@angular/router";

    @Component({
    selector: 'app-deals',
    templateUrl: './deals.component.html',
    styleUrls: ['./deals.component.css']
    })
    export class DealsComponent implements OnInit {

    public allDeals = [];

    public filterButtons = [
        {  'class': '',  'icon': 'fa-user',  'title': '4 you' },
        {  'class': 'bordered',  'icon': 'fa-list-ul',  'title': 'All' },
        {  'class': '',  'icon': 'fa-map-marker',  'title': 'Local' },
        {  'class': '',  'icon': 'fa-bookmark',  'title': 'Saved' }
    ];

    public savedDeals = [];

    public userInteractionIcons = this.utils.userInteractionIcons;

    pageId = 1;

    constructor(
        private utils: UtilsService,
        private router: Router,
    ){}


    ngOnInit() {
        this.getAllDeals( this.pageId, undefined);
    }



    public trackItem (index: number, item) {
        return index;
      }

    pushToCollection(where, data){

        if( where === this.allDeals  ){

            data.map( oneData => {
    
                oneData.formattedDate = `${ new Date( oneData.entryTime ).getDay() }, ${ new Date( oneData.entryTime ).getMonth() }, ${ new Date( oneData.entryTime ).getFullYear()}`;
                console.log( oneData.formattedDate );   
    
            });
    
    
        }
        
        data.map( oneData => where.push(oneData) );
       

        this.savedDeals.map( data =>{

                    this.allDeals.map( oneDeal =>{
                                if(oneDeal.id === data.id ){
                                    oneDeal.isBookmarked = true;
                                }
                    });

                });

        this.allDeals = [...this.allDeals];

    }

    getAllDeals(pageId, filterBy){

        this.allDeals = [];
        
        this.utils.getAllDeals(pageId, filterBy).subscribe(

            res =>{
              this.pushToCollection( this.allDeals, res );
            },
            err =>{
              alert('Sorry we could not get all deals, please check your internet connection');
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

            filterBy= 'localDeals';
            callFiter = true;

        }else if( by === 'Saved'){
            filterBy= 'savedDeals';
            callFiter = true;
        }

        // check and call
        if( callFiter === true ){
            this.callFilteredApi(page,filterBy);
        }

    }

    callFilteredApi(page,filterBy){

        this.getAllDeals(page, filterBy);
    }


    getSavedDeals(){
        
        this.savedDeals = [];
        this.utils.getSavedDeals().subscribe(
            res =>{
                this.pushToCollection( this.savedDeals, res);
            },
            err =>{
                // alert('Sorry we could not get your saved deals, please try again');
            }
        );

    }

    bookmarkThisDeal(icon,dealId){


            if(icon.title === 'bookmark' && dealId.isBookmarked == true ){
                console.log('deleting a bookmark');

                this.sendTheBookmarkDelete(dealId.id);
            }
            else  if(icon.title === 'bookmark' && dealId.isBookmarked == undefined ){
                console.log('setting a new bookmark');

                this.sendTheBookmarkPost(dealId.id);
            }

    }


    sendTheBookmarkDelete(dealId){

        this.utils.deleteADealBookmark(dealId).subscribe(
            res =>{
                this.getSavedDeals();
            },
            err =>{
                alert('Sorry we unbookmark this deal, please try again');
            }
        );

    }


    sendTheBookmarkPost(dealId){

        this.utils.bookmarkADeal(dealId).subscribe(
            res =>{
                this.getSavedDeals();
            },
            err =>{
                alert('Sorry we could not bookmark this deal, please try again');
            }
        );

    }


    


}
