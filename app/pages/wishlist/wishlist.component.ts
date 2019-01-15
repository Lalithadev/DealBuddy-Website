import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilsService } from "../../utils.service";
import { Observable } from 'rxjs';
import {Router} from "@angular/router";

declare const $: any;

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

    public allWishlists = [];

    public keywordValue = '';

    public filterButtons = [
        // {  'class': '',  'icon': 'fa-user',  'title': '4 you' },
        {  'class': 'bordered',  'icon': 'fa-home',  'title': 'All' },
        // {  'class': '',  'icon': 'fa-map-marker',  'title': 'Local' },
        // {  'class': '',  'icon': 'fa-bookmark',  'title': 'Saved' }
    ];

    pageId = 1;

    public wishlistData = {
           "brands": [
             "string"
           ],
           "categories": [
             "string"
           ],
           "id": "string",
           "keywords": [],
           "userId": "string",
           "vendors": [
             "string"
           ]
     }
  
    public taggedKeywords =  [];

    constructor(
        private utils: UtilsService,
        private router: Router
    ){}


    ngOnInit() {
    }


    ngAfterViewInit(){

        setTimeout( ()=>{
            this.getAllWishlists(this.pageId);
        }, 1000);

    }

    pushToCollection(where, data){
        data.map( oneData => where.push(oneData) );    
    }

    getAllWishlists(pageId){

        this.allWishlists = [];
        
 
        if( this.utils.returnLoggedInOrNot() == true ){

                this.utils.getAllMyWishlist(pageId).subscribe(

                        res =>{
                            this.pushToCollection( this.allWishlists, res );
                        },
                        err =>{
                            console.log(err);
                        }
                    
                );
      
        }else{
            alert('Please signup to access this feature');
            this.router.navigateByUrl('/profile');
        }


    };



    addThisKeyword(){

        if(this.keywordValue !== ''){
            this.wishlistData.keywords = [];
            this.wishlistData.keywords.push(this.keywordValue);
            this.sendNewKeyword();
        }else{
            alert('Keyword value cant be empty');
        }

    }

    sendNewKeyword(){

        this.utils.addANewWishList(this.wishlistData).subscribe(
            res =>{
                    this.getAllWishlists(1);
            },
            err =>{
                alert('Failed to add new keyword, please try again');
            }
        );

    }

    removeThisKeyword(feed){

            if(feed){

                this.utils.deleteAWishList(feed.id).subscribe(
                    res =>{
                            this.getAllWishlists(1);
                    },
                    err =>{
                        console.log( err );
                        alert('Failed to delete keyword, please try again');
                    }
                );

            }

    }

    

}
