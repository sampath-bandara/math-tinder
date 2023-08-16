import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Irequest } from 'src/app/interfaces/irequest';
import { Istudent } from 'src/app/interfaces/istudent';
import { Itutor } from 'src/app/interfaces/itutor';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isStudent: boolean = true;
  currentUserDetails: { role: string, name: string, id:number } = { role: '', name: '', id:0 };
  myStudents!: Irequest[];
  myTutors!: Irequest[];

  constructor(private router: Router, private userService: UserService) {
    let data = localStorage.getItem('currentUser');
    this.currentUserDetails = JSON.parse(data!);
    if (this.currentUserDetails.role === "tutor") {
      this.isStudent = false;
    }

    if(this.isStudent) {

      this.userService.getMyTutors(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.myTutors = results;
          console.log(this.myTutors);
        }
      });

    } else {

      this.userService.getMyStudents(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.myStudents = results;
          console.log(this.myStudents);
        }
      });

    }
  }

  deleteRequest(tutor_id:number) {
    console.log(tutor_id);
  }

  logoutAlert() {
    let text = "Are you sure?";
    if (confirm(text) == true) {
      this.logout();
    } 
  }

  logout() {
    localStorage.removeItem("currentUser");
    // alert('Logout was successful');
    this.router.navigate(["login"]);
  }

}
