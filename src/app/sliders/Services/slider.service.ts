import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
controller:string='sliders'
  constructor(private http:HttpClient,private base:BaseService) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  
  
  getSliders(_Name:string,_PageNumber:number,_PageSize:number)
  {
    const headers = this.getHeaders();
    //controler:string,_Name:string,_PageNumber:number,_PageSize:number
   return this.http.get(`${this.base.baseUrl}${this.controller}?pageIndex=${_PageNumber}&PageSize=${_PageSize}`,{headers:headers})
  }

  update(model:any)
  {
    return this.base.Update(this.controller,model)
  }

  add(model:any)
  {
    const headers = this.getHeaders();

    return this.http.post(this.base.baseUrl+this.controller,model,{responseType: 'text',headers:headers})
  }

  deleteSlider(id:string) :Observable<any>
  {
    const headers = this.getHeaders();

   return this.http.delete(this.base.baseUrl+this.controller+`/delete/${id}` , {responseType: 'text',headers:headers})
  }
}
