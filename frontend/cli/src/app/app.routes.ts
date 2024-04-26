import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { EmpresasComponent } from './empresa/empresas.component';
import { EmpresasDetailComponent } from './empresa/empresas-detail.component';
import { ProyectosComponent } from './proyecto/proyectos.component';
import { ProyectosDetailComponent } from './proyecto/proyectos-detail.component';
import { TareasComponent } from './tarea/tareas.component';
import { TareasDetailComponent } from './tarea/tareas-detail.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'empresas', component: EmpresasComponent},
    {path: 'empresas/:id', component: EmpresasDetailComponent},
    {path: 'proyectos', component: ProyectosComponent},
    {path: 'proyectos/:id', component: ProyectosDetailComponent},
    {path: 'tareas', component: TareasComponent},
    {path: 'tareas/:id', component: TareasDetailComponent}
];
