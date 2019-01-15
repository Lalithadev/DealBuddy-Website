import {OnInit, Component} from "@angular/core";
import { UtilsService } from "../../utils.service";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public allFeeds = [];

    constructor(
        private utils: UtilsService
    ){ }

    ngOnInit() {
        this.getCoupons();
    }


    getFeedContent( what ){
        // we are going to take the nav route data
        // then using that we call the specified api and get the contents for display

        if( what === 'coupons' ){

        }

    }


    getCoupons(){

        console.log('getting all apis');


    }

}