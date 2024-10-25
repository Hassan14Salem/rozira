import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../Models/product';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/category/Services/category.service';
import { Category } from 'src/app/category/Models/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{
  
  // @ViewChild('updateProduct') updateForm!:NgForm
  updateProduct!:FormGroup
   formData = new FormData();

  product = {} as Product
  ProductId !:string
  selectedFile: any;
  categories:Category[]=[]
  uploadedFiles:any[]=[];
  imageToDelete:any[]=[];
  isValid:boolean=false;
  selectedCategory: any;
  discountsPattern:any="^(100|[0-9]{1,2})(\.[0-9]{1,2})?$";

  constructor(private productSerive:ProductService,
    private route:ActivatedRoute,
    private alertService:ToastrService,
    private navigateRoute : Router,
    private category:CategoryService,

  ){
    this.updateProduct = new FormGroup({
      ProductName: new FormControl('',Validators.required),
      Description: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(2000)]),
      customerPrice: new FormControl(0,Validators.required),
      traderPrice: new FormControl(0,Validators.required),
      customerDiscount: new FormControl(0,Validators.pattern(this.discountsPattern)),
      traderDiscount: new FormControl(0,Validators.pattern(this.discountsPattern)),
      quantity: new FormControl(0,Validators.required),
      NewImages: new FormArray([]),

      categoryId: new FormControl('',Validators.required),

    })
  }

  loadProduct()
  {
    this.productSerive.get(this.ProductId).subscribe({
      next:(Response) => 
      {
        this.product = Response;
        this.updateProduct.patchValue({
          ProductName: this.product.productName,
          Description: this.product.description,
          customerPrice: this.product.customerPrice,
          traderPrice: this.product.traderPrice,
          customerDiscount: this.product.customerDiscount,
          traderDiscount: this.product.traderDiscount,
          quantity: this.product.quantity,
          images: this.product.images,
          categoryId: this.product.category.id
        })

        console.log('this.product',this.product)
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
  }

  saveItem(editForm:FormGroup)
  {

    if(editForm.valid)
    {
      // Append coach ID to FormData
      this.formData.append('id', this.ProductId.toString());
      // Iterate over form controls and append them to FormData
      Object.keys(editForm.controls).forEach(key => {
        const value = editForm.controls[key].value;
        if (value !== null && value !== undefined) {
          this.formData.append(key, value);
        }
      });



  //  if(this.uploadedFiles)
  //  {
  //   for(let i =0 ; i<this.uploadedFiles.length ; i++){
  //     formData.append('NewImages',this.uploadedFiles[i])

  //   }

  //  }

  


   
  this.formData.forEach((key,value)=>{
    console.log(`value:${value} =>  key:${key}`)
  })
      
   

      this.productSerive.update(this.formData).subscribe({
        next : (Response) => 
        {
          if(Response === 'Product updated successfully')
            this.alertService.success(Response);
          this.navigateRoute.navigate(['/product/products'])
        },
        error : (err)=>{
          console.log(err)
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
      this.updateProduct.markAsDirty();  
    }
  }


  onUpload(event:any) {
    const NewImages = this.updateProduct.get('NewImages') as FormArray ;
   
    for(let file of event.files) {
      // NewImages.push(new FormControl(file));
        // this.uploadedFiles.push(file);
        this.formData.append('NewImages',file)
    }
    console.log('NewImages', NewImages.value)
    this.updateProduct.markAsDirty();  

    }


    DeleteImages(image:any){
      const index = this.product.images.indexOf(image);
  
      // If the image exists in the array, remove it
      if (index > -1) {
        this.product.images.splice(index, 1);
      }
      // if (!imagesToDelete.controls.some(ctrl => ctrl.value === image)) {
      //   imagesToDelete.push(new FormControl(image));
      //   // this.formData.append('ImagesToDelete',image)
      // }
      
        this.formData.append('ImagesToDelete',image)
        this.imageToDelete.push(image)
        console.log('imageToDelete',this.imageToDelete.length)
        console.log('product.images',this.product.images.length)

        this.updateProduct.markAsDirty();  

    }


    checkImageValidation()
    {

      if(this.imageToDelete.length === this.product.images.length )
        {
          alert('atleast one image required')
          // this.isValid = true;
          this.updateProduct.invalid ;
          this.updateProduct.markAsDirty();  

        } 
        else
        {
          this.isValid = true;

        this.updateProduct.markAsDirty()
        }
   

    }
}
