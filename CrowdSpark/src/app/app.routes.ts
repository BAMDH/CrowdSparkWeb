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
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}];