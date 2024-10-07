import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeleccionMapaComponent } from './seleccion-mapa/seleccion-mapa.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoDetailComponent } from './eventos/eventos-detail.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { CrearEventoComponent } from './eventos/crearEvento.component';
import { ComunidadDetailComponent } from './comunidades/comunidades-detail.component';
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'seleccionMapa', component: SeleccionMapaComponent},
    {path: 'eventos', component: EventosComponent},
    {path: 'eventos/crearEvento', component: CrearEventoComponent }, //si o si tiene que estar antes del de /:id, sino no anda
    {path: 'eventos/:id', component: EventoDetailComponent },
    {path: 'comunidades', component: ComunidadesComponent },
    {path: 'comunidades/:id', component: ComunidadDetailComponent }
];
