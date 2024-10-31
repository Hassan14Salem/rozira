import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { CategoryService } from 'src/app/category/Services/category.service';
import { Router } from '@angular/router';
import { Product } from '../../Models/product';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/shared/services/base.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  permissionsLoaded = false;
  permissions: string[] = [];
  //reusable
  imageTitle:string='Product Image'
  pageColumns = [
    { field: 'categoryId', header: 'product.labels.category',filterable: true },
    { field: 'productName', header: 'product.labels.name',filterable: true  },
    { field: 'customerPrice', header: 'product.labels.customerPrice' ,filterable: true },
    { field: 'customerDiscount', header: 'product.labels.customerDiscount',filterable: true },
    { field: 'priceAfterCustomerDiscount', header: 'product.labels.priceAfterCustomerDiscount',filterable: true  },
    { field: 'traderPrice', header: 'product.labels.traderPrice',filterable: true  },
    { field: 'traderDiscount', header: 'product.labels.traderDiscount',filterable: true  },
    { field: 'priceAfterTraderDiscount', header: 'product.labels.priceAfterTraderDiscount',filterable: true  },
    { field: 'quantity', header: 'product.labels.quantity',filterable: true  },
    { field: 'description', header: 'product.labels.description',filterable: true  },
    { field: 'images', header: 'product.labels.product-Image',filterable: true  },
  ];

  globalFilterFields:string[]= ['nameAr']
  confirmDeleteDialog!:boolean
  totalLength:number=0;
  title :string = 'product.all'
  name:any='';
  constructor(private _productService:ProductService,
    private alertService:ToastrService,
    private base:BaseService,
    private categorySerive:CategoryService,
     private _AuthService:AuthService,
  private NavigateRoute:Router){}
  products:any[]=[]
  product ={} as Product 
  categories:any[]=[]
    pageNumber:number = 1;
    pageSize:number = 10;


  getProducts()
  {
    this.base.getAllTest('Product',this.name,this.pageNumber,this.pageSize).subscribe({
      next:(Response) => {
        this.products = Response.items
        this.totalLength = Response.totalCount
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
  this.getProducts();
  this.loadPermissions();
   


}


editItem(ev:any)
{
  this.NavigateRoute.navigate(['/product/update',ev.id])
}
viewItemDetails(ev:any)
{
  this.NavigateRoute.navigate(['/product/details',ev.id])
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
      if(Response === 'Product deleted successfully')
      {
        this.alertService.success('Product Deleted Successfully');
        this.getProducts();
      }
     }, error :(err) =>{
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
    const _pageNumber = event.first! / event.rows! + 1;
    const _pageSize = event.rows;
    this.pageNumber = _pageNumber;
    this.pageSize   =   _pageSize

    this.getProducts()
  }


  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  
  // get all permissions by user
  loadPermissions() {
    const storedPermissions = localStorage.getItem('userPermissions');

    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
      this.permissionsLoaded = true;
    } else {
      this._AuthService.permissions$.subscribe((permissions) => {
        this.permissions = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }



}
