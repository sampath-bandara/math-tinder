import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Irequest } from 'src/app/interfaces/irequest';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent {

  isStudent: boolean = true;
  currentUserDetails: { role: string, name: string, id:number } = { role: '', name: '', id:0 };
  myStudentRequests!: Irequest[];
  myTutorRequests!: Irequest[];

  constructor(private router: Router, private userService: UserService) {
    let data = localStorage.getItem('currentUser');
    this.currentUserDetails = JSON.parse(data!);
    if (this.currentUserDetails.role === "tutor") {
      this.isStudent = false;
    }

    if(this.isStudent) {

      this.userService.getTutorRequests(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.myTutorRequests = results;
          console.log(this.myTutorRequests);
        }
      });

    } else {

      this.userService.getStudentsRequests(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.myStudentRequests = results;
          console.log(this.myStudentRequests);
        }
      });

    }

  }

  deleteRequest(tutor_id:number) {
    console.log(tutor_id);
  }

  acceptStudent(student_id:number) {
    let status = "accepted";
    console.log(student_id);
    // this.acceptOrRejectAlert(student_id, status);
  }

  rejectStudent(student_id:number) {
    let status = "rejected";
    console.log(student_id);
    // this.acceptOrRejectAlert(student_id, status);
  }

  acceptOrRejectAlert(student_id:number, status:string) {
    console.log(student_id,status);
 let text = "";
    if(status === "accepted") {
      text = "Are you sure you want to accept this student?";
    } else {
      text = "Are you sure you want to reject this student?";
    }
    
    if (confirm(text) == true) {
      this.acceptOrReject(student_id, status);
    } 
  }

  acceptOrReject(student_id:number, status:string) {
    this.userService.acceptOrReject(this.currentUserDetails.id,student_id,status).subscribe({
      next: (results) => {
        if(status === "accepted") {
          alert('Student was accepted!');
        } else {
          alert('Student was rejected!');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
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
