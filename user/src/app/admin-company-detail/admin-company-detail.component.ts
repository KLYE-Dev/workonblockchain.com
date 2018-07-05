import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.css']
})
export class AdminCompanyDetailComponent implements OnInit {

    user_id;
    
  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
    this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        console.log(this.user_id);     
    });
  }

  ngOnInit() {
  }

}