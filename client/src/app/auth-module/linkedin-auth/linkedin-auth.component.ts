import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-linkedin-auth',
  templateUrl: './linkedin-auth.component.html',
  styleUrls: ['./linkedin-auth.component.css']
})
export class LinkedinAuthComponent implements OnInit {
  code;
  log;
  linkedinUser;
  previousUrl;
  public referred_email;
  refcode;
  constructor(private route:ActivatedRoute, private router:Router,private authenticationService: UserService) {
    this.refcode = localStorage.getItem('ref_code');
    if(this.refcode) {
      this.authenticationService.getByRefrenceCode(this.refcode)
        .subscribe(
          data => {
            if (data) {
              this.referred_email =  data['email'];
              this.getParam();
            }
          },
          error => {
          }
        );
    }
    else  {
      this.getParam();
    }
  }

  getParam(){
    this.linkedinUser = (localStorage.getItem('linkedinLogin'));
    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
    });
    if(this.code && this.linkedinUser === 'true') {
      this.login(this.code);
    }
    else if(this.code && !this.linkedinUser) {
      this.passCodeToBE(this.code);
    }
    else {
      this.router.navigate(['/not_found']);
    }
  }

  ngOnInit() {
  }
  login(code) {
    localStorage.removeItem('linkedinLogin');
    this.authenticationService.candidate_login({linkedin_code : code})
      .subscribe(
        user => {
          if(user) {
            window.location.href = '/users/talent';
          }

        },
        error => {
          this.log = 'error';
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else{
            this.log = 'There was a problem with your linkedin identity';
          }

        });
  }

  passCodeToBE(code) {
    let queryBody : any = {};
    if(this.referred_email) queryBody.referred_email  = this.referred_email;
    queryBody.linkedin_code = code;
    this.authenticationService.createCandidate(queryBody)
      .subscribe(
        user => {
          if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '/users/talent';
          }

        },
        error => {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
          }

          else {
            this.log = 'There was a problem with your linkedin identity';
          }

        });
  }

}
