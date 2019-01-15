import { HomeComponent } from "./pages/home/home.component";
import { EventComponent } from './pages/event/event.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { DealsComponent } from './pages/deals/deals.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';

export const appRoutes=[
    
    {
        path:'',
        redirectTo:'coupons',
        pathMatch:'full'
    },
    {
        path: 'wishlist',
        component: WishlistComponent
    },
    {
        path: 'coupons',
        component: CouponComponent
    },
    {
        path:'deals',
        component: DealsComponent
    },
    {
        path: 'events',
        component: EventComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },{
        path: 'search',
        component: SearchComponent
    }
 
];