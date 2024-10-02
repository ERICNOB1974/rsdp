import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeleccionMapaComponent } from './seleccion-mapa/seleccion-mapa.component';
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'seleccionMapa', component: SeleccionMapaComponent}
];
