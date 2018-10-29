import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CandidateModuleRoutingModule } from './candidate-module-routing.module';

import { CandidateTermsComponent } from './candidate-terms/candidate-terms.component';
import { LinkedinImportComponent } from './linkedin-import/linkedin-import.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { ResumeComponent } from './resume/resume.component';
import { ExperienceComponent } from './experience/experience.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EditCandidateProfileComponent } from './edit-candidate-profile/edit-candidate-profile.component';
import {ProfileResolver} from '../incomplete-profile.resolver';

@NgModule({
  imports: [
    CommonModule,
    CandidateModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CandidateTermsComponent,
    LinkedinImportComponent,
    AboutComponent,
    JobComponent,
    ResumeComponent,
    ExperienceComponent,
    CandidateProfileComponent,
    EditCandidateProfileComponent
  ],
  providers:
    [
      ProfileResolver
    ]
})
export class CandidateModuleModule { }
