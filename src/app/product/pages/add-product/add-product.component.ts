import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../Models/product';
import { ProductService } from '../../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UploadEvent } from 'primeng/fileupload'; // Import UploadEvent

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{

  @ViewChild('updateProduct') updateForm!:NgForm
  addForm!:FormGroup;
  product = {} as Product
  selectedFile!: any[];
  uploadedFiles:any[] =[];

  constructor(private productSerive:ProductService,
    private route:ActivatedRoute,
    private alertService:ToastrService,
    private navigateRoute : Router

  ){
    this.addForm = new FormGroup({
      ProductName: new FormControl('',Validators.required),
      Description: new FormControl('',Validators.required),
      customerPrice: new FormControl(0,Validators.required),
      traderPrice: new FormControl(0,Validators.required),
      customerDiscount: new FormControl(0,Validators.required),
      traderDiscount: new FormControl(0,Validators.required),
      quantity: new FormControl(0,Validators.required),
      images: new FormArray([],Validators.required),
      categoryId: new FormControl('',Validators.required)
    })
  }

 


  saveItem(addForm:FormGroup)
  {
    if(addForm.valid)
    {
     
      const formData = new FormData();
      // Iterate over form controls and append them to FormData
      Object.keys(addForm.controls).forEach(key => {
        const value = addForm.controls[key].value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });


     if(this.uploadedFiles)
   {
    for(let i =0 ; i<this.uploadedFiles.length ; i ++){
      formData.append('images',this.uploadedFiles[i])
    }
    addForm.value.images.push(this.uploadedFiles)
   }
     
      this.productSerive.add(formData).subscribe({
        next : (Response) => 
        {
          if(Response === 'Product added successfully')
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


  }

  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      console.log(this.selectedFile);
      
      // Mark the form as dirty
      // this.addForm.markAsDirty();
  
      // Set the form control as valid
      this.addForm.get('images')?.setValue(this.selectedFile); // Assuming 'fileControl' is the name of the form control for the file input
      this.addForm.get('images')?.updateValueAndValidity();
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
