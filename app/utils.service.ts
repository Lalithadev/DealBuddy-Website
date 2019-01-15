import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable()
export class UtilsService {

  public allDealsCollection = [];
  public allWishListCollection = [];
  public allCouponsCollection = [];
  public allEventCollection = [];
  public searchResults = [];

  public filterableButtons =  [
    {  'class': '',  'icon': 'fa-home',  'title': '4 you' },
    {  'class': 'success',  'icon': 'fa-home',  'title': 'All' },
    {  'class': '',  'icon': 'fa-home',  'title': 'Local' },
    {  'class': '',  'icon': 'fa-home',  'title': 'Saved' }
  ];

  public userLocationCoords:any = {
    'latitude': '',
    'longitude':''
  };


  public userInteractionIcons = [
    {   'icon': 'fa-thumbs-up',  'title': '4 you' },
    {   'icon': 'fa-heart',  'title': 'All'   },
    {   'icon': 'fa-bookmark',  'title': 'bookmark' }
  ];


  public userInformation: any = JSON.parse( localStorage.getItem('user') );

  public showFilterable = true;

  constructor(
    public http: HttpClient,
    private router: Router
  ) { }


  private baseUrl = 'http://db10-env.dvyphnsnse.us-east-2.elasticbeanstalk.com/dealbuddy/rest';

  // getting data
  public getCouponsUrl = `${this.baseUrl}/coupons`;
  public getDealsUrl   = `${this.baseUrl}/deals`;
  public getEventsUrl = `${this.baseUrl}/events`;

  public addNewUser = `${this.baseUrl}/users`;
  public getUser = `${this.baseUrl}/users/user`;

  public requestUserCode  = `${this.baseUrl}/users/requestCode`;
  public verifyUserCode   = `${this.baseUrl}/users/verifyCode`;
  public updateUser       = `${this.baseUrl}/users/updateEmail`;

  public searchKeyword    = `${this.baseUrl}/global/search`;

  // bookmarking
  public bookmarkDeals = `${this.baseUrl}/deals/bookmarkDeal`;
  public deleteBookmarkedDeal = `${this.baseUrl}/deals/deleteFromBookmark`;
  public dealsByZipCode =  `${this.baseUrl}/deals/dealsByZipcode`;
  public savedDeals = `${this.baseUrl}/deals/savedDeals`;

  // coupons
  public bookmarkCoupons = `${this.baseUrl}/coupons/bookmarkCoupon`;
  public deleteBookmarkedCoupons = `${this.baseUrl}/coupons/deleteCouponFromBookmark`;
  public couponsByZipCode =  `${this.baseUrl}/coupons/couponsByZipcode`;
  public savedCoupons = `${this.baseUrl}/coupons/savedCoupons`;

  //wishlists
  public subscriptionsUrl = `${this.baseUrl}/subscriptions`;

  private adminEmail = 'vamsi.katta@gmail.com';

  // DELETE /dealbuddy/rest/coupons/deleteCouponFromBookmark
/*-------------------------------------------------------- misscellenous functions --------------------------------------------------------*/


    openSnackBar(message: string, action: string) {
      alert(message);
    }

    deleteLocally(name){
      localStorage.removeItem(name);
    };

    getLocally(name:string){
      return JSON.parse( localStorage.getItem(name) );
    };

    storeLocally(name:string, data){
        let tmpdata = JSON.stringify( data );

        localStorage.setItem(name, tmpdata);
    }

    pushToCollection(where, data){
      data.map( oneData => where.push(oneData) );
    }

    getTheUserLocation(){

        let user =  navigator.geolocation.getCurrentPosition( 

          res=>{

              this.userLocationCoords.latitude = res.coords.latitude;
              this.userLocationCoords.longitude = res.coords.longitude;

              this.deleteLocally( 'userLocation' );
              this.storeLocally('userLocation', this.userLocationCoords );
          },
          err=>{
            // alert('Please allow us to get your location so we can get you the best results');
            // this.getTheUserLocation();

            return false;
          }

        );

    }

    returnMeCollection(){
        return this.allDealsCollection;
    }


    returnLoggedInOrNot(){

        if( localStorage.getItem('user') != null ){

          this.userInformation  = JSON.parse( localStorage.getItem('user') );
          return true;

        }else{
          
          return false;
        }

    }


