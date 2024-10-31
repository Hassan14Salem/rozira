import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/category/Models/category';
import { CategoryService } from 'src/app/category/Services/category.service';
import { Product } from '../../Models/product';
import { ProductService } from '../../Services/product.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  // @ViewChild('updateProduct') updateForm!:NgForm
  updateProduct!:FormGroup
   formData = new FormData();
   imageUrl:string=''
   viewImageDialog:boolean=false;
  product = {} as Product
  ProductId !:string
  selectedFile: any;
  categories:Category[]=[]
  uploadedFiles:any[]=[];
  imageToDelete:any[]=[];
  isImageValidation:boolean=false;
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
          categoryId: this.product.category.nameEn
        })

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
  })
      
   

      this.productSerive.update(this.formData).subscribe({
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


  }

  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      this.updateProduct.markAsDirty();  
    }
  }


  onUpload(event:any) {
    this.isImageValidation = false;
    const btn_save = document.querySelector('.btn-save') as HTMLButtonElement;
          btn_save.disabled = false;
    const NewImages = this.updateProduct.get('NewImages') as FormArray ;
   
    for(let file of event.files) {
      // NewImages.push(new FormControl(file));
        // this.uploadedFiles.push(file);
        this.formData.append('NewImages',file)
    }
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

        this.checkImageValidation()
    }


    checkImageValidation()
    {

      if( this.product.images.length === 0 )
        {
          this.isImageValidation =true ;
          // this.isValid = true;
         const btn_save = document.querySelector('.btn-save') as HTMLButtonElement;
          btn_save.disabled = true;
        } 
        else
        {

        this.updateProduct.markAsDirty()
        }
   

    }


    viewImage(item:string)
    {
      this.viewImageDialog = true
      this.imageUrl = item;
    }

    hideDialog()
    {
      this.viewImageDialog = false
    }








//carousel
customOptions: OwlOptions = {
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: true,
  navSpeed: 100,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    940: {
      items: 4
    }
  },
  nav: false,
  autoplay:true,
  autoplaySpeed:500,
  rtl:true
}


}
