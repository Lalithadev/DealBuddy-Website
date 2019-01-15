
import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Login} from "../../models/login";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class Navigation implements OnInit {
    @Input() loginInfo:Login;


    public sideMenuRoutes = [
        {'route': 'wishlist',    'icon': 'fa-heart', 'title': 'Wishlist' },
        {'route': 'deals',   'icon': 'fa-usd',  'title': 'Deals' },
        {'route': 'coupons', 'icon': 'fa-ticket', 'title': 'Coupons' },
        {'route': 'events',  'icon': 'fa-calendar', 'title': 'Events' },
        {'route': 'profile',  'icon': 'fa-user', 'title': 'Profile' },
    ];

    constructor( private router: Router, private route:ActivatedRoute ) { }

    ngOnInit() {
    }



    activeRoute(routename: string): boolean{
        return this.router.url.indexOf(routename) > -1;
    }


    

}