 /*-------------------------------------------------------- global api calls --------------------------------------------------------*/

    findMeThisKeyword(pageId,key){

      let parameters =  new HttpParams()
      .set('page', pageId.toString() )
      .set('toBeSearched', key.toString() );

      return this.http.get( this.searchKeyword,  { params: parameters } );

    }


    getAllSavedItems(pageId,key){

      let parameters =  new HttpParams()
      .set('page', pageId.toString() )
      .set('userEmail', this.userInformation.userEmail.toString() );

      return this.http.get( this.searchKeyword,  { params: parameters } ).subscribe(
        res =>{
          this.pushToCollection( this.searchResults, res );
        },
        err =>{
          console.log( err );
        }
      );

    }


    bookMarkOrRemoveThisItem( itemId, what, operation, page){


        if(what == 'coupon'){

        
            if(operation == 'delete'){

              let parameters =  new HttpParams()
              .set('page', page.toString() )
              .set('dealId', itemId.toString())
              .set('userEmail', this.userInformation.userEmail.toString() );
          
              return this.http.get( this.searchKeyword,  { params: parameters } );
            }else if(operation == 'add'){

              let parameters =  new HttpParams()
              .set('dealId', itemId.toString())
              .set('userEmail', this.userInformation.userEmail.toString() );
          
              return this.http.get( this.bookmarkCoupons,  { params: parameters } );
            }
        

        }else if(what == 'deals'){

              if(operation == 'delete'){
                let parameters =  new HttpParams()
                .set('page', page.toString() )
                .set('dealId', itemId.toString())
                .set('userEmail', this.userInformation.userEmail.toString() );
            

                // return this.http.delete( this.dealBookmarkedDeals,  { params: parameters } );
              }else if(operation == 'add'){
              
                let parameters =  new HttpParams()
                .set('coupondId', itemId.toString())
                .set('userEmail', this.userInformation.userEmail.toString() );

                return this.http.post( this.bookmarkDeals,  { params: parameters } );
              }

        }



    }

/*-------------------------------------------------------- wishlist/subscriptions api calls --------------------------------------------------------*/


    // get all wishlist by id
    public getAllMyWishlist(pageId){
      this.allCouponsCollection = [];

      let parameters =  new HttpParams()
      .set('page', pageId )
      .set('userEmail', this.userInformation.userEmail.toString() );

      return this.http.get( this.subscriptionsUrl,  { params: parameters } );
    }


    // delete a wishlist by id
    public deleteAWishList( subscrId ){

      //params
      let parameters =  new HttpParams()
      .set('userEmail', this.userInformation.userEmail )
      .set('subscriptionId', subscrId );
      

      let header = new HttpHeaders().set('Access-Control-Allow-Origin', '*' );

      return this.http.delete(`${this.subscriptionsUrl}`, { params: parameters,  headers: header } );
    }


    // add a wishlist by id
    public addANewWishList( subScriptionBody ){

      let subScription = subScriptionBody;

      //params
      let parameters =  new HttpParams()
      .set('userEmail', this.userInformation.userEmail.toString() );

      return this.http.post( this.subscriptionsUrl, subScription, { params: parameters } );
    }




 /*-------------------------------------------------------- coupoun api calls --------------------------------------------------------*/



    // get all coupons by id
    public getAllCoupons(pageId:any, filter:string){

                this.allCouponsCollection = [];
                let parameters:any;


                // 4you all local saved 
                if(filter === 'localCoupons'){



                      // if the user wants the local deals, first we check wether the users has allowed gps, 
                      if(this.userLocationCoords.latitude !== '' && this.userLocationCoords.longitude !== ''){

                          parameters =  new HttpParams().set('page', pageId)
                          .set('latitude', this.userLocationCoords.latitude.toString() )
                          .set('longitude', this.userLocationCoords.longitude.toString() );

                      }else{
                            // if not then we call local by zip
                            this.getLocalCouponsByZipCode();
                      }


                  
                }else if(filter === 'savedCoupons'){

                      if( this.returnLoggedInOrNot() == true ){

                        parameters =  new HttpParams()
                        .set('page', pageId  )
                        .set('userEmail', this.userInformation.userEmail.toString() );

                      }else{
                        alert('Please signup to access this feature')
                        this.router.navigateByUrl('/profile');
                        filter = undefined;
                      }


                }else if(filter === 'matchedCoupons'){

                      if( this.returnLoggedInOrNot() == true ){

                        parameters =  new HttpParams()
                        .set('page', pageId  )
                        .set('userEmail', this.userInformation.userEmail.toString() );

                      }else{
                        alert('Please signup to access this feature');

                        this.router.navigateByUrl('/profile');

                        filter = undefined;
                      }

                   

                }else if(filter === undefined){
                      filter = undefined;

                      parameters =  new HttpParams()
                      .set('page', pageId )

                }


          // fitered requests
          if(filter != undefined){

                  return this.http.get(`${this.getCouponsUrl}/${filter}`, { params: parameters } );

            // unfitered requests
            }else{

                  return this.http.get( `${this.getCouponsUrl}`, { params: parameters } );
                  
            }

    }


