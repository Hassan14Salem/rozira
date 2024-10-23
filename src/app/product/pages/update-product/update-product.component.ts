import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../Models/product';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/category/Services/category.service';
import { Category } from 'src/app/category/Models/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{
  
  @ViewChild('updateProduct') updateForm!:NgForm
  product = {} as Product
  ProductId !:string
  selectedFile: any;
  categories:Category[]=[]
  uploadedFiles:any[]=[];
  selectedCategory: any;

  constructor(private productSerive:ProductService,
    private route:ActivatedRoute,
    private alertService:ToastrService,
    private navigateRoute : Router,
    private category:CategoryService

  ){}

  loadProduct()
  {
    this.productSerive.get(this.ProductId).subscribe({
      next:(Response) => 
      {
        this.product = Response;
        console.log('product',this.product)
        console.log('Response',Response[0])
       this. getCateories()

      }
    })
  }

  getCateories()
  {
    this.category.gets().subscribe({
      next:(Res)=>{
        this.categories = Res.items
      }
    })
  }

  getCategoryValue(ev:any){
    this.selectedCategory = ev.target.value;
    console.log('category value',ev.target.value)
  }

  saveItem(editForm:NgForm)
  {
    console.log('update',editForm.value)
    console.log(editForm.valid)
    if(editForm.valid)
    {
      const formData = new FormData();
      // Append coach ID to FormData
      formData.append('id', this.ProductId.toString());
      // Iterate over form controls and append them to FormData
      Object.keys(editForm.controls).forEach(key => {
        const value = editForm.controls[key].value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append('CategoryId',this.selectedCategory)

      formData.forEach((key,value)=>{
        console.log(`key:${key} =>  value:${value}`)
      })

   if(this.uploadedFiles)
   {
    for(let i =0 ; i<this.uploadedFiles.length ; i ++){
      formData.append('NewImages',this.uploadedFiles[i])
    }
   }
      
   


      this.productSerive.update(formData).subscribe({
        next : (Response) => 
        {
          if(Response === 'Product updated successfully')
            this.alertService.success(Response);
          this.navigateRoute.navigate(['/product/products'])
        },
        error : (err)=>{
          this.alertService.error('Faild to add product')
        }
      })
      
    }
  }
  ngOnInit(): void {
     const id = this.route.snapshot.paramMap.get('id') 
     this.ProductId = id ? id : ''
     this.loadProduct()


     console.log(this.ProductId)
  }

  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      console.log(this.selectedFile);
      this.updateForm.form.markAsDirty();  
    }
  }



  onUpload(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles)
    this.updateForm.form.markAsDirty();  

    }
}
