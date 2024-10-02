import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeleccionMapaComponent } from './seleccion-mapa/seleccion-mapa.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoDetailComponent } from './eventos/eventos-detail.component';
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'seleccionMapa', component: SeleccionMapaComponent},
    {path: 'eventos', component: EventosComponent},
    {path: 'eventos/:id', component: EventoDetailComponent }


];
