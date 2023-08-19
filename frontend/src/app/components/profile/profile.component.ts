import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Istudent } from 'src/app/interfaces/istudent';
import { Itutor } from 'src/app/interfaces/itutor';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  isStudent: boolean = true;
  currentUserDetails: { role: string, name: string, id:number } = { role: '', name: '', id:0 };
  myStudentProfile!: Istudent;
  myTutorProfile!: Itutor;
  profileFormStudent: FormGroup;
  profileFormTutor: FormGroup;
  file = null;


  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) {

    this.profileFormStudent = formBuilder.group({
      name: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['',[Validators.required]]
    });

    this.profileFormTutor = formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      qualification_id: ['', Validators.required],
      experience_id: ['', Validators.required],
      email: ['',[Validators.required]]
    });

    let data = localStorage.getItem('currentUser');
    this.currentUserDetails = JSON.parse(data!);
    if (this.currentUserDetails.role === "tutor") {
      this.isStudent = false;
    }

    if(this.isStudent) {

      this.userService.getStudentProfile(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.profileFormStudent.patchValue(results); 
          this.myStudentProfile = results;
        }
      });

    } else {

      this.userService.getTutorProfile(this.currentUserDetails.id).subscribe({
        next:(results) => {
          this.profileFormTutor.patchValue(results);
          this.myTutorProfile = results;
        }
      });

    }

  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  updateProfile() {

    if (this.isStudent) {
      let formData = new FormData();
      for (let key in this.profileFormStudent.value) {
        formData.append(key, this.profileFormStudent.value[key]);
      }

      if(this.file !== null){
        formData.append('image', this.file);
      }

      this.userService.updateStudentProfile(this.currentUserDetails.id,formData).subscribe({
        next: (result) => {
          // console.log(result);
          localStorage.setItem("currentUser", JSON.stringify(result));
          alert('Student profile was updated successfully');
          this.router.navigate(["/"]);
        },
        error: (err) => {
          console.log(err);
          alert(err);
        }
      });

    } else {
      let formData = new FormData();
      for (let key in this.profileFormTutor.value) {
        formData.append(key, this.profileFormTutor.value[key]);
      }

      if(this.file !== null){
        formData.append('image', this.file);
      }

      this.userService.updateTutorProfile(this.currentUserDetails.id,formData).subscribe({
        next: (result) => {
          // console.log(result);
          localStorage.setItem("currentUser", JSON.stringify(result));
          alert('Tutor profile was updated successfully');
          this.router.navigate(["/"]);
        },
        error: (err) => {
          console.log(err);
          alert(err);
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
    alert('Logout was successful');
    this.router.navigate(["login"]);
  }

}
