import { Routes } from '@angular/router';
import {RegistroComponent} from './registro/registro.component'
import {InicioComponent} from './inicio/inicio.component'
import {CrearProyectoComponent} from './crear-proyecto/crear-proyecto.component'
import {EditarProyectoComponent} from './editar-proyecto/editar-proyecto.component'
import {EditarUsuarioComponent} from './editar-usuario/editar-usuario.component'
import {PantallaPrincipalComponent} from './pantalla-principal/pantalla-principal.component'

export const routes: Routes = [
    {path: 'registro', component: RegistroComponent},
    {path: 'crear-proyecto', component: CrearProyectoComponent},
    {path: 'editar-proyecto', component: EditarProyectoComponent},
    {path: 'editar-usuario', component: EditarUsuarioComponent},
    {path: 'pantalla-principal', component: PantallaPrincipalComponent},
    {path: 'inicio', component: InicioComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}];
