import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import {User} from './Model/user';
import { DataService } from './data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError} from 'rxjs';
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
    if (this.currentUser) {
      this.token = this.currentUser.jwt_token;
    }
  }

  getAll()
  {
    return this.http.post(URL+'v2/users/candidates/search?admin=true' , '' , {
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
    return this.http.get(URL+'v2/users/candidates?user_id='+_id, {
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

//getCandidateProfileById
  getCandidateProfileById(_id: string, admin: boolean)
  {
    let urlString;
    if(admin === true) urlString = URL+'v2/users/candidates?admin=true&user_id='+_id;
    else urlString = URL+'v2/users/candidates?user_id='+_id;

    return this.http.get(urlString,  {
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

  getByRefrenceCode(code: string){
    return this.http.get(URL+'v2/referral?ref_code='+code)
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

  getReferenceDetail(email: string){
    const isAdmin = true;
    return this.http.get(URL+'v2/referral?email=' +email+'&admin='+isAdmin, {
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


  createCandidate(inputBody: any)
  {
    return this.http.post(URL+'v2/users/candidates', inputBody) .pipe(map(user => {
      return user
    }));

  }

  create_employer(employer: any)
  {
    return this.http.post(URL+'v2/users/companies', employer) .pipe(map(employer => {
      return employer
    }));

  }

  forgot_password(email: string)
  {
    return this.http.post(URL+'v2/users/auth/password/reset', {email:email})
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
    return this.http.post(URL+'v2/users/email', {email: email}) .pipe(map(data => {
      return data;
    }));

  }

  candidate_login(queryInput : any)
  {
    return this.http.post(URL+'v2/users/auth', queryInput)
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


  verify_email(email_hash: string)
  {
    return this.http.patch(URL+'v2/users/email?verify_email_token='+email_hash, {})
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

  reset_password(hash: string, data: User)
  {
    return this.http.put(URL+'v2/users/auth/password/reset',{forgot_password_token: hash, new_password: data.password})
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
    return this.http.put(URL+'v2/users/auth/password' ,{current_password: params.current_password, new_password: params.confirm_password}, {
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

  send_refreal(email: string, subject: string, body: string){
    return this.http.post(URL+'v2/referral/email', { email: email, subject: subject, body: body}, {
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

  getCurrentCompany(_id: string, admin: boolean)
  {
    if(!_id) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('googleUser');
      localStorage.removeItem('close_notify');
      localStorage.removeItem('linkedinUser');
      localStorage.removeItem('admin_log');
      window.location.href = '/login';

    }
    else {
      let queryString = '?user_id='+_id;
      if(admin) queryString = '?user_id='+_id+'&admin=true';

      return this.http.get(URL+'v2/users/companies'+ queryString, {
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
        else return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages(receiver_id: string, sender_id: any)
  {
    let queryString = '?user_id='+sender_id+'&admin=true';
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
        else return throwError(new Error(error.status));
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

  get_user_messages_only(id:any)
  {
    let queryString = '?user_id='+id+'&admin=true';
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

  /////candidate edit profile

  edit_candidate_profile(user_id : any,queryBody: any, admin:boolean)
  {
    let urlString;
    if(admin === true) urlString = URL+'v2/users/candidates?admin='+ true + '&user_id=' + user_id;
    else urlString = URL+'v2/users/candidates?user_id='+ user_id ;

    return this.http.patch( urlString, queryBody , {
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

  edit_company_profile(company_id : any ,queryBody :any, admin: boolean)
  {
    let urlString;
    let queryParam;
    if(admin === true) urlString = URL+'v2/users/companies?admin='+ true + '&user_id=' +company_id;
    else urlString = URL+'v2/users/companies'+ '?user_id=' +company_id;

    return this.http.patch(urlString, queryBody , {
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
    return this.http.post(URL+'v2/users/candidates/search' , '' , {
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
    return this.http.post(URL+'v2/users/candidates/search', queryBody, {
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

  send_file(formData: any)
  {
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

  //////////////call admin functions//////////////////
  aprrove_user(user_id:string , detail :number )
  {
    return this.http.post( URL+'v2/users/companies/status?admin=' + true + '&user_id=' + user_id , {is_approved : detail},  {
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
    const admin = true;
    return this.http.post(URL+'v2/users/candidates/search?admin='+admin, queryBody, {
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

  allCompanies(queryBody:any)
  {
    return this.http.post(URL+'v2/users/companies/search?admin=true', queryBody, {
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
    return this.http.post(URL+'v2/users/companies/search?admin=true', queryBody, {
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

  update_chat_msg_status_new(sender_id: string){
    return this.http.patch(URL+'v2/conversations/'+sender_id+'/messages', {},{
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
        else return throwError(new Error(error.status));
      }

    }));
  }

  pages_content(info:any )
  {
    return this.http.post(URL+'v2/pages', {title:info.page_title, name:info.page_name, content: info.html_text}, {
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
    return this.http.get(URL+'v2/pages?name='+ title);

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

  account_settings(queryInput: any)
  {
    return this.http.patch(URL+'v2/users/settings', queryInput , {
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
    return this.http.delete(URL+'v2/users/auth' , {
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

  updateExplanationPopupStatus(status:any){
    return this.http.patch(URL+'v2/users/', {},{
    //return this.http.post(URL+'users/updatePopupStatus', {status:status}, {
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
    return this.http.post(URL+'v2/pages', {title:info.page_title, name:info.page_name, content: info.html_text}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error) {
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
        else return throwError(new Error(error.status));
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
      if (error) {
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
        else return throwError(new Error(error.status));
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
      if (error) {
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
        else return throwError(new Error(error.status));
      }
    }));
  }

  getRefCode(email:any) {
    return this.http.post(URL+'v2/referral/', {email: email})
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

  //will be changed to new rest API call
  autoSuggestOptions(queryInput:any, country : boolean) {
    return this.http.get(URL+'v2/locations?autosuggest='+queryInput+'&countries='+country, {
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

  get_users_statistics()
  {
    return this.http.get(URL+'v2/statistics');

  }

  candidate_status_history(user_id: string,queryInput:any , admin:boolean)
  {
    let urlString;
    if(admin === true) urlString = URL+'v2/users/candidates/history?admin='+ true +'&user_id='+ user_id;
    else urlString = URL+'v2/users/candidates/history?user_id='+ user_id;

    return this.http.post(urlString , queryInput, {
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


  add_to_subscribe_list(first_name:string, last_name:string, email:string){
    return this.http.post(URL+'v2/subscribers', {first_name:first_name,last_name:last_name,email:email}).pipe(map((res: Response) =>
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

  email_templates_post(queryBody : any) {
    return this.http.post(URL+'v2/email_templates?admin=true', queryBody, {
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

  email_templates_patch(queryBody : any, template_id: string) {
    return this.http.patch(URL+'v2/email_templates?admin=true&template_id='+template_id , queryBody, {
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

  email_templates_get() {
    return this.http.get(URL+'v2/email_templates/search?admin=true', {
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

  update_terms_and_privacy(queryBody :any)
  {
    return this.http.patch(URL+'v2/users/', queryBody , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status)
      {
        return throwError(error);
      }
    }));
  }

  autoSuggestSkills(queryInput:any) {
    return this.http.get(URL+'v2/skills?autosuggest='+queryInput, {
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

  //for Jobs
  postJob(queryBody : any, company_id : any, admin: boolean) {
    let urlString = URL+'v2/jobs';
    if(admin === true) urlString = URL+'v2/jobs?admin='+admin+'&company_id='+company_id;

    return this.http.post(urlString, queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) return res;
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

  getAJob(job_id: string, company_id: any, admin: boolean) {
    let urlString = URL+'v2/jobs?job_id='+job_id;
    if(admin === true) urlString = URL+'v2/jobs?admin='+admin+'&job_id='+job_id+'&company_id='+company_id;
    return this.http.get(urlString, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) return res;
    }), catchError((error: any) =>
    {
      if (error.status )
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
        else return throwError(new Error(error.status));
      }

    }));
  }

  updateJob(queryBody : any, company_id : any, job_id: any,admin: boolean) {
    let urlString = URL+'v2/jobs?company_id='+company_id+'&job_id='+job_id;
    if(admin === true) urlString = URL+'v2/jobs?admin='+admin+'&company_id='+company_id+'&job_id='+job_id;

    return this.http.patch(urlString, queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) return res;
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

}
