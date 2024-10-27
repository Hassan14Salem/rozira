import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SliderService } from '../../Services/slider.service';
import { Slider } from '../../Models/slider';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-all-sliders',
  templateUrl: './all-sliders.component.html',
  styleUrls: ['./all-sliders.component.css']
})
export class AllSlidersComponent implements OnInit {
  Items:any[]=[];
  Item = {} as Slider;
  permissionsLoaded = false;
  permissions: string[] = [];
  itemDialog!:boolean;
  confirmDeleteDialog!:boolean
  submitted!:boolean
  selectedFile:any;
  addSlider!:FormGroup
  title:string ='slider.title'
  pageNumber:number = 1;
  pageSize:number   =  10;
  totalRecords: number = 0;

constructor(private sliderService:SliderService,private alertService:ToastrService,
  private _AuthService :AuthService,
  private base:BaseService
){
  this.addSlider = new FormGroup({
    Image: new FormControl(null,Validators.required),
    DisplayOrder: new FormControl(null)

  })
}

pageColumns = [
  { field: 'imageUrl', header: 'tableHeader.image',filterable: true  },
  { field: 'displayOrder', header: 'tableHeader.displayOrder' ,filterable: true },


];
getItems()
{
  this.sliderService.getSliders('sliders',this.pageNumber,this.pageSize).subscribe({
    next:(Response : any) =>{
    this.Items = Response?.items
    this.totalRecords = Response.totalCount
    }
  })
}

loadItems(event:any)
  {
    console.log('category table event',event)
    const _pageNumber = event.first! / event.rows! + 1;
    const _pageSize = event.rows;
    this.pageNumber = _pageNumber;
    this.pageSize   =   _pageSize
    console.log('ev from sliders',event)
    console.log('pageNumber',this.pageNumber ,'size', this.pageSize)
    this.getItems()


    console.log(this.Items)
  }



  
 



 
  ngOnInit(): void {
    this.getItems();
    this.loadPermissions();
  }
  save(ev:any){
    console.log('ev',ev)
    this.itemDialog=true
    const formData = new FormData();
    if(ev.id)
    {
      formData.append('Id',ev.id)

      if (this.selectedFile) {
        formData.append('Image',  this.selectedFile);
        console.log('Appending image:',  this.selectedFile);
      } else
      {
        formData.append('Image',  ev.imageUrl);

      }
      formData.append('DisplayOrder',ev.displayOrder)

        formData.forEach((value,key)=>{
          console.log('item to update',`${key}:${value}`)
        })
      this.sliderService.update(formData).subscribe({
        next:(res) =>{
          if(res === 'Slider updated successfully')
          {
            console.log(res)
            this.getItems();
            this.alertService.success(res);
          }
        
        },
        error:(err)=>{
          console.log(err)
          this.alertService.error('faild to update slider')
        }
      })
    } else
    {
      const formData = new FormData();
  // Append the selected image if available
  if (this.selectedFile) {
    formData.append('Image',  this.selectedFile);
    console.log('Appending image:',  this.selectedFile);
  }
  formData.append('DisplayOrder',ev.displayOrder)

  // Log the FormData contents for debugging
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  // Send the FormData to the server
  this.sliderService.add(formData).subscribe({
    next: (Res) => {
      if(Res === 'Slider created successfully'){
        this.alertService.success(Res)
        console.log(Res);
        this.getItems();
      }
      
    },
    error: (err) => {
      console.error('Error uploading:', err);
      this.alertService.error('faild to add slider')
    }
  });
    }

    this.hideDialog();
  }
  hideDialog(){
    this.itemDialog=false
    this.confirmDeleteDialog = false;
  }
  openNew(){
    this.itemDialog=true
    this.Item={} as Slider;
  }
  openDeleteDialog(ev:any)
  {
    this.Item = {...ev}
    this.confirmDeleteDialog = true;

  }
  deleteItem(ev:any){
    this.delete(ev.id) 
  }
  deleteDialogMessage(ev:any){}
  editItem(ev:any){
    this.Item = {...ev}
    this.itemDialog = true;
  }



  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
    
  }


  delete(id:string)
  {
    this.sliderService.deleteSlider(id).subscribe({
      next :(Res) =>{
        console.log(Res)
        if(Res === 'Slider removed successfully')
        {
          this.alertService.success(Res) 
          this.getItems()
        }
      }, error:(err)=>{
        this.alertService.error('faild to remove slider')
      }
    })

    this.hideDialog();
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
