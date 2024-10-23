import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsServiceService {

  userPermissionsList: string[] = [];

  constructor(private _HttpClient: HttpClient) { }
  private apiUrl = 'https://roseirae.runasp.net/api/Permission/';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  getAllPermissions(): Observable<any> {

    return this._HttpClient.get(`${this.apiUrl}getall`, { headers: this.getHeaders() });
  }

  userPermissions(username: string): Observable<string[]> {

    return this._HttpClient.get<string[]>(`${this.apiUrl}${username}`, { headers: this.getHeaders() });
  };
  
}
