import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private RoleURL = 'https://roseirae.runasp.net/api/Roles';

  constructor(private _HttpClient: HttpClient) { }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }


  getRoles(): Observable<any> {
    return this._HttpClient.get<any>(`${this.RoleURL}/getall`, { headers: this.getHeaders() });
  }
  createRoles(roleName: string): Observable<any> {
    return this._HttpClient.post<any>(`${this.RoleURL}/create`, `"${roleName}"`, { headers: this.getHeaders() });
  }

  getPermissionsByRole(roleId: string) {
    return this._HttpClient.get<any>(`${this.RoleURL}/${roleId}/permissions-of-role`, { headers: this.getHeaders() });
  }

  updatePermissions(roleId: string, permissions: any): Observable<any> {

    return this._HttpClient.put<any>(
      `${this.RoleURL}/${roleId}/permissions`, permissions, { headers: this.getHeaders(), responseType: 'text' as 'json' });

  }

  deletePermission(roleId: string): Observable<any> {

    return this._HttpClient.delete(`${this.RoleURL}/${roleId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

}
