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

  private apiUrl = 'https://roseirae.runasp.net/api/Permission/getall';

  constructor(private _HttpClient: HttpClient) { }

  private userPermissions: string[] = [];

  setPermissions(permissions: string[]) {
    this.userPermissions = permissions;
  }

  hasPermission(permission: string): boolean {    
    return this.userPermissions.includes(permission);
  }




  getAllPermissions(): Observable<any> {
    const token = localStorage.getItem('RoziraToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._HttpClient.get(this.apiUrl, { headers });
  }


  
}
