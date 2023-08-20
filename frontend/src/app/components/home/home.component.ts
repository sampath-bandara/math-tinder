import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Imessage } from 'src/app/interfaces/imessage';
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

  deleteTutor(tutor_id:number, tutor_name:string) {
    let text = `Delete the tutor, ${tutor_name} ?`;
    if (confirm(text) == true) {
      this.userService.deleteRequest(this.currentUserDetails.id, tutor_id).subscribe({
        next: (result) => {
          alert("Tutor deleted successfully");

          // Get tutor array index
        let index = this.myTutors.findIndex((s) => {
          return s.id === tutor_id;
        });

        // Delete student record
        this.myTutors.splice(index, 1);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  deleteStudent(student_id:number, student_name:string) {
    let text = `Delete the student, ${student_name} ?`;
    if (confirm(text) == true) {
      this.userService.deleteRequest(student_id,this.currentUserDetails.id).subscribe({
        next: (result) => {
          alert("Student deleted successfully");

          // Get student array index
        let index = this.myStudents.findIndex((s) => {
          return s.id === student_id;
        });

        // Delete student record
        this.myStudents.splice(index, 1);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
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
