import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface PermissionsResponse {
  [category: string]: Permissions[];
}
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private userPermissions: string[] = [];

  setPermissions(permissions: string[]) {
    this.userPermissions = permissions;
  }

  hasPermission(permission: string): boolean {    
    return this.userPermissions.includes(permission);
  }

  constructor(private _HttpClient: HttpClient) { }


  private apiUrl = 'https://roseirae.runasp.net/api/Permission/getall';

  getAllPermissions(): Observable<any> {
    const token = localStorage.getItem('RoziraToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._HttpClient.get(this.apiUrl, { headers });
  }


  
}
