import { Routes } from '@angular/router';
import {RegistroComponent} from './registro/registro.component'
import {InicioComponent} from './inicio/inicio.component'
export const routes: Routes = [
    {path: 'registro', component: RegistroComponent},
    {path: 'inicio', component: InicioComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}];
