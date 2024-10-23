import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/category/Models/category';
import { About } from '../../Models/about';
import { AboutService } from '../../Services/about.service';

@Component({
  selector: 'app-all-about',
  templateUrl: './all-about.component.html',
  styleUrls: ['./all-about.component.css']
})
export class AllAboutComponent implements OnInit{

  itemDialog:boolean = false;
  submitted:boolean = false;
  //reusable

  pageColumns = [
    { field: 'descriptionAr', header: 'Arabic Name',filterable: true },
    { field: 'descriptionEn', header: 'English Name',filterable: true  },

  ];

  globalFilterFields:string[]= ['nameAr']
  confirmDeleteDialog!:boolean
  title :string = 'level.header'
  constructor(private _aboutService:AboutService,
    private alertService:ToastrService,
  private NavigateRoute:Router){}
  Items:About[]=[]
  Item ={} as About 
  categories:any[]=[]


  getItems()
  {
    this._aboutService.gets().subscribe({
      next:(Response) => {
        this.Item = Response
        console.log('response', this.Items)
      }
    })
  }


ngOnInit(): void {
  this.getItems()
}


editItem(ev:any)
{
  console.log(ev)
  this.Item = {...ev}
  this.itemDialog = true
}

deleteDialogMessage(_item:About)
{
  this.Item = {..._item}
  this.confirmDeleteDialog = true;
}

deleteItem(ev:any)
{
  this._aboutService.delete(ev.id).subscribe({
    next : (Response) =>{
      console.log(Response)
      if(Response.status ===200)
      {
        this.alertService.success('Product Deleted Successfully');
        this.getItems();
      }
      console.log(Response)
     }, error :(err) =>{
      console.log(err)
      this.alertService.error(err.error.error.message)
     }
  } )

  this.hideDialog()

}


hideDialog()
{
  this.confirmDeleteDialog = false;
  this.itemDialog = false;

}

openNew()
{
  this.Item = {} as About;
  this.itemDialog = true
}

save(ev:About)
{
  console.log('about',ev)
  this.submitted = true;
 
    // update
    this._aboutService.add(ev).subscribe({
      next:(Response) => {
        this.alertService.success('Updated Successfully')
        this.getItems();
       console.log(Response)
      
      },
      error:(err) =>{
        this.alertService.error('Failded to Updated ')

        console.log(err)
      }
    })
    this.hideDialog();

  }
}