    // get all coupons by id
    public deleteACoupon( couponId, dealerRoleUserEmail ){

                //headers
                let header = new HttpHeaders().set('dealerRoleUserEmail', dealerRoleUserEmail.toString() );
                
                //params
                let parameters =  new HttpParams().set('page', couponId.toString() );

                return this.http.delete( this.getCouponsUrl, { params: parameters, headers: header } );
    }



    // bookmark coupon by the user by clicking bookmark icon
    public bookmarkACoupon(data){

        let parameters =  new HttpParams()
        .set('userEmail', this.userInformation.userEmail.toString() )
        .set('couponId', data.toString() );

        let userEmail = this.userInformation.userEmail.toString();
        let couponId = data.toString();
      
      return this.http.post(`${this.bookmarkCoupons}?userEmail=${userEmail}&couponId=${couponId}`,  { params: parameters } );
    }



    // delete coupons saved by the user 
    public deleteACouponBookmark(data){

        let parameters =  new HttpParams()
       .set('userEmail', this.userInformation.userEmail.toString() )
       .set('couponId', data.toString() );

        let userEmail = this.userInformation.userEmail.toString();
        let couponId = data.toString();

      return this.http.delete(`${this.deleteBookmarkedCoupons}?userEmail=${userEmail}&couponId=${couponId}`,  { params: parameters } );
    }



    // get coupons saved by the user 
    public getSavedCoupons(){
 
  
                let parameters =  new HttpParams()
                .set('userEmail', this.userInformation.userEmail.toString() )
          
                return this.http.get(this.savedCoupons, { params: parameters } );
          
    
    }



    // get coupons by user zip code
    public getLocalCouponsByZipCode(){


          if( this.returnLoggedInOrNot() == true ){

                  if( this.userInformation.zipCode !== null ||this.userInformation.zipCode !== undefined ){
                        let parameters =  new HttpParams()
                        .set('zipCode', this.userInformation.zipCode.toString() )
                  
                        return this.http.get( this.couponsByZipCode, { params: parameters } );
                  }

          }else{
            alert('Please signup or allow location to access this feature');

            this.router.navigateByUrl('/profile');
          }
      
   
    }



 /*-------------------------------------------------------- deal api calls --------------------------------------------------------*/




      // get all deals by id
      public getAllDeals(pageId:any, filter:string){
        
        this.allDealsCollection = [];
        let parameters: any;




                  // 4you all local saved 
              if(filter === 'localDeals'){


                    // if the user wants the local deals, first we check wether the users has allowed gps, 
                    if(this.userLocationCoords.latitude === '' && this.userLocationCoords.longitude == ''){
                        // if not then we call local by zip
                        this.getLocalDealsByZipCode();

                    }else{
                      parameters =  new HttpParams().set('page', pageId)
                      .set('latitude', this.userLocationCoords.latitude.toString() )
                      .set('longitude', this.userLocationCoords.longitude.toString() );
                    }


                
              }else if(filter === 'savedDeals'){


                    if( this.returnLoggedInOrNot() == true ){

                      parameters =  new HttpParams()
                      .set('page', pageId  )
                      .set('userEmail', this.userInformation.userEmail.toString() );

                    }else{
                      alert('Please signup to access this feature')
                      this.router.navigateByUrl('/profile');
                      filter = undefined;
                    }


              }else if(filter === 'matchedDeals'){

                    if( this.returnLoggedInOrNot() == true ){

                      parameters =  new HttpParams()
                      .set('page', pageId  )
                      .set('userEmail', this.userInformation.userEmail.toString() );

                    }else{
                      alert('Please signup to access this feature');

                      this.router.navigateByUrl('/profile');

                      filter = undefined;
                    }

                

              }else if(filter === undefined){
                    filter = undefined;

                    parameters =  new HttpParams()
                    .set('page', pageId )

              }



                // fitered requests
                if(filter != undefined){

                      return this.http.get(`${this.getDealsUrl}/${filter}`, { params: parameters } );

                // unfitered requests
                }else{

                      return this.http.get( `${this.getDealsUrl}`, { params: parameters } );
                      
                }



      }


