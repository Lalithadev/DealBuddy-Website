import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from "../../utils.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('register') registerElement: ElementRef;
  @ViewChild('login') loginElement: ElementRef;
  
  public userProfileInfo:any = {
    'firstName': '',
    'userEmail': '',
    'emailEnabled': false,
    'infoProvider': false,
    'pnsEnabled': false,
    'gender': false,
    'role': 'user',
    'zipCode': '',
  }


  
  public loginUserProfile:any = {
    'email': '',
    'code': ''
  }

  public btnTitle = 'Add Profile';
  public showChooseState = true;

  constructor(
    private utils: UtilsService
  ) { }

  ngOnInit() {

    this.checkIfUserisLogged();
  }


  checkIfUserisLogged(){

    if( localStorage.getItem('user') != null ){

      this.showChooseState = false;

      let userData = JSON.parse( localStorage.getItem('user') );

      this.getMethisProfiledetails(userData.userEmail);

    }else{
      this.showChooseState = true;
    }


  }

  chooseOption(page){

      this.showChooseState = false;

      if(page == 'login'){
        let el = this.loginElement.nativeElement;

        el.setAttribute('style', 'border: 2px solid #5df4db');

      }else if(page == 'register'){
          let el = this.registerElement.nativeElement;

          el.setAttribute('style', 'border: 2px solid #5df4db');
      }



      setTimeout( function(){
        let login   = document.getElementById('loginCompo');
        let profile = document.getElementById('registerCompo');

        login.setAttribute('style', 'border: none');
        profile.setAttribute('style', 'border: none');
      }, 3000);

  }



  setThisProfile(){

          if( this.btnTitle == 'Update email'){


                  let userData = JSON.parse( localStorage.getItem('user') );

                  let data = {
                    'oldEmail': userData.userEmail,
                    'newEmail': this.userProfileInfo.userEmail
                  }
 
                  

                  this.utils.updateUserEmail(data).subscribe(
                        res =>{

                                // this.getMethisProfiledetails(res["userEmail"]);    
                 
                                this.utils.deleteLocally('user');
                                      
                                let responseUserProfile = { ...res };  

                      
                                this.btnTitle = 'Update email';

                                alert('Update Success, email was updated');

                        },
                        err =>{
                            alert('Sorry update failed, please check internet connecton');
                        }
                  );
                
          }else{

                      if( 
                        
                        this.userProfileInfo.firstName !== '' && this.userProfileInfo.userEmail !== '' && this.userProfileInfo.emailEnabled !== null &&
                        this.userProfileInfo.infoProvider !== null && this.userProfileInfo.pnsEnabled !== null && this.userProfileInfo.gender !== null && this.userProfileInfo.zipCode !== ''
                    
                      ){

                                  let setUserProfile = { ...this.userProfileInfo };  


                                  if(setUserProfile.gender){

                                    setUserProfile.gender = 'male';

                                  }else if( !setUserProfile.gender ){

                                    setUserProfile.gender = 'female';
                                  }
                        


                                  this.utils.addaNewUser(setUserProfile).subscribe(
                                    res =>{


                                        this.utils.deleteLocally('user');
                                      
                                        let responseUserProfile = { ...res };  


                                        if(responseUserProfile["gender"] === 'male' )
                                        {
                                                responseUserProfile["gender"] = true;
                                        }
                                        else if(responseUserProfile["gender"] === 'female' )
                                        {
                                                responseUserProfile["gender"] = false;
                                        }
                              
                                        
                                        this.userProfileInfo = responseUserProfile;
                          
                                        this.btnTitle = 'Update email';
                          
                                        this.utils.storeLocally('user', responseUserProfile);
                                        

                                        alert('Registration Success, official welcome to the winning team');

                                    },
                                    err =>{
                                        alert('Sorry registration failed, please check internet connecton');
                                    }
                                );

                      }else{

                            alert('Please fill in all information to register');

                      }

        }



  }



  
  getMethisProfiledetails(email){

        this.utils.requestUserProfileByEmail( email ).subscribe(

          res =>{


              let responseUserProfile = { ...res };  


              if(responseUserProfile["gender"] === 'male' )
              {
                      responseUserProfile["gender"] = true;
              }
              else if(responseUserProfile["gender"] === 'female' )
              {
                      responseUserProfile["gender"] = false;
              }
    
              
              this.userProfileInfo = responseUserProfile;

              this.btnTitle = 'Update email';

              this.utils.storeLocally('user', responseUserProfile);

          },
          err =>{

              alert('Sorry getting profile failed, please check internet connecton');

          }

      );


  }

  sendMeTheVerificationCode(){


      if( this.loginUserProfile.email != '' ){

              this.utils.requestUserCodeByEmail( this.loginUserProfile.email ).subscribe(
                res =>{
                    alert('Verfication code has been sent, please check your email');
                },
                err =>{


                        if( err.status == 200 || err.status == 201 ){
                                      alert('Verfication code has been sent, please check your email');
                        }else{
                                      alert('Sorry sending of verification code failed, please check internet connecton');
                        }


                }
            );

       }else{

          alert('Sorry please fill in email, please retry again');

        }

  }


  verifyTheCode(){

    if( this.loginUserProfile.code != '' && this.loginUserProfile.email != '' ){

              this.utils.verifyUserCodeByEmail( this.loginUserProfile ).subscribe(

                    res =>{
                        
                        this.getMethisProfiledetails( this.loginUserProfile.email );
                        alert('Verfication code has been verified, your profile will load shortly');
                    },
                    err =>{


                        if( err.status == 200 || err.status == 204 ){
                             this.getMethisProfiledetails( this.loginUserProfile.email );
                            alert('Verfication code has been verified, your profile will load shortly');
                        }else{
                            alert('Sorry verification failed, please check code or retry again');
                        }


                    }
                
            );

    }else{

        alert('Sorry please fill in email & code, please retry again');

    }

  }



}
