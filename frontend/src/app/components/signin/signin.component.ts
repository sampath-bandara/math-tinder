import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router){
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['student', [Validators.required]]
    });
  }

   //Getter methods
   get passwordFormControl() {
    return this.loginForm.get('password')!;
  }

  get emailFormControl() {
    return this.loginForm.get('email')!;
  }

  login(){
    let formData = this.loginForm.value;

    if(this.loginForm.value.role === 'student') {
      this.userService.loginStudent(formData).subscribe({
        next: (result) => {
          localStorage.setItem("currentUser", JSON.stringify(result)); //Store the user data on our browser
          alert('Login was successful');
          this.router.navigate([""]);
        },
        error: (err) => {
          alert(err.error);
          console.log(err);
        }
      });
    } else {
      this.userService.loginTutor(formData).subscribe({
        next: (result) => {
          localStorage.setItem("currentUser", JSON.stringify(result)); //Store the user data on our browser
          alert('Login was successful');
          this.router.navigate([""]);
        },
        error: (err) => {
          alert(err.error);
          console.log(err);
        }
      });
    }

    
  }

}
