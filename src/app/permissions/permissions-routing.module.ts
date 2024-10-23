import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './pages/permission/permission.component';
import { TestComponent } from './pages/test/test.component';

const routes: Routes = [
  {path:'all',component:PermissionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
