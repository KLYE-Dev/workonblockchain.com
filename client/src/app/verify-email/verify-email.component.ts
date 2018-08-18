import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { DataService } from "../data.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
	currentUser: User; hash;
  navigationExtras: NavigationExtras;
  constructor( private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,private dataservice: DataService) 
        {
          /*this.hash = route.snapshot.params['email_hash'];
          //console.log(this.hash);*/
             this.route.queryParams.subscribe(params => 
             {
                 this.hash = params['email_hash'];
                 //console.log(this.hash); // Print the parameter to the console. 
            });
         }

  ngOnInit() 
  {

  		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      ////console.log(this.currentUser);
  			this.authenticationService.verify_email(this.hash)
            .subscribe(
                data => 
                {
                    //console.log(data);
                    if(data)
                    {
                        if(!this.currentUser)
                        {
                            this.dataservice.changeMessage(data['msg']);
                            this.router.navigate(['/login']);
                        }

                        else if(this.currentUser.type=="candidate")
                        {
                            this.dataservice.emailMessage(data['msg']);
                            //this.router.navigate(['/login']);
                            this.router.navigate(["/candidate_profile"]);                   
                        }
                        
                        else if(this.currentUser.type=="company")
                        {
                            this.dataservice.emailMessage(data['msg']);
                            //this.router.navigate(['/login']);
                            this.router.navigate(["/company_profile"]);                   
                        }
                        else
                        {
                            this.dataservice.errorMessage("Something getting wrong");
                            this.router.navigate(['/login']);
                         }
                    }
                    
                    else
                    {               
                        this.dataservice.errorMessage("Something getting wrong");
                        this.router.navigate(['/login']);
                     }
                    
                   /* else
                    { 
                       
                             
                     }*/
                    
                    
                    
                    
                },
                error => 
                {
                        if(!this.currentUser)
                        {
                            this.dataservice.errorMessage(error);
                            this.router.navigate(['/login']);
                        }

                       else if(this.currentUser.type=="candidate")
                        {
                            this.dataservice.emailMessage(error);
                            //this.router.navigate(['/login']);
                            this.router.navigate(["/candidate_profile"]);                   
                        }
                        
                       else if(this.currentUser.type=="company")
                        {
                            this.dataservice.emailMessage(error);
                            //this.router.navigate(['/login']);
                            this.router.navigate(["/company_profile"]);                   
                        }
                        else 
                        {
                            this.dataservice.errorMessage("Something getting wrong");
                            this.router.navigate(['/login']);    
                        }
                    //console.log("error");
                  //this.dataservice.changeMessage(error);
                	// this.router.navigate(['/login']);
                });

  		
  	}

}
