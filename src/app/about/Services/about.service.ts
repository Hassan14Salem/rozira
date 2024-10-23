import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  controller:string='Aboutus'
  constructor(private baseService:BaseService,private http:HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }
  gets()
  {
   return this.baseService.getAll(this.controller+'/aboutus')
  }

  get(id:string)
  {
    return this.baseService.getById(id,this.controller)
  }

  add(model:any)
  {
    const headers = this.getHeaders();
    return this.http.post(this.baseService.baseUrl+this.controller+'/aboutus/save',model ,{headers:headers})
  }

  update(model:any,id:string)
  {
    return this.baseService.Update(this.controller+`/${id}`,model)
  }

  delete(id:string) :Observable<any>
  {
   return this.baseService.delete(this.controller+'/',id)
  }
}
