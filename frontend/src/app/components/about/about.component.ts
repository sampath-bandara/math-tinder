import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  isStudent: boolean = true;
  isLoggedIn: boolean = false;
  currentUserDetails: { role: string, name: string, id:number } = { role: '', name: '', id:0 };

  constructor(private router: Router) {
    let data = localStorage.getItem('currentUser');
    //Check whether the user logged in
    if (data) {
      this.isLoggedIn = true;

      this.currentUserDetails = JSON.parse(data!);
      if (this.currentUserDetails.role === "tutor") {
        this.isStudent = false;
      }
    }
  }

  logoutAlert() {
    let text = "Are you sure?";
    if (confirm(text) == true) {
      this.logout();
    } 
  }

  logout() {
    localStorage.removeItem("currentUser");
    alert('Logout was successful');
    this.router.navigate(["login"]);
  }

}
