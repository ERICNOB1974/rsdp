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
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './autenticacion/auth.guard';
import { RegistroComponent } from './registro/registro.component';
import { VerificarCodigoComponent } from './verificar-codigo/verificar-codigo.component';
import { VerificarMailComponent } from './recuperar-contrasena/verificar-mail.component';
import { CambiarContrasenaComponent } from './recuperar-contrasena/cambiar-contrasena.component';
import { AmigosComponent } from './amigos/amigos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilDetailComponent } from './perfil/perfil-detail.component';
import { CrearPublicacionComponent } from './publicaciones/crearPublicacion.component';
import { PublicacionDetailComponent } from './publicaciones/publicacion-detail.component';
import { ComunidadCreadorComponent } from './comunidades/comunidadCreador.component';
import { EditarComunidadComponent } from './comunidades/editarComunidad.component';
import { RutinasEjercicioComponent } from './rutinas/rutinasEjercicio.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { CrearRutinaComponent } from './rutinas/crearRutina.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'seleccionMapa', component: SeleccionMapaComponent, canActivate: [AuthGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'eventos/crearEvento', component: CrearEventoComponent, canActivate: [AuthGuard] },
  { path: 'eventos/:id', component: EventoDetailComponent, canActivate: [AuthGuard] },
  { path: 'comunidades', component: ComunidadesComponent, canActivate: [AuthGuard] },
  { path: 'comunidades/crearComunidad', component: CrearComunidadComponent, canActivate: [AuthGuard] },
  { path: 'comunidades/:id', component: ComunidadDetailComponent, canActivate: [AuthGuard] },
  { path: 'creadorComunidad/:id', component: ComunidadCreadorComponent,  canActivate: [AuthGuard] },
  { path: 'editarComunidad/:id', component: EditarComunidadComponent,  canActivate: [AuthGuard] },
  { path: 'sugerencias/amigos', component: SugerenciasAmigosComponent, canActivate: [AuthGuard] },
  { path: 'sugerencias/eventos', component: SugerenciasEventosComponent, canActivate: [AuthGuard] },
  { path: 'sugerencias/comunidades', component: SugerenciasComunidadesComponent, canActivate: [AuthGuard] },
  { path: 'publicacion', component: CrearPublicacionComponent, canActivate: [AuthGuard] },  
  { path: 'publicacion/:id', component: PublicacionDetailComponent, canActivate: [AuthGuard] },
  { path: 'amigos', component: AmigosComponent, canActivate: [AuthGuard] },
  { path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'perfilEditable/:id', component: PerfilDetailComponent, canActivate: [AuthGuard] },
  { path: 'rutinas', component: RutinasComponent,  canActivate: [AuthGuard] },
  { path: 'rutinas/crearRutina', component: CrearRutinaComponent, canActivate: [AuthGuard]},
  { path: 'rutinasHacer/:id', component: RutinasEjercicioComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }, 
  { path: 'registro', component: RegistroComponent },
  { path: 'verificar-codigo', component: VerificarCodigoComponent },
  { path: 'verificar-mail', component: VerificarMailComponent },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent }
  //,{ path: '**', redirectTo: 'login' }
];
