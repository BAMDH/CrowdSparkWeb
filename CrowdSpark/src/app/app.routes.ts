import { Routes } from '@angular/router';
import {RegistroComponent} from './registro/registro.component'
import {InicioComponent} from './inicio/inicio.component'
import {CrearProyectoComponent} from './crear-proyecto/crear-proyecto.component'
import {EditarProyectoComponent} from './editar-proyecto/editar-proyecto.component'
import {EditarUsuarioComponent} from './editar-usuario/editar-usuario.component'
import {PantallaPrincipalComponent} from './pantalla-principal/pantalla-principal.component'
import {HistorialComponent} from './historial/historial.component'
import {RealizarDonacionComponent} from './realizar-donacion/realizar-donacion.component'
import {VerProyectoComponent} from './ver-proyecto/ver-proyecto.component'
import { MainAdminComponent } from './main-admin/main-admin.component';
import { DetalleProyectoComponent } from './detalle-proyecto/detalle-proyecto.component';
import { DonacionesAdminComponent } from './donaciones-admin/donaciones-admin.component';
import { UsuariosAdminComponent } from './usuarios-admin/usuarios-admin.component';
import { StatsAdminComponent } from './stats-admin/stats-admin.component';
import { EventsAdminComponent } from './events-admin/events-admin.component';
import { PaginaMentorComponent } from './pagina-mentor/pagina-mentor.component';
import { AgendarSesionComponent } from './agendar-sesion/agendar-sesion.component';
import { ProyectosPendientesComponent } from './proyectos-pendientes/proyectos-pendientes.component';
import { SolicitudesMentoriaComponent } from './solicitudes-mentoria/solicitudes-mentoria.component';
import { ValidarProyectoComponent } from './validar-proyecto/validar-proyecto.component';
import { SesionesPendientesComponent } from './sesiones-pendientes/sesiones-pendientes.component';
import { PagarSesionComponent } from './pagar-sesion/pagar-sesion.component';
import { VerEventoComponent } from './ver-evento/ver-evento.component';
export const routes: Routes = [
    {path: 'registro', component: RegistroComponent},
    {path: 'crear-proyecto', component: CrearProyectoComponent},
    {path: 'editar-proyecto', component: EditarProyectoComponent},
    {path: 'editar-usuario', component: EditarUsuarioComponent},
    {path: 'pantalla-principal', component: PantallaPrincipalComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'historial', component: HistorialComponent},
    {path: 'realizar-donacion/:nombre', component: RealizarDonacionComponent},
    {path: 'ver-proyecto/:nombre', component: VerProyectoComponent },
    {path: 'main-admin', component: MainAdminComponent },
    {path: 'detalle-proyecto/:nombre', component: DetalleProyectoComponent },
    {path: 'donaciones-admin', component: DonacionesAdminComponent },
    {path: 'usuarios-admin', component: UsuariosAdminComponent },
    {path: 'stats-admin', component: StatsAdminComponent },
    {path: 'events-admin', component: EventsAdminComponent },
    {path: 'pagina-mentor', component: PaginaMentorComponent },
    {path: 'agendar-sesion', component: AgendarSesionComponent },
    {path: 'proyectos-pendientes', component: ProyectosPendientesComponent },
    {path: 'solicitudes-mentoria', component: SolicitudesMentoriaComponent },
    {path: 'validar-proyecto/:nombre', component: ValidarProyectoComponent },
    {path: 'sesiones-pendientes', component: SesionesPendientesComponent },
    {path: 'pagar-sesion/:nombre', component: PagarSesionComponent },
    {path: 'ver-evento', component: VerEventoComponent },
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}
];