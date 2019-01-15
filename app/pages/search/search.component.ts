import { Component, OnInit } from '@angular/core';
import { UtilsService } from "../../utils.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public allDeals = [];

  public advertisementImage = '../../assets/img/steal.jpg';

  constructor(
    private utils: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.getResultsBasedOnData();
  }


  getResultsBasedOnData(){
      let searchKey = this.route.snapshot.paramMap.get('searchKeyword');

      // this.router.events.subscribe( (e: any) => {
        console.log(searchKey);

        this.findInThresults(searchKey);
      // });

  }

  
  pushToCollection(where, data){

    data.map( oneData =>{
        where.push(oneData);
    });

  }


  findInThresults(searchKey){

         this.utils.findMeThisKeyword(1, searchKey).subscribe(
            res =>{
              this.pushToCollection( this.allDeals, res );
            },
            err =>{
              alert('Sorry we had an error while finding your search results');
            }
          );
    
  }

}
