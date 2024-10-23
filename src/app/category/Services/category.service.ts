import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
controller:string='Category'
  constructor(private baseService:BaseService) { }

  gets()
  {
   return this.baseService.getAll(this.controller)
  }

  get(id:string)
  {
    return this.baseService.getById(id,this.controller)
  }

  add(model:any)
  {
    return this.baseService.Add(this.controller,model)
  }

  update(model:any)
  {
    return this.baseService.Update(this.controller,model)
  }

  delete(id:string) :Observable<any>
  {
   return this.baseService.delete(this.controller,id)
  }

}
