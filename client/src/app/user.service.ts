import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import {User} from './Model/user';
import {CandidateProfile} from './Model/CandidateProfile';
import { DataService } from './data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError} from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import {environment} from '../environments/environment';

const URL = environment.backend_url;

@Injectable()
export class UserService {


  currentUser: User;
  token;
  constructor(private http: HttpClient,private route: ActivatedRoute,
              private router: Router ,private dataservice: DataService)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser)
    {
      this.token = this.currentUser.jwt_token;
    }

  }

  getAll()
  {
    return this.http.get(URL+'users', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  candidate_detail(_id :any )
  {
    return this.http.post(URL+'users/candidate_detail', {_id:_id}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));

  }


  getById(_id: string)
  {
    return this.http.get(URL+'users/current/' + _id,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  getProfileById(_id:string)
  {
    return this.http.get(URL+'users/current/' + _id,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        if(!res['terms_id'])
        {
          this.router.navigate(['/terms-and-condition']);

        }

        else if(!res['contact_number'] || !res['nationality'] || !res['first_name'] || !res['last_name'])
        {
          this.router.navigate(['/about']);
        }
        else if(res['locations'].length < 1  || res['roles'].length < 1 || res['interest_area'].length < 1 || !res['expected_salary'])
        {

          this.router.navigate(['/job']);
        }
        else if(!res['why_work'] )
        {
          this.router.navigate(['/resume']);
        }

        else if(!res['description'])
        {
          this.router.navigate(['/experience']);

        }

        else
        {
          return res;
        }
        // return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  getByRefrenceCode(code: string){

    return this.http.post(URL+'users/get_refrence_code', {code:code} )
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          return throwError(error);
        }

      }));
  }

  getReferenceDetail(email: string){

    return this.http.post(URL + 'users/get_refrence_detail',  {email:email},{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }


  create(user: User)
  {
    return this.http.post(URL+'users/register', user) .pipe(map(user => {
      return user
    }));

  }

  create_employer(employer: any)
  {
    return this.http.post(URL+'users/create_employer', employer) .pipe(map(employer => {
      return employer
    }));

  }

  upload(image: string)
  {
    return this.http.post(URL+'/about', image) .pipe(map(user => {
      return image;
    }));
  }

  update(user: User)
  {
    return this.http.put(URL+'users/' + user._id, user);

  }

  forgot_password(email: string)
  {
    //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
    return this.http.put(URL+'users/forgot_password/' + email , '')
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }
      }));

  }

  verify_client(email: string)
  {
    //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
    return this.http.put(URL+'users/verify_client/' + email , '') .pipe(map(data => {
      return data;
    }));

  }

  delete(_id: string)
  {
    return this.http.delete(URL+'users/' + _id);
  }

  candidate_login(username: string, password: string, linkedin_id : any)
  {
    return this.http.post(URL+'users/authenticate', { email: username, password: password , linkedin_id  : linkedin_id })
      .pipe(map(user => {
        if (user)
        {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        else
        {
          return user;
        }

      }));
  }

  terms(user_id: string, data: any)
  {

    return this.http.put(URL+'users/welcome/terms', data , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);                }
    }));

  }

  prefilled_profile(basics: any , work:any , education : any)
  {

    return this.http.put(URL+'users/welcome/prefilled_profile' , {basics : basics , workHistory : work , educationHistory : education} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  about(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/welcome/about' , detail , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  job(user_id: string, detail: CandidateProfile)
  {

    return this.http.put(URL+'users/welcome/job' , detail , {
      headers: new HttpHeaders().set('Authorization', this.token)
    } ).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  resume(user_id: string, detail: CandidateProfile)
  {

    return this.http.put(URL+'users/welcome/resume' , detail , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));




  }

  experience(user_id: string,detail : any ,  exp : any , history : any,language_roles :any , platform_exp : any )
  {

    return this.http.put(URL+'users/welcome/exp' , { detail :detail , education: exp  , work : history ,  language_exp : language_roles , platform_exp : platform_exp } , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));

  }

  company_terms(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/company_wizard' , detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));                }

    }));
  }

  about_company(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/about_company' , detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }

  company_image(imageObject: any)
  {

    return this.http.post(URL+ 'users/employer_image' , imageObject, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }


  candidate_prefernece(prefernces: any)
  {

    return this.http.put(URL + 'users/saved_searches' , {saved_searches : prefernces }, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }


  verify_email(email_hash: string)
  {
    //console.log(email_hash);
    return this.http.put(URL+'users/emailVerify/'+ email_hash , '').pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));
  }

  reset_password(hash: string, data: User)
  {

    return this.http.put(URL+'users/reset_password/' + hash, data)
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }

      }));
  }

  change_password(params : any)
  {

    return this.http.put(URL+'users/change_password' , params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
      {
        localStorage.setItem('jwt_not_found', 'Jwt token not found');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
        localStorage.removeItem('close_notify');
        localStorage.removeItem('linkedinUser');
        localStorage.removeItem('admin_log');
        window.location.href = '/login';
      }
      else return throwError(error);

    }));
  }

  send_refreal(email: string, subject: string, body: string,share_url: string, first_name: string, last_name: string){
    return this.http.post(URL+'users/send_refreal/', { email: email, subject: subject, body: body,share_url:share_url,first_name:first_name,last_name:last_name }, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  getCandidate(sender_id:string,receiver_id:string,msg_tag:string,type: string)
  {
    return this.http.post(URL+'users/get_candidate', {type:type,sender_id:sender_id,receiver_id:receiver_id,msg_tag:msg_tag}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  getCurrentCompany(_id: string)
  {
    return this.http.get(URL+'users/current_company/' +_id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res  ;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
        {
          this.router.navigate(['/not_found']);
        }

        else return throwError(new Error(error));
      }

    }));
  }

  insertMessage(receiver_id:string,sender_name:string,receiver_name:string,message:string,description:string,job_title:string,salary:string,currency:string,date_of_joining:string,job_type:string,msg_tag:string,is_company_reply:number,interview_location:string,interview_time:string)
  {
    return this.http.post(URL+'users/insert_message', {receiver_id:receiver_id,sender_name:sender_name,receiver_name:receiver_name,message:message,description:description,job_title:job_title,salary:salary,currency:currency,date_of_joining:date_of_joining,job_type:job_type,msg_tag:msg_tag,is_company_reply:is_company_reply,interview_location:interview_location,interview_time:interview_time}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages_comp(receiver_id: string)
  {
    return this.http.get(URL+'v2/conversations/'+receiver_id+'/messages/', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages(receiver_id: string, sender_id: any)
  {
    console.log('admin is calling');
    let queryString = '?receiver_id='+sender_id+'&admin=true';
    //return this.http.get(URL+'v2/conversations/'+queryString, {
    return this.http.get(URL+'v2/conversations/'+receiver_id+'/messages'+queryString , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages_only_comp()
  {
    return this.http.get(URL+'v2/conversations', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  get_user_messages_only(id:any)
  {
    console.log('admin is calling');
    let queryString = '?user_id='+id+'&admin=true';
    console.log(queryString);
    return this.http.get(URL+'v2/conversations/'+queryString, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  /////candidate edit profile

  edit_candidate_profile(user_id: string, detail: any,  edu :any , history:any )
  {

    return this.http.put(URL+'users/update_profile' , { detail: detail, education: edu  , work : history} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  edit_company_profile(detail :any , preferences : any  )
  {
    return this.http.put(URL+'users/update_company_profile', {info : detail , saved_searches : preferences }, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }

  //////////////filters function call////////////////////////////////
  getVerrifiedCandidate(current : string)
  {
    return this.http.post(URL+'users/verified_candidate' , {_id : current} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error )
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }

      }));

  }


  filterSearch(queryBody : any)
  {
    return this.http.post(URL+'users/filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        //console.log(error);
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  //send_message(receiver_id:string,msg_tag:string, message:any){
  //{receiver_id:receiver_id,msg_tag:msg_tag,message:message}
  //{receiver_id:'545d456d45d56d456ds',msg_tag:'file',message:'d5d45d4'}
  send_file(formData: any)
  {
    console.log(formData);
    return this.http.post(URL+'v2/messages',formData, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  insert_job_message(formData: any)
  {
    return this.http.post(URL+'users/insert_message_job',formData,{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  update_job_message(id:string,status:number)
  {
    return this.http.post(URL+'users/update_job_message', {id:id,status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  refered_id(_id: number , data : number)
  {
    return this.http.put(URL+'users/refered_id/' + _id, {info : data} ,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map(data => {

      if (data)
      {
        ////console.log(data);
        return data;
      }

    }));
  }
  //////////////call admin functions//////////////////
  aprrove_user(user_id:string , detail :number )
  {
    ////console.log(user_id);
    // //console.log(detail);
    return this.http.put(URL+'users/approve/' + user_id, {is_approve : detail}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }



  admin_candidate_filter(queryBody:any)
  {
    return this.http.post(URL+'users/admin_candidate_filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  update_candidate_profile(user_id: string, detail: any,  edu :any , history:any )
  {

    return this.http.post(URL+'users/update_candidate_profile' , { user_id : user_id ,detail: detail, education: edu  , work : history} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      console.log(error);
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }
  allCompanies()
  {
    return this.http.get(URL+'users/company', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }



  admin_company_filter(queryBody : any)
  {
    return this.http.post(URL+'users/admin_company_filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  update_chat_msg_status_new(sender_id: string,status:boolean){
    return this.http.patch(URL+'v2/conversations/'+sender_id+'/messages?is_read='+status, {},{
    //return this.http.post(URL+'users/update_chat_msg_status', {receiver_id:receiver_id,status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  update_chat_msg_status(receiver_id: string,status:number){
    return this.http.post(URL+'users/update_chat_msg_status', {receiver_id:receiver_id,status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  pages_content(info:any )
  {
    return this.http.put(URL+'users/add_privacy_content/', info,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  get_page_content(title :string)
  {
    return this.http.get(URL+'users/get_pages_content/'+ title);

  }

  send_message(receiver_id:string,msg_tag:string, message:any){
    return this.http.post(URL+'v2/messages', {receiver_id:receiver_id,msg_tag:msg_tag,message:message}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  set_unread_msgs_emails_status(status: any)
  {
    return this.http.post(URL+'users/set_unread_msgs_emails_status', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_unread_msgs_of_user(sender_id:string){
    return this.http.post(URL+'users/get_unread_msgs_of_user', {sender_id:sender_id}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }


  account_settings(user_id: string, status: any)
  {
    return this.http.post(URL+'users/account_settings', {user_id:user_id,status:status} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  destroyToken(_id:string)
  {
    //console.log(this.token);

    return this.http.post(URL+'users/destroy_token', {id:_id} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }


  update_is_company_reply_status(status:number)
  {
    return this.http.post(URL+'users/update_is_company_reply_status', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_employment_offer_info(receiver_id:string,msg_tag:string){
    return this.http.post(URL+'users/get_employ_offer', {receiver_id:receiver_id,msg_tag:msg_tag}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  updateExplanationPopupStatus(status:any){
    return this.http.post(URL+'users/updatePopupStatus', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  add_new_pages_content(info:any ) {
    return this.http.put(URL + 'users/add_terms_and_conditions_content/', info, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      //console.log(error.status);
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getUnreadMessageCount(sender_id:string) {
    return this.http.get(URL+'v2/messages?sender_id='+sender_id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getLastJobDesc() {
    return this.http.get(URL+'v2/messages/', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getRefCode(email:any) {
    return this.http.post(URL+'users/get_ref_code', {email:email} )
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error )
        {
          console.log(error);
          return throwError(new Error(error));
        }

      }));
  }

  approve_candidate(user_id:string , status :string, reason: string)
  {
    return this.http.put(URL+'users/change_candidate_status/' + user_id, {status : status,reason:reason}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  uploadCandImage(detail: any) {
    return this.http.post(URL + 'users/image', detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error) {
        if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));
  }

}
