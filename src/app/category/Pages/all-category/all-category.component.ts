import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/product/Models/product';
import { ProductService } from 'src/app/product/Services/product.service';
import { CategoryService } from '../../Services/category.service';
import { Category } from '../../Models/category';
import { BaseService } from 'src/app/shared/services/base.service';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class AllCategoryComponent implements OnInit{
  
  itemDialog:boolean = false;
  submitted:boolean = false;
  Items:Category[]=[]
  Item ={} as Category 
  pageNumber = 1;
  pageSize   =  10;
  totalRecords: number = 0;

  //reusable
  pageColumns = [
    { field: 'nameAr', header: 'tableHeader.nameAr' },
    { field: 'nameEn', header: 'tableHeader.nameEn'  },

  ];

  globalFilterFields:string[]= ['nameAr']
  confirmDeleteDialog!:boolean
  name: any = '';
  constructor(private _productService:CategoryService,
    private base:BaseService,
    private alertService:ToastrService,
    private categorySerive:CategoryService,
  private NavigateRoute:Router){}



  getItems()
  {
    this.base.getAllTest('Category',this.name,this.pageNumber,this.pageSize).subscribe({
      next:(Response) => {
        this.Items = Response.items
        this.totalRecords = Response.totalCount

        console.log('all response ', Response)

        console.log('response of category', this.Items)
      }
    })
  }

  
  getNameValue(value: any) {
    this.name = value.target.value;
    if(this.name != '') {
      this.getItems();

    } else
    {
      this.getItems();

    }
  }
  



ngOnInit(): void {
  this.getItems()
}


editItem(ev:any)
{
  this.Item = {...ev}
  this.itemDialog = true
}

deleteDialogMessage(_item:Category)
{
  this.Item = {..._item}
  this.confirmDeleteDialog = true;
}

deleteItem(ev:any)
{
  this._productService.delete(ev.id).subscribe({
    next : (Response) =>{
      if(Response === 'Category deleted successfully'){
        this.alertService.success(Response);
        this.getItems();
      }
     }, error :(err) =>{
      console.log(err)
      this.alertService.error('faild to delete Category')
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
  this.Item = {} as Category;
  this.itemDialog = true
}

save(ev:Category)
{
  console.log('item to update',ev)
  this.submitted = true;
  if(ev.id)
  {
    // update
    this.categorySerive.update(ev).subscribe({
      next:(res) => {
        if(res === 'Category updated successfully')
        {
          this.hideDialog();
          this.alertService.success('Category Updated Succefully')
          this.getItems()
        } else{
          this.alertService.error('faild to update this item')
        }
        
    

      }
    })
  } 
  
  else

  {
    //add 
    this.categorySerive.add(ev).subscribe({
      next:(res) => {
        if(res === 'Category added successfully')
            {
              console.log('add',Response)
              this.alertService.success('Category Addedd Succefully');
              this.getItems();
            } else
            {
              this.alertService.error('faild to add category')
            }

      }
    })
    this.hideDialog();

  }
}


loadItems(event:any)
  {
    console.log('category table event',event)
    const _pageNumber = event.first! / event.rows! + 1;
    const _pageSize = event.rows;

    this.pageNumber = _pageNumber;
    this.pageSize   =   _pageSize
    
    this.getItems()
  }
}
