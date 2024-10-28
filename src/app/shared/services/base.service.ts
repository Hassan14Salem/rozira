import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
baseUrl:string='https://roseirae.runasp.net/api/';

  constructor(private http:HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }
    
  getAllTest(controler:string,_Name:string,_PageNumber:number,_PageSize:number) :Observable<any>
  {
    const headers = this.getHeaders();
   return this.http.get<any>(`${this.baseUrl}${controler}?Name=${_Name}&PageNumber=${_PageNumber}&PageSize=${_PageSize}`, {headers:headers})
  }
  
  
  getAll(controler:string) :Observable<any>
  {
    //https://roseirae.runasp.net/api/Product?Name=aa&PageNumber=1&PageSize=10
    const headers = this.getHeaders();
   return this.http.get<any>(this.baseUrl+controler, {headers:headers})
  }
  
  getById(id: any, controller: string):Observable<any> 
  {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}${controller}/${id}`,{headers:headers});

  }


  
  Add(controller: string, model: any):Observable<any>  {
    const headers = this.getHeaders();
   
    // if (!model.id) {
    //   // model.CreatedBy = this.authService.decodedToken.nameid;
    // }
    // model.LastModifiedBy = this.authService.decodedToken.nameid;
    return this.http.post(this.baseUrl + controller  , model,{ responseType: 'text' ,headers:headers});
  }

  //Update
  Update(controller: string, model: any) :Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(this.baseUrl + controller , model,{ responseType: 'text' ,headers:headers});
  }

  
 
  delete(controller:string,id:string) :Observable<any>
  {
    const headers = this.getHeaders();

   return this.http.delete(this.baseUrl+controller+`/delete/${id}` , {responseType: 'text',headers:headers})
  }
}
