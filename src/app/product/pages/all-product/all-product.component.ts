import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { CategoryService } from 'src/app/category/Services/category.service';
import { Router } from '@angular/router';
import { Product } from '../../Models/product';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/shared/services/base.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  
  //reusable

  pageColumns = [
    { field: 'categoryId', header: 'category',filterable: true },
    { field: 'productName', header: 'product Name',filterable: true  },
    { field: 'customerPrice', header: 'cust. Price' ,filterable: true },
    { field: 'customerDiscount', header: 'cust. Discount',filterable: true },
    { field: 'priceAfterCustomerDiscount', header: 'After Discount',filterable: true  },
    { field: 'traderPrice', header: 'trader Price',filterable: true  },
    { field: 'traderDiscount', header: 'trader Discount',filterable: true  },
    { field: 'priceAfterTraderDiscount', header: 'After Discount',filterable: true  },
    { field: 'quantity', header: 'quantity',filterable: true  },
    { field: 'description', header: 'description',filterable: true  },

  ];
  globalFilterFields:string[]= ['nameAr']
  confirmDeleteDialog!:boolean
  totalRecords!:number;
  title :string = 'product.all'
  name:any='';
  constructor(private _productService:ProductService,
    private alertService:ToastrService,
    private base:BaseService,
    private categorySerive:CategoryService,
  private NavigateRoute:Router){}
  products:any[]=[]
  product ={} as Product 
  categories:any[]=[]
    pageNumber:number = 1;
    pageSize!:number;


  getProducts()
  {
    console.log('name from the get products',this.name)
    this.base.getAllTest('Product',this.name,this.pageNumber,10).subscribe({
      next:(Response) => {
        this.products = Response.items
        this.totalRecords = Response.totalCount
        this.getCategories();
      }
    })
  }



  getNameValue(value: any) {
    this.name = value.target.value;
    if(this.name != '') {
      this.getProducts();

    } else
    {
      this.getProducts();

    }
  }

 getCategories()
 {
  this.categorySerive.gets().subscribe({
    next:(Response) => {
      this.categories = Response
    }
  })
 }
ngOnInit(): void {
  this.getProducts()
}


editItem(ev:any)
{
  this.NavigateRoute.navigate(['/product/update',ev.id])
}

deleteDialogMessage(_item:Product)
{
  this.product = {..._item}
  this.confirmDeleteDialog = true;
}

deleteItem(ev:any)
{
  this._productService.delete(ev.id).subscribe({
    next : (Response) =>{
      console.log(Response)
      if(Response === 'Product deleted successfully')
      {
        this.alertService.success('Product Deleted Successfully');
        this.getProducts();
      }
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

}

openNew()
{
  this.NavigateRoute.navigate(['/product/add'])
}






loadItems(event:any)
  {
    console.log('product table event',event)
    const _pageNumber = event.first! / event.rows! + 1;
    const _pageSize = event.rows;
    this.pageNumber = _pageNumber;
    this.pageSize   =   _pageSize
    this.getProducts()
  }






}
