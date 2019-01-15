import { Component } from '@angular/core';
import {smoothlyMenu} from "../../app.helpers";
import { UtilsService } from "../../utils.service";
import { Router, ActivatedRoute } from "@angular/router";

declare const $: any;

@Component({
    selector: 'topnavbar',
    templateUrl: 'topnavbar.component.html',
    styleUrls: ['./topnavbar.component.css']
})

export class Topnavbar {

    public isUserLoggedIn = false;
    public showEmailVerification = false;
    public showCodeVerification = false;
    public showSessionChoices = true;

    public btnTextContent = { 'title':'Save', 'icon': 'fa-upload-o' };

    public searchKeyword = '';

    public sessionButtons = [
        { 'class': 'success', 'icon': 'fa-sign-in', 'title': 'Login' },
        { 'class': 'primary', 'icon': 'fa-user', 'title': 'Register' },
    ];



    public userProfileInfo:any = {
            'firstName': '',
            'userEmail': '',
            'emailEnabled': '',
            'infoProvider': '',
            'pnsEnabled': '',
            'gender': '',
            'role': 'user',
            'zipCode': ''
    }

    public tmpSearchMatch = {
        'base64ImageBytes': null,
        'brand': "henry",
        'categories': null,
        'city': "henry",
        'description': "henrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry",
        'expDate': "11/20/2018",
        'id': "oTw_IGcBHQXGh17wY7QT",
        'keywords': null,
        'timeStamp': '2018-11-17T05:58:02.252Z',
        'title': "10px solid ",
        'url': "henry",
        'vendor': "henry",
        'zipCode': ""
    };

    public searchResults = [ this.tmpSearchMatch ];
    public showFilterable = this.utils.showFilterable;

    constructor(
        private utils: UtilsService,
        private router: Router, 
      ){}


    ngOnInit() {
        this.utils.getTheUserLocation();
    }


    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }


    logout() {
        localStorage.clear();
        // location.href='http://to_login_page';
    }





    pushToCollection(where, data){

        data.map( oneData =>{
            where.push(oneData);
        });
    
    }


    
    setThisProfile(){

        this.utils.addaNewUser( this.userProfileInfo).subscribe(
            res =>{

                // turning some content into strings so i can see them
                res["pnsEnabled"] = res["pnsEnabled"].toString();
                res["emailEnabled"] = res["emailEnabled"].toString();

                this.utils.deleteLocally('user');

                this.userProfileInfo =  res ;

                this.utils.storeLocally('user', res);

                this.utils.openSnackBar('Registration Success, please check internet connecton', 'Okay');

            },
            err =>{
                this.utils.openSnackBar('Sorry registration failed, please check internet connecton', 'Okay');
            }
        );


    }


    choosePage( option ){
        let optionTitle = option;

        this.utils.showFilterable = false;
        
        // $('.dropdown-toggle').dropdown()

        this.showSessionChoices = false;

        if(optionTitle == 'Login'){
            this.showEmailVerification = true;
        }else{
            this.isUserLoggedIn = true;
        }

    }

    searchThisKeyword(e){


        let keyword = this.searchKeyword.toLowerCase();
        this.searchResults = []; // empty the current results

        if( e.keyCode == 13 ){

            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate( ['/search',  { searchKeyword: keyword }  ]  ));

        }

   
      
    }


    searchThisKeywordBtn(){


        let keyword = this.searchKeyword;
        this.searchResults = []; // empty the current results


            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate( ['/search',  { searchKeyword: keyword }  ]  ));
   
      
    }


    logTheUserOut(){
        localStorage.removeItem('user');
        this.router.navigateByUrl('/');
    }

}