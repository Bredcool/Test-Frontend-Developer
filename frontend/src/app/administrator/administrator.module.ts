import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './employees/list/list.component';
import { AddComponent } from './employees/add/add.component';
import { DetailComponent } from './employees/detail/detail.component';
import { AdministratorRoutingModule } from './administrator-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    AddComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdministratorRoutingModule
  ]
})
export class AdministratorModule {}
