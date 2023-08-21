import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { Imessage } from 'src/app/interfaces/imessage';
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
  messageId: number = 0;
  messageName: string = "";
  myMessages!: Imessage[];
  messageForm: FormGroup;

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) {

    this.messageForm = formBuilder.group({
      new_message: ['', [Validators.required]]
    });

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

  deleteRequest(tutor_id: number, tutor_name: string) {
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

  acceptStudent(student_id: number, student_name: string) {
    let status = "accepted";
    // console.log(student_id);
    this.acceptOrRejectAlert(student_id, status, student_name);
  }

  rejectStudent(student_id: number, student_name: string) {
    let status = "rejected";
    // console.log(student_id);
    this.acceptOrRejectAlert(student_id, status, student_name);
  }

  acceptOrRejectAlert(student_id: number, status: string, student_name: string) {
    // console.log(student_id, status);
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

  getMessages(message_id: number, message_name: string) {

    this.messageId = message_id;
    this.messageName = message_name;

    this.getAllMessages();

  }

  getAllMessages() {
    if(this.isStudent) {
      this.userService.getAllMessages(this.currentUserDetails.id, this.messageId,).subscribe({
        next: (results) => {
          this.myMessages = results;
          this.myMessages.reverse();
        },
        error: (err) => {
          console.log(err);
          alert("Something went wrong");
        }
      });
    } else {
      this.userService.getAllMessages(this.messageId, this.currentUserDetails.id).subscribe({
        next: (results) => {
          this.myMessages = results;
          this.myMessages.reverse();
        },
        error: (err) => {
          console.log(err);
          alert("Something went wrong");
        }
      });
    }
    
  }

  sendMessage() {
    let formData = new FormData();
    for (let key in this.messageForm.value) {
      formData.append(key, this.messageForm.value[key]);
    }
    if (this.isStudent) {
      formData.append('sender_role', 'student');
      this.userService.sendMessage(this.currentUserDetails.id, this.messageId, formData).subscribe({
        next: (result) => {
          // alert("Message sent succeefully");
          // console.log(result);
          this.messageForm.reset();
          this.getMessages(this.messageId, this.messageName);
        },
        error: (err) => {
          alert("Sending failed");
          console.log(err);
        }
      });
    } else {
      formData.append('sender_role', 'tutor');
      this.userService.sendMessage(this.messageId, this.currentUserDetails.id, formData).subscribe({
        next: (result) => {
          // alert("Message sent succeefully");
          // console.log(result);
          this.messageForm.reset();
          this.getMessages(this.messageId, this.messageName);
        },
        error: (err) => {
          alert("Sending failed");
          console.log(err);
        }
      });
    }
  }

  clearForm() {
    this.messageForm.reset();
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
