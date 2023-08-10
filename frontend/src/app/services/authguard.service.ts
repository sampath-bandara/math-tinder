import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean{
    if(!this.userService.isAuthenticated()){
      this.router.navigate(["login"]);
      return false
    } else {
      return true;
    }
  }
}