      // get all coupons by id
      public deleteADeal( couponId, dealerRoleUserEmail ){

        //headers
        let header = new HttpHeaders().set('dealerRoleUserEmail', dealerRoleUserEmail.toString() );
        
        //params
        let parameters =  new HttpParams().set('page', couponId.toString() );

        return this.http.delete( this.getCouponsUrl, { params: parameters, headers: header } );
      }


      // bookmark this deal
      public bookmarkADeal(data){

        let parameters =  new HttpParams()
            .set('userEmail', this.userInformation.userEmail.toString() )
            .set('dealId', data.toString() );

        
        return this.http.post(`${this.bookmarkDeals}?userEmail=${this.userInformation.userEmail}&dealId=${data}`,  { params: parameters } );
      }

    
      public deleteADealBookmark(data){
        let parameters =  new HttpParams()
        .set('userEmail', this.userInformation.userEmail.toString() )
        .set('dealId', data.toString() );

        
        return this.http.delete(`${this.deleteBookmarkedDeal}?userEmail=${this.userInformation.userEmail}&dealId=${data}`,  { params: parameters } );
      }


      public getSavedDeals(){

        let parameters =  new HttpParams()
        .set('userEmail', this.userInformation.userEmail )

        return this.http.get( this.savedDeals, { params: parameters } );
      }

      
      // get coupons by user zip code
      public getLocalDealsByZipCode(){

          // if the user has not zip then he/she has to login
          if( this.userInformation.zipCode != null ||this.userInformation.zipCode !== undefined ){
                let parameters =  new HttpParams()
                .set('zipCode', this.userInformation.zipCode.toString() )
          
                return this.http.get( this.dealsByZipCode, { params: parameters } );
          }else{
            alert('Please signup or allow location to access this feature');

            this.router.navigateByUrl('/profile');
          }

      }



  /*-------------------------------------------------------- user api calls --------------------------------------------------------*/



      // get all users
      public getAllUser(data){
        return this.http.get( this.addNewUser, data);
      }


      // add a user
      public addaNewUser(data){
        return this.http.post( this.addNewUser, data);
      }


      // delete user
      public deleteUser(data){

          let parameters =  new HttpParams()
        .set('userEmail', this.adminEmail.toString() )
        .set('id', data.newEmail.toString() );

        
        return this.http.delete( this.addNewUser, data);
      }
    

      // request user code
      public updateUserEmail(data){

        let parameters =  new HttpParams()
        .set('userEmail', data.oldEmail.toString() )
        .set('newEmail', data.newEmail.toString() );

        return this.http.post( `${this.updateUser}?userEmail=${data.oldEmail.toString()}&newEmail=${data.newEmail.toString()}`,  { params: parameters } );
      }


      // request user profile
      public requestUserProfileByEmail(data){

          let parameters =  new HttpParams()
          .set('userEmail', data.toString() );
    
          return this.http.get( `${this.getUser}`, { params: parameters } );
      }


      // request user code
      public requestUserCodeByEmail(data){

        let parameters =  new HttpParams()
        .set('userEmail', data.toString() );

        return this.http.get( `${this.requestUserCode}`, { params: parameters } );
      }


      // verify user code
      public verifyUserCodeByEmail(data:any){

        let parameters =  new HttpParams()
        .set('userEmail', data.email.toString() )
        .set('code', data.code.toString() );

        console.log( parameters );

        return this.http.get(`${this.verifyUserCode}`, { params: parameters } );
      
      }




}
