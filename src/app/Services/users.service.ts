import { User } from '../Interfaces/user';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://roseirae.runasp.net/api/Users/all';
  private apiIdUrl = 'https://roseirae.runasp.net/api/Users';
  private deleteapiUrl = 'https://roseirae.runasp.net/api/Users/delete/';
  private apiUsers = 'https://roseirae.runasp.net/api/Users/GetUserByUserName'

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) { }

  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('RoziraToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._HttpClient.get(this.apiUrl, { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.deleteapiUrl}${userId}`;
    const token = localStorage.getItem('RoziraToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._HttpClient.delete(url, { headers });
  }

  getUserById(userId: string): Observable<User> {
    const token = localStorage.getItem('RoziraToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,

    });

    return this._HttpClient.get<User>(`${this.apiIdUrl}/${userId}`, { headers });
  }

  getUserByUsername(username: string): Observable<any> {

    return this._HttpClient.get(`${this.apiUsers}?userName=${username}`, { headers: this.getHeaders() });

  }
  editUser(userData: any): Observable<any> {
    const url = 'https://roseirae.runasp.net/api/Users/edit'; // Ensure this URL is correct
    const token = localStorage.getItem('RoziraToken');

    // Check if token exists
    if (!token) {
      throw new Error('No token found in local storage');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Specify JSON content type
    });



    return this._HttpClient.put(url, userData, { headers });
  }

}
