import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../Models/product';
import { ProductService } from '../../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UploadEvent } from 'primeng/fileupload'; // Import UploadEvent
import { Category } from 'src/app/category/Models/category';
import { CategoryService } from 'src/app/category/Services/category.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  @ViewChild('updateProduct') updateForm!: NgForm
  addForm!: FormGroup;
  product = {} as Product
  selectedFile!: any[];
  uploadedFiles: any[] = [];
  categories: Category[] = []
  discountsPattern: any = "^(100|[0-9]{1,2})(\\.[0-9]{1,2})?$"

  constructor(private productSerive: ProductService,
    private route: ActivatedRoute,
    private alertService: ToastrService,
    private navigateRoute: Router,
    private category: CategoryService,
    private _AuthService :AuthService
  ) {
    this.addForm = new FormGroup({
      ProductName: new FormControl('', Validators.required),
      Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
      customerPrice: new FormControl(0, Validators.required),
      traderPrice: new FormControl(0, Validators.required),
      customerDiscount: new FormControl(null, Validators.pattern(this.discountsPattern)),
      traderDiscount: new FormControl(null, Validators.pattern(this.discountsPattern)),
      quantity: new FormControl(0, Validators.required),
      images: new FormArray([]),
      categoryId: new FormControl('', Validators.required)
    })
  }


  permissionsLoaded = false;
  permissions: string[] = [];
  
  hasPermission(permission: any): boolean {
    return this.permissions.includes(permission);

  }
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




  saveItem(addForm: FormGroup) {
    if (addForm.valid) {

      const formData = new FormData();
      // Iterate over form controls and append them to FormData
      Object.keys(addForm.controls).forEach(key => {
        const value = addForm.controls[key].value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });


      if (this.uploadedFiles) {
        for (let i = 0; i < this.uploadedFiles.length; i++) {
          formData.append('images', this.uploadedFiles[i])
        }
        addForm.value.images.push(this.uploadedFiles)
      }

      this.productSerive.add(formData).subscribe({
        next: (Response) => {
          if (Response === 'Product added successfully')
            this.alertService.success(Response);
          this.navigateRoute.navigate(['/product/products'])
        },
        error: (err) => {
          this.alertService.error('Faild to add product')
        }
      })

    }
  }
  ngOnInit(): void {
    this.getCateories();
    this.loadPermissions();

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


  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles)
    this.addForm.markAsDirty();

  }
  get imagesArray(): FormArray {
    return this.addForm.get('images') as FormArray;
  }

  // onUpload(event: any): void {
  //   for (let file of event.files) {
  //     this.imagesArray.push(new FormControl(file)); // Add each file to the FormArray
  //   }
  //   this.addForm.markAsDirty();  // Mark the form as dirty after adding files
  // }




  getCateories() {
    this.category.gets().subscribe({
      next: (Res) => {
        this.categories = Res.items
      }
    })
  }
}
