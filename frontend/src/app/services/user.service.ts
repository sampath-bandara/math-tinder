import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Itutor } from '../interfaces/itutor';
import { Istudent } from '../interfaces/istudent';
import { Irequest } from '../interfaces/irequest';
import { Imessage } from '../interfaces/imessage';
import { Icontactmessage } from '../interfaces/icontactmessage';
import { Observable, Subject, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  registerTutor(formData: any) {
    return this.httpClient.post<Itutor>('http://localhost:3000/tutor_register', formData);
  }

  loginTutor(formData: any) {
    return this.httpClient.post<Itutor>('http://localhost:3000/tutor_login', formData);
  }

  registerStudent(formData: any) {
    return this.httpClient.post<Istudent>('http://localhost:3000/student_register', formData);
  }

  loginStudent(formData: any) {
    return this.httpClient.post<Istudent>('http://localhost:3000/student_login', formData);
  }

  getUserData() {
    let data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null; //JSON.parse converts string to an object
  }

  isAuthenticated() {
    return (this.getUserData() !== null) ? true : false;
  }

  getMyStudents(userId: number) {
    return this.httpClient.get<Irequest[]>(`http://localhost:3000/my_students/${userId}`);
  }

  getMyTutors(userId: number) {
    return this.httpClient.get<Irequest[]>(`http://localhost:3000/my_tutors/${userId}`);
  }

  getStudentsRequests(userId: number) {
    return this.httpClient.get<Irequest[]>(`http://localhost:3000/student_requests/${userId}`);
  }

  getTutorRequests(userId: number) {
    return this.httpClient.get<Irequest[]>(`http://localhost:3000/tutor_requests/${userId}`);
  }

  acceptOrReject(tutorID: number, studentId: number, status: string) {
    return this.httpClient.patch<Irequest>(`http://localhost:3000/student_requests/${tutorID}/${studentId}`, status);
  }

  filterTutors(experienceId: number) {
    return this.httpClient.get<Itutor[]>(`http://localhost:3000/filter/${experienceId}`);
  }

  sendTutorRequest(formData: any) {
    return this.httpClient.post<Irequest>(`http://localhost:3000/tutor_requets`, formData);
  }

  getAllTutors() {
    return this.httpClient.get<Itutor[]>(`http://localhost:3000/tutors`);
  }

  getStudentProfile(userId: number) {
    return this.httpClient.get<Istudent>(`http://localhost:3000/student_profile/${userId}`);
  }

  getTutorProfile(userId: number) {
    return this.httpClient.get<Itutor>(`http://localhost:3000/tutor_profile/${userId}`);
  }

  updateStudentProfile(userId: number, formData: any) {
    return this.httpClient.put<Istudent>(`http://localhost:3000/students/${userId}`, formData);
  }

  updateTutorProfile(userId: number, formData: any) {
    return this.httpClient.put<Itutor>(`http://localhost:3000/tutors/${userId}`, formData);
  }

  deleteRequest(student_id: number, tutor_id: number) {
    return this.httpClient.delete<Irequest>(`http://localhost:3000/requests/${student_id}/${tutor_id}`);
  }

  sendContactMessage(formData: any) {
    return this.httpClient.post<Icontactmessage>(`http://localhost:3000/contact_us`, formData);
  }

  getAllMessages(studentId: number, tutorId: number) {
    return this.httpClient.get<Imessage[]>(`http://localhost:3000/messages/${studentId}/${tutorId}`);
  }

  sendMessage(studentId: number, tutorId: number, formData: any) {
    return this.httpClient.post<Imessage>(`http://localhost:3000/messages/${studentId}/${tutorId}`, formData);
  }
}
