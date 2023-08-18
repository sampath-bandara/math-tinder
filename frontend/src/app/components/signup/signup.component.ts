import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { prohibited } from 'src/app/custom-validation';
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
      name: ['', [Validators.required, Validators.minLength(5), prohibited(/admin/), prohibited(/math/), prohibited(/tinder/), prohibited(/student/), prohibited(/tutor/)]],
      grade: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.registerFormTutor = formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), prohibited(/admin/), prohibited(/math/), prohibited(/tinder/), prohibited(/student/), prohibited(/tutor/)]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      qualification_id: ['', Validators.required],
      experience_id: ['', Validators.required],
    });
  }

  //Getter methods
  get passwordFormControl() {
    return this.registerFormInitial.get('password')!;
  }

  get emailFormControl() {
    return this.registerFormInitial.get('email')!;
  }

  get studentNameFormControl() {
    return this.registerFormStudent.get('name')!;
  }

  get studentGradeFormControl() {
    return this.registerFormStudent.get('grade')!;
  }

  get studentPhoneFormControl() {
    return this.registerFormStudent.get('phone')!;
  }

  get studentAddressFormControl() {
    return this.registerFormStudent.get('address')!;
  }

  get tutorNameFormControl() {
    return this.registerFormTutor.get('name')!;
  }

  get tutorPhoneFormControl() {
    return this.registerFormTutor.get('phone')!;
  }

  get tutorAddressFormControl() {
    return this.registerFormTutor.get('address')!;
  }

  get tutorQualificationFormControl() {
    return this.registerFormTutor.get('qualification_id')!;
  }

  get tutorExperinceFormControl() {
    return this.registerFormTutor.get('experience_id')!;
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

    if (this.file !== null) {
      this.formData.append('image', this.file);
    }

    if (this.isStudent) {

      for (let key in this.registerFormStudent.value) {
        this.formData.append(key, this.registerFormStudent.value[key]);
      }

      this.userService.registerStudent(this.formData).subscribe({
        next: (result) => {
          // console.log(result);
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
          // console.log(result);
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
