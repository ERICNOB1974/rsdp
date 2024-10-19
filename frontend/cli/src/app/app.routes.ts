import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeleccionMapaComponent } from './seleccion-mapa/seleccion-mapa.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoDetailComponent } from './eventos/eventos-detail.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { CrearEventoComponent } from './eventos/crearEvento.component';
import { CrearComunidadComponent } from './comunidades/crearComunidad.component';
import { SugerenciasAmigosComponent } from './sugerencias/sugerenciasAmigos.component';
import { SugerenciasEventosComponent } from './sugerencias/sugerenciasEventos.component';
import { SugerenciasComunidadesComponent } from './sugerencias/sugerenciasComunidades.component';
import { ComunidadDetailComponent } from './comunidades/comunidades-detail.component';
import { AmigosComponent } from './amigos/amigos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilDetailComponent } from './perfil/perfil-detail.component';
import { CrearPublicacionComponent } from './publicaciones/crearPublicacion.component';
import { PublicacionDetailComponent } from './publicaciones/publicacion-detail.component';
import { ComunidadCreadorComponent } from './comunidades/comunidadCreador.component';
import { EditarComunidadComponent } from './comunidades/editarComunidad.component';
import { RutinasComponent } from './rutinas/rutinas.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'seleccionMapa', component: SeleccionMapaComponent },
    { path: 'eventos', component: EventosComponent },
    { path: 'eventos/crearEvento', component: CrearEventoComponent }, //si o si tiene que estar antes del de /:id, sino no anda
    { path: 'eventos/:id', component: EventoDetailComponent },
    { path: 'comunidades', component: ComunidadesComponent },
    { path: 'comunidades/crearComunidad', component: CrearComunidadComponent },
    { path: 'comunidades/:id', component: ComunidadDetailComponent },
    { path: 'editarComunidad/:id', component: EditarComunidadComponent },
    { path: 'creadorComunidad/:id', component: ComunidadCreadorComponent },
    { path: 'amigos', component: AmigosComponent },
    { path: 'perfil/:id', component: PerfilComponent },
    { path: 'perfilEditable/:id', component: PerfilDetailComponent },
    { path: 'sugerencias/amigos', component: SugerenciasAmigosComponent },
    { path: 'sugerencias/eventos', component: SugerenciasEventosComponent },
    { path: 'sugerencias/comunidades', component: SugerenciasComunidadesComponent },
    { path: 'publicacion', component: CrearPublicacionComponent },  
    { path: 'publicacion/:id', component: PublicacionDetailComponent },
    { path: 'rutinasHacer/:id', component: RutinasComponent }

    
];
