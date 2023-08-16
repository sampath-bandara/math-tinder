import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthguardService } from './services/authguard.service';
import { RequestsComponent } from './components/requests/requests.component';
import { FindatutorComponent } from './components/findatutor/findatutor.component';

const routes: Routes = [
  {path:'', component: HomeComponent, canActivate: [AuthguardService]},
  {path:'profile', component: ProfileComponent, canActivate: [AuthguardService]},
  {path:'about', component: AboutComponent},
  {path:'contact', component: ContactusComponent},
  {path:'login', component: SigninComponent},
  {path:'register', component: SignupComponent},
  {path:'requests', component: RequestsComponent},
  {path:'find-a-tutor', component: FindatutorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
