import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContatusServiceService {

  constructor(private _HttpClient: HttpClient) { }

  private apiUrl = 'https://roseirae.runasp.net/api/ContactUs';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('RoziraToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getAllContactMethods(): Observable<any> {

    return this._HttpClient.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  addNewMethos(contactData: any) : Observable<any>{
    return this._HttpClient.post(`${this.apiUrl}`,contactData, { headers: this.getHeaders() ,  responseType: 'text' as 'json'});
  }

  deleteMethod(id:any): Observable<any>{
    return this._HttpClient.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() , responseType: 'text' as 'json'} );

  }

  editMethod(id:any , userData:any):Observable <any>{
    const payload = { id , ...userData };
    return this._HttpClient.put(`${this.apiUrl}/`,payload,{ headers: this.getHeaders() , responseType: 'text' as 'json'} );
    
  }
}
