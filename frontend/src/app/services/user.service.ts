import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUserData(){
    let data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null; //JSON.parse converts string to an object
  }

  isAuthenticated(){
    return (this.getUserData() !== null) ? true : false;
  }
}
