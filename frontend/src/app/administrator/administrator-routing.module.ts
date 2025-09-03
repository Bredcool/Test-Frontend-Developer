import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './employees/list/list.component';
import { AddComponent } from './employees/add/add.component';
import { DetailComponent } from './employees/detail/detail.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent, // wrapper layout/dashboard
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: ListComponent },
            { path: 'employees', component: ListComponent },
            { path: 'employees/add', component: AddComponent },
            { path: 'employees/:id', component: DetailComponent },
            { path: '', redirectTo: 'employees', pathMatch: 'full' },
            { path: 'employees/edit/:id', component: AddComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorRoutingModule { }
