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
  currentUserDetails: { role: string, name: string, id: number } = { role: '', name: '', id: 0 };
  myStudentRequests!: Irequest[];
  myTutorRequests!: Irequest[];

  constructor(private router: Router, private userService: UserService) {
    let data = localStorage.getItem('currentUser');
    this.currentUserDetails = JSON.parse(data!);
    if (this.currentUserDetails.role === "tutor") {
      this.isStudent = false;
    }

    if (this.isStudent) {

      this.userService.getTutorRequests(this.currentUserDetails.id).subscribe({
        next: (results) => {
          this.myTutorRequests = results;
          // console.log(this.myTutorRequests);
        }
      });

    } else {

      this.userService.getStudentsRequests(this.currentUserDetails.id).subscribe({
        next: (results) => {
          this.myStudentRequests = results;
          // console.log(this.myStudentRequests);
        }
      });

    }

  }

  deleteRequest(tutor_id: number, tutor_name:string) {
    let text = `Delete the request for the tutor, ${tutor_name} ?`;
    if (confirm(text) == true) {
      this.userService.deleteRequest(this.currentUserDetails.id, tutor_id).subscribe({
        next: (result) => {
          alert("Request deleted successfully");

          // Get tutor array index
        let index = this.myTutorRequests.findIndex((s) => {
          return s.id === tutor_id;
        });

        // Delete student record
        this.myTutorRequests.splice(index, 1);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  acceptStudent(student_id: number, student_name:string) {
    let status = "accepted";
    // console.log(student_id);
    this.acceptOrRejectAlert(student_id, status, student_name);
  }

  rejectStudent(student_id: number, student_name:string) {
    let status = "rejected";
    // console.log(student_id);
    this.acceptOrRejectAlert(student_id, status, student_name);
  }

  acceptOrRejectAlert(student_id: number, status: string, student_name:string) {
    console.log(student_id, status);
    let text = "";
    if (status === "accepted") {
      text = `Accept the student, ${student_name} ?`;
    } else {
      text = `Reject the student, ${student_name} ?`;
    }

    if (confirm(text) == true) {
      this.acceptOrReject(student_id, { "status": status });
    }
  }

  acceptOrReject(student_id: number, status: any) {
    this.userService.acceptOrReject(this.currentUserDetails.id, student_id, status).subscribe({
      next: (results) => {
        // console.log(results);
        if (status === "accepted") {
          alert('Student was accepted!');
        } else {
          alert('Student was rejected!');
        }

        // Get student array index
        let index = this.myStudentRequests.findIndex((s) => {
          return s.id === student_id;
        });

        // Delete student record
        this.myStudentRequests.splice(index, 1);

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
