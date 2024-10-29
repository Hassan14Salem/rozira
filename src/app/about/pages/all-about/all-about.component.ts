import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/category/Models/category';
import { About } from '../../Models/about';
import { AboutService } from '../../Services/about.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-all-about',
  templateUrl: './all-about.component.html',
  styleUrls: ['./all-about.component.css']
})
export class AllAboutComponent implements OnInit {

  itemDialog: boolean = false;
  submitted: boolean = false;
  //reusable

  pageColumns = [
    { field: 'descriptionAr', header: 'Arabic Name', filterable: true },
    { field: 'descriptionEn', header: 'English Name', filterable: true },

  ];

  globalFilterFields: string[] = ['nameAr']
  confirmDeleteDialog!: boolean
  title: string = 'level.header'
  constructor(private _aboutService: AboutService,
    private alertService: ToastrService,
    private NavigateRoute: Router,
    private _AuthService: AuthService
  ) { }
  Items: About[] = []
  Item = {} as About
  categories: any[] = []


  getItems() {
    this._aboutService.gets().subscribe({
      next: (Response) => {
        this.Item = Response
      }
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

  ngOnInit(): void {
    this.getItems();
    this.loadPermissions();
  }


  editItem(ev: any) {
    this.Item = { ...ev }
    this.itemDialog = true
  }

  deleteDialogMessage(_item: About) {
    this.Item = { ..._item }
    this.confirmDeleteDialog = true;
  }

  deleteItem(ev: any) {
    this._aboutService.delete(ev.id).subscribe({
      next: (Response) => {
        if (Response.status === 200) {
          this.alertService.success('Product Deleted Successfully');
          this.getItems();
        }
      }, error: (err) => {
        this.alertService.error(err.error.error.message)
      }
    })

    this.hideDialog()

  }


  hideDialog() {
    this.confirmDeleteDialog = false;
    this.itemDialog = false;

  }

  openNew() {
    this.Item = {} as About;
    this.itemDialog = true
  }

  save(ev: About) {
    this.submitted = true;
    // update
    this._aboutService.add(ev).subscribe({
      next: (Response) => {
        this.alertService.success('Updated Successfully')
        this.getItems();
        this.hideDialog();


      },
      error: (err) => {
        this.alertService.error('Failded to Updated ')
      }
    })

  }
}
