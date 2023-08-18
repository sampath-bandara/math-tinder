import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Itutor } from 'src/app/interfaces/itutor';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-findatutor',
  templateUrl: './findatutor.component.html',
  styleUrls: ['./findatutor.component.css']
})
export class FindatutorComponent {

  isStudent: boolean = true;
  currentUserDetails: { role: string, name: string, id: number } = { role: '', name: '', id: 0 };
  allTutors!: Itutor[];
  allTutorsInitial!: Itutor[];
  filteredTutor: any;
  filterForm: FormGroup;

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) {
    this.filterForm = formBuilder.group({
      experience_id: [0]
    });

    let data = localStorage.getItem('currentUser');
    this.currentUserDetails = JSON.parse(data!);
    if (this.currentUserDetails.role === "tutor") {
      this.isStudent = false;
    }

    if (this.isStudent) {

      this.userService.getAllTutors().subscribe({
        next: (results) => {
          this.allTutors = results;
          this.allTutorsInitial = results;
          console.log(this.allTutors);
        }
      });

    }
  }

  filter() {
    let experience_id: number = this.filterForm.value.experience_id;
    if (experience_id != 0) {
      this.userService.filterTutors(experience_id).subscribe({
        next: (results) => {
          this.allTutors = results;
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.allTutors = this.allTutorsInitial;
      console.log(experience_id);
    }
  }

  // filterTutor(tutorId:number) {
  //   this.filteredTutor = this.allTutors.filter(tutor => tutor.id === tutorId);
  // }

  sendTutorRequestAlert(tutorId: number, tutorName:string) {
    let formData: any;
    formData = { "tutor_id": tutorId, "student_id": this.currentUserDetails.id };

    let text = `Send a request to tutor, ${tutorName} ?`;
    if (confirm(text) == true) {
      this.sendTutorRequest(formData);
    }
  }

  sendTutorRequest(formData: any) {
    this.userService.sendTutorRequest(formData).subscribe({
      next: (result) => {
        alert("Tutor request was sent successfully")
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

  // Test for video
  //   @ViewChild('videoPlayer')
  //   videoplayer!: ElementRef;

  //   toggleVideo() {
  //     this.videoplayer.nativeElement.play();
  // }

}
