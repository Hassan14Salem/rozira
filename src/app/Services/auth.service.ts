import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable , BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userProfile= new BehaviorSubject(null);
  showErrorHandelling:boolean=false;

  constructor(private _HttpClient : HttpClient , private _Router :Router) {
    if(localStorage.getItem('RoziraToken') !==null){
      this.decodeUserToken();
    }
    else{
    this._Router.navigate(['/login'])

    }
   }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  register(data:FormGroup):Observable <any>{
    return this._HttpClient.post('https://roseirae.runasp.net/api/Users/register' , data,{ headers: this.getHeaders() });
  }

  login(data:FormGroup):Observable <any>{
    
    return this._HttpClient.post('https://roseirae.runasp.net/api/Users/login' , data);
  }

  getUserPermissionsByUsername(username: string): Observable<string[]> {
    return this._HttpClient.get<string[]>(`https://roseirae.runasp.net/api/Permission/${username}`,{ headers: this.getHeaders() });
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



  logout(){
    localStorage.removeItem('RoziraToken');
    this.userProfile.next(null);
    this._Router.navigate(['/login'])
  }
  
}


