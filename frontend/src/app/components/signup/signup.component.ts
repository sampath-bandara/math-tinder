import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerFormInitial: FormGroup;
  registerFormStudent: FormGroup;
  registerFormTutor: FormGroup;
  isStudent: Boolean = true;
  formData = new FormData();
  file = null;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.registerFormInitial = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['student']
    });

    this.registerFormStudent = formBuilder.group({
      name: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.registerFormTutor = formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      qualification_id: ['', Validators.required],
      experience_id: ['', Validators.required],
    });
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  registerInit() {

    for (let key in this.registerFormInitial.value) {
      this.formData.append(key, this.registerFormInitial.value[key]);
    }

    this.isStudent = this.registerFormInitial.value.role == "student" ? true : false;

    this.registerFormInitial.reset();

  }

  register() {

    if(this.file !== null){
      this.formData.append('image', this.file);
    }

    if (this.isStudent) {
      for (let key in this.registerFormStudent.value) {
        this.formData.append(key, this.registerFormStudent.value[key]);
      }
      this.userService.registerStudent(this.formData).subscribe({
        next: (result) => {
          console.log(result);
          alert('Student user was created successfully');
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          console.log(err);
          alert(err);
        }
      });
      this.registerFormStudent.reset();
    } else {
      for (let key in this.registerFormTutor.value) {
        this.formData.append(key, this.registerFormTutor.value[key]);
      }
      this.userService.registerTutor(this.formData).subscribe({
        next: (result) => {
          console.log(result);
          alert('Tutor user was created successfully');
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          console.log(err);
          alert(err);
        }
      });
      this.registerFormTutor.reset();
    }
  }

}
