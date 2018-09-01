import { Component, OnInit,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {environment} from '../../environments/environment';
const URL = environment.backend_url;
////console.log(URL);

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit
{
  currentUser: User;
  log='';
  info: any = {};
  email_data : any ={};
  link=''; class=''; resume_class;exp_class;final_class;googleUser;linkedinUser;active_class;
  job_active_class;
  exp_active_class;resume_active_class;
  gender =
  [
    "Male",
    "Female"
  ]
   
  nationality = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];
  term_active_class;
  term_link;
    img_src;
    referred_id;
    job_disable;
    resume_disable;
    exp_disable;
    first_name_log;
    last_name_log;
    contact_name_log;
    nationality_log;

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef)
  {
  }

   

  ngOnInit()
  {
      /*this.info.first_name ='';
      this.info.last_name='';
      this.info.contact_number='';
      this.info.nationality='';*/
       this.job_disable = "disabled";
      this.resume_disable = "disabled";
      this.exp_disable = "disabled";
      this.info.nationality=-1;
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
       ////console.log(this.currentUser);
       this.googleUser = JSON.parse(localStorage.getItem('googleUser'));
       ////console.log(this.googleUser);

       this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));
       //////console.log(this.linkedinUser);

       if(this.googleUser)
       {
           ////console.log("jhcskjsdhkk");
          this.info.image_src = this.googleUser.photoUrl;
           if( this.info.image_src)
           {
                let x = this.info.image_src.split("/");
     
                let last:any = x[x.length-1];
                           
                 this.img_src = last;
            }
          this.info.first_name= this.googleUser.firstName;
          this.info.last_name = this.googleUser.lastName;
       }

       if(!this.currentUser)
       {
          this.router.navigate(['/signup']);
       }

       if(this.currentUser && this.currentUser.type=='candidate')
       {
          
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data =>
                {
                      //  console.log(data);
                    if(data[0]._creator.refered_id != 'undefined' && !data[0].first_name && !data[0].last_name)
                    {
                        //console.log("ifffffffffff");
                        this.referred_id = data[0]._creator.refered_id;
                        
                    }
                  if(data[0].terms)
                  {
                      this.term_active_class='fa fa-check-circle text-success';
                      this.term_link = '/terms-and-condition';
                  }

                  if(data[0].contact_number  || data[0].nationality || data[0].first_name || data[0].last_name)
                  {
                    this.active_class='fa fa-check-circle text-success';
                    this.info.contact_number = data[0].contact_number;
                    this.info.github_account = data[0].github_account;
                    this.info.exchange_account = data[0].stackexchange_account;
                    this.info.nationality = data[0].nationality;
                    //this.info.gender = data.gender;
                    this.info.first_name =data[0].first_name;
                    this.info.last_name =data[0].last_name;

                    if(data.image != null )
                    {
                      //////console.log(data.image);
                     this.info.image_src = data[0].image ;
                       

                        let x = this.info.image_src.split("/");
     
                        let last:any = x[x.length-1];
                           
                           this.img_src = last;
                        
                    }
                   
                    this.job_disable = '';
                    this.link= "/job";

                  }

                  if(data[0].locations && data[0].roles && data[0].interest_area && data[0].expected_salary && data[0].availability_day )
                  {
                      this.resume_disable = '';
                      this.job_active_class = 'fa fa-check-circle text-success';
                      this.resume_class="/resume";
                  }

                 if(data[0].why_work )
                {
                     this.exp_disable = '';
                    this.resume_class="/resume";
                     this.exp_class = "/experience";
                    this.resume_active_class='fa fa-check-circle text-success';
                // this.router.navigate(['/resume']);
                }

                if( data[0].programming_languages && data[0].current_salary )
                {
                    this.exp_class = "/experience";
                    this.exp_active_class = 'fa fa-check-circle text-success';
                    //this.router.navigate(['/experience']);
                }



                },
                error =>
                {
                  this.log = 'Something getting wrong';
                });
                this.router.navigate(['/about']);
       }
       else
       {
            this.router.navigate(['/not_found']);
       }

  }

  onGenderSelected(event)
  {
    this.info.gender= event.target.value;
    ////console.log(this.info.gender);
  }


  about()
  {

    if(!this.info.first_name)
    {
        this.first_name_log="Please enter first name";
    
    }
    if(!this.info.last_name)
    {
        this.last_name_log="Please enter last name";
    
    }
    if(!this.info.contact_number)
    {
        this.contact_name_log ="Please enter contact number";
    }
    
    if(this.info.nationality==-1)
    {
        this.nationality_log ="Please choose nationality";
    }
    if(this.info.first_name && this.info.last_name && this.info.contact_number && this.info.nationality!=-1)
    {
      this.authenticationService.about(this.currentUser._creator,this.info)
        .subscribe(
          data =>
          {
            if(data)
            {
                
               if(this.referred_id)
               {
                   //console.log("ifffffffff refrred _id");
                        ////console.log(data.refered_id);
                         this.authenticationService.getById(this.referred_id)
                         .subscribe(
                         data => {
                            if(data)
                            {
                                ////console.log(data);
                                this.email_data.fname = data[0].first_name;
                                this.email_data.email = data[0]._creator.email;
                                this.email_data.referred_fname = this.info.first_name;
                                this.email_data.referred_lname = this.info.last_name;
                               this.authenticationService.email_referred_user(this.email_data).subscribe(
                                data =>
                                {
                                 
                                    ////console.log(data);
                                    },
                                   
                                   error=>
                                   {
                                       if(error.message == 500)
                                        {
                                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                            window.location.href = '/login';
                                        }
                                   });
                                
                            }
                             
                            
                    
                        },
                             
                        err => {
                   
                            if(err.message == 500)
                            {
                                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                window.location.href = '/login';
                            }
                   
                });
               
              }
                
              if(!this.info.image_src)
              {
              let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
              let fileCount: number = inputEl.files.length;
              let formData = new FormData();
              if (fileCount > 0 )
              {
                formData.append('photo', inputEl.files.item(0));

                this.http.post(URL+'users/image', formData ,  {
            headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
        }).map((res) => res).subscribe(
                (success) =>
                {
                  ////console.log(success);
                  this.router.navigate(['/job']);
                },
                (error) => {
                 if(error.message == 500)
                            {
                                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                window.location.href = '/login';
                            }    
                })
              }
               else
              {
                this.router.navigate(['/job']);
              }

              }
              else if (this.info.image_src)
              {
                this.router.navigate(['/job']);
              }

            }
            if(data.error )
            {
              this.log=data.error;
            }
          },
          error =>
          {
            this.log = 'Something getting wrong';
          });
          
    }      
    
  }
        
}