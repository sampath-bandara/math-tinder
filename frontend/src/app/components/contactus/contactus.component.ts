import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {

  isStudent: boolean = true;
  isLoggedIn: boolean = false;
  currentUserDetails: { role: string, name: string, id:number } = { role: '', name: '', id:0 };
  contactForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService) {

    this.contactForm = formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });

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

  send() {
    // console.log(this.contactForm.value);

    this.userService.sendContactMessage(this.contactForm.value).subscribe({
      next: (result) => {
        alert("Message sent successfully");
        this.contactForm.reset();
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
