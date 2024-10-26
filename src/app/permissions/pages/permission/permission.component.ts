import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from 'src/app/Services/roles.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Permission } from '../../Models/permission';
import { PermissionService } from 'src/app/Services/permission.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class PermissionComponent implements OnInit{
  permissions: Permission[] = [];
  roles: any[] = [];
  selectedRole: any;
  selectedIdToDelete: any;
  permissionsByCategory: { [key: string]: Permission[] } = {};
  createRoleForm = new FormGroup({
    role: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
  });


  constructor(private _permissionService: PermissionService, 
    private _Role: RolesService, 
    private messageService: MessageService ,
  private _AuthService :AuthService) { }


  ngOnInit(): void {

    this.loadRoles();
    this.loadPermissionss();

  }

  loadPermissions() {
    this._permissionService.getAllPermissions().subscribe({
      next: (response: any) => {
        this.permissionsByCategory = response;
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error fetching permissions', error);
      },
    });

  };

  permissionsLoaded = false;
  permissionss: string[] = [];
  
  hasPermission(permission: any): boolean {
    return this.permissions.includes(permission);

  }
  loadPermissionss() {
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
      this.permissionsLoaded = true;
    } else {
      this._AuthService.permissions$.subscribe((permissions) => {
        this.permissionss = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }


  loadRoles() {
    this._Role.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (myError) => {
        console.error('Error fetching roles', myError);
      },
    });
  }

  onSelectRole(role: any) {
    this.selectedRole = role;
    this.clearPermissions();
    console.log(role);
    this.selectedIdToDelete = role.id;
    this._Role.getPermissionsByRole(role.id).subscribe({
      next: (Response: { [category: string]: string[] }) => {
        console.log('The response of on select the role', Response);

        this.setPermissionsForSelectedRole(Response);
      },
      error: (myError) => {
        console.log('The Error is in role selection', myError);
      }
    });

  }
  setPermissionsForSelectedRole(rolePermissions: { [category: string]: string[] }) {
    // Iterate through each category in permissionsByCategory
    for (let category in this.permissionsByCategory) {
      // Check if the category exists in the rolePermissions
      const roleCategoryPermissions = rolePermissions[category] || [];

      this.permissionsByCategory[category].forEach(permission => {
        // Set isGranted to true if the permission exists in the current category's permissions array
        permission.isGranted = roleCategoryPermissions.includes(permission.name);
      });
    }
  }

  savePermissions() {
    const updatedPermissionsIDs: string[] = [];

    for (let category in this.permissionsByCategory) {
      this.permissionsByCategory[category].forEach(permission => {
        if (permission.isGranted) {
          updatedPermissionsIDs.push(permission.id);
        }
      });
    }
    console.log(updatedPermissionsIDs);

    this._Role.updatePermissions(this.selectedRole.id, updatedPermissionsIDs).subscribe({
      next: (response) => {
        this.showUpdatedMessage();
        console.log('Permissions updated successfully:', response);
      },
      error: (myError) => {

        console.error('Error updating permissions:', myError);
      }
    });
  }
  createNewRole(data: FormGroup) {
    const roleName = data.value.role; // Extract role name
    console.log(roleName);

    this._Role.createRoles(roleName).subscribe({
      next: (response) => {
        console.log('Role created successfully:', response);
        this.showSucssesMessage();
        this.loadRoles();
      },
      error: (myError) => {
        console.error('Error creating role:', myError.message);
      },
    });
  }

  clearPermissions() {
    // Clear the isGranted property for all permissions
    for (let category in this.permissionsByCategory) {
      this.permissionsByCategory[category].forEach(permission => {
        permission.isGranted = false; // Reset all permissions to false
      });
    }
  }

  deletePermission() {

    this._Role.deletePermission(this.selectedIdToDelete).subscribe({
      next: (response) => {
        console.log('deleted', response);
        this.showDeletedMessage();
        this.loadRoles();
        this.clearPermissions();
      },
      error: (myError) => {
        console.log('Not deleted', myError)
      },

    });
  }

  showSucssesMessage() {
    this.messageService.add({ severity: 'success', summary: 'Role', detail: 'Added Successfully' });
  }
  showUpdatedMessage() {
    this.messageService.add({ severity: 'warn', summary: 'Role', detail: 'Updated Successfully' });
  }

  showDeletedMessage() {
    this.messageService.add({ severity: 'error', summary: 'Role', detail: 'Deleted Successfully' });
  }

}
