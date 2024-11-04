import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ///auth servies
  userProfile = new BehaviorSubject<any>(null);
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();
  showErrorHandelling: boolean = false;
  private apiUrlPermission = 'https://roseirae.runasp.net/api/Permission';
  
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    if (localStorage.getItem('RoziraToken') !== null) {
      this.decodeUserToken();
    } else {
      this._Router.navigate(['/login']);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  register(data: FormGroup): Observable<any> {
    return this._HttpClient.post('https://roseirae.runasp.net/api/Users/register', data, { headers: this.getHeaders() });
  }

  login(data: FormGroup): Observable<any> {
    return this._HttpClient.post('https://roseirae.runasp.net/api/Users/login', data).pipe(
      tap((response: any) => {
        localStorage.setItem('RoziraToken', response.token);

        this.decodeUserToken();
        this.fetchPermissions();
        setTimeout(() => {
          window.location.reload();
            
          }, 500);
      })
    );
  }

  getUserPermissionsByUsername(username: string): Observable<string[]> {
    return this._HttpClient.get<any[]>(`${this.apiUrlPermission}/${username}`, { headers: this.getHeaders() });
  }
  
  decodeUserToken(): string | null {
    let encodedToken: any = localStorage.getItem('RoziraToken');
    if (encodedToken) {
      let decoded: any = jwtDecode(encodedToken);
      this.userProfile.next(decoded);

      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
    }
    return null;
  }

  // Fetch and update permissions in BehaviorSubject
  fetchPermissions(): void {
    const username = this.decodeUserToken();
    if (username) {
      this.getUserPermissionsByUsername(username).subscribe({
        next: (permissions: string[]) => {
          localStorage.setItem('userPermissions', JSON.stringify(permissions));
          this.permissionsSubject.next(permissions); // Update BehaviorSubject with permissions
        },
      });
    }
  }
 
  logout() {
    localStorage.removeItem('RoziraToken');
    localStorage.removeItem('userPermissions');
    this.permissionsSubject.next([]);
    this.userProfile.next(null);
    this.permissionsSubject.next([]);
    this._Router.navigate(['/login']);

  }
}
