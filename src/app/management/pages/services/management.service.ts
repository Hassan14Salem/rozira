import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  baseUrl:string='https://roseirae.runasp.net/api/';
  controller:string='Profile/'

  constructor(private baseService:BaseService,private http:HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  //fetch all admins
  getAdmins(userName:string,phoneNum:string,email:string,PageNumber:number,pageSize:number):Observable<any>
  {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}${this.controller}GetAdmins?Username=${userName}&PhoneNumber=${phoneNum}&Email=${email}&PageNumber=${PageNumber}&PageSize=${pageSize}`,{headers:headers})
  }



  //fetch all users
  getUsers(userName:string,phoneNum:string,email:string,PageNumber:number,pageSize:number):Observable<any>
  {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}${this.controller}GetUsers?Username=${userName}&PhoneNumber=${phoneNum}&Email=${email}&PageNumber=${PageNumber}&PageSize=${pageSize}`,{headers:headers})
  }
}
