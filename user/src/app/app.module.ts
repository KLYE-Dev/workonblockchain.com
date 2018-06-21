import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule,FormGroup, FormArray }    from '@angular/forms';
import { UserService } from './user.service';
import { AboutComponent } from './about/about.component';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { JobComponent } from './job/job.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import { FinalComponent } from './final/final.component';
import { DatePipe } from '@angular/common';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DataService } from "./data.service";
import { EmployerSignupComponent } from './employer-signup/employer-signup.component';
import { ReferralComponent } from './referral/referral.component';
import { ReferComponent } from './refer/refer.component';
import { ChatComponent } from './chat/chat.component';
import { TermsWizardComponent } from './terms-wizard/terms-wizard.component';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EditCandidateProfileComponent } from './edit-candidate-profile/edit-candidate-profile.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { CompanySearchComponent } from './company-search/company-search.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    //provider: new GoogleLoginProvider("507151802069-rbqn1iqupcbr7t7ge50nup74fu0td5g0.apps.googleusercontent.com")
        provider: new GoogleLoginProvider("507151802069-sedtrf34188eet5oo4adrm60vlsruo5r.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}

const appRoutes: Routes = [
    { path: 'signup', component: CandidateFormComponent},
    { path: 'about', component: AboutComponent},
    { path: 'job', component: JobComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: '', component: HomeComponent},
    { path: 'resume', component: ResumeComponent},
    { path: 'experience', component: ExperienceComponent},
    { path: 'candidate_profile', component: CandidateProfileComponent},
    { path: 'verify_email/:email_hash', component: VerifyEmailComponent},
    { path: 'forgot_password', component: ForgotPasswordComponent},
    { path: 'reset_password/:hash', component: ResetPasswordComponent},
     { path: 'referral', component: ReferralComponent},
    { path: 'refer/:code', component: LoginComponent},
    { path: 'chat', component: ChatComponent},
    // otherwise redirect to home
    { path: 'company_wizard', component: TermsWizardComponent},
    {path : 'about_comp' , component: AboutCompanyComponent},
    {path : 'company_profile' , component:CompanyProfileComponent},
    {path : 'not_found' , component:NotFoundComponent},
    {path : 'edit_profile' , component: EditCandidateProfileComponent},
    {path : 'edit_company_profile' , component: EditCompanyProfileComponent},
    {path : 'search' , component: CompanySearchComponent},
    { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    CandidateFormComponent,
    AboutComponent,
   // FileSelectDirective,
    JobComponent,
    LoginComponent,
    HomeComponent,
    ResumeComponent,
    ExperienceComponent,
    FinalComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmployerSignupComponent,
    ReferralComponent,
    ChatComponent,
    ReferComponent,
    TermsWizardComponent,
    AboutCompanyComponent,
    CompanyProfileComponent,
    NotFoundComponent,
    CandidateProfileComponent,
    EditCandidateProfileComponent,
    HeaderComponent,
    FooterComponent,
    EditCompanyProfileComponent,
    CompanySearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LinkedInSdkModule,
    SocialLoginModule,
     HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: 
  [
    UserService,DatePipe,DataService,
  {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    { provide: 'apiKey', useValue: '78axuc5uh894iq' } //useValue : '78lfupn2m88e4u'
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


