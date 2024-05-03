import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { EmpresasComponent } from './empresa/empresas.component';
import { EmpresasDetailComponent } from './empresa/empresas-detail.component';
import { ProyectosComponent } from './proyecto/proyectos.component';
import { ProyectosDetailComponent } from './proyecto/proyectos-detail.component';
import { PartesMODetailComponent } from './parteMO/parteMO-detail.component';
import { ResumenesComponent } from './parteMO/resumenParteMO.component';
import { OperariosComponent } from './operario/operario.component';
import { OperariosDetailComponent } from './operario/operario-detail.component';
export const routes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'empresas', component: EmpresasComponent},
    {path: 'empresas/:id', component: EmpresasDetailComponent},
    {path: 'proyectos', component: ProyectosComponent},
    {path: 'proyectos/:id', component: ProyectosDetailComponent},
    {path: 'partes/:id', component: PartesMODetailComponent},
    {path: 'operarios', component: OperariosComponent},
    {path: 'operarios/:id', component: OperariosDetailComponent},
    {path: 'resumenes', component: ResumenesComponent}
    
];
