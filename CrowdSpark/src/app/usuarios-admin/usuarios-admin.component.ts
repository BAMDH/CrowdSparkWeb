import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  title = 'Lista de Usuarios';
  users : any[] = [];

  constructor(private router: Router,
    private firestoreService: FirestoreService,) {}
    ngOnInit(): void {
      this.cargarDatos();
    }
    cargarDatos(){
      this.firestoreService.getCollectionData('Usuarios').subscribe(data => {
        this.users = data;  // Los datos serán asignados aquí
      });
    }
    desactivarActivarUsuario(correo: string, estado: string){
      const newStatus = estado === 'activo' ? 'inactivo' : 'activo';
      this.updateUserStatus(correo, newStatus);  // Llamada al servicio para actualizar el estado
   
    }
    updateUserStatus(correo: string, newStatus: string) {
      this.firestoreService.updateUserStatusByCorreo(correo, newStatus).subscribe(() => {
        console.log('Estado actualizado correctamente');
        this.cargarDatos()
      }, (error) => {
        console.error('Error al actualizar estado:', error);
      });
    }
    updateUserMentorStatus(correo: string, isMentor: boolean) {
      this.firestoreService.updateUserMentorStatusByCorreo(correo, isMentor).subscribe(() => {
        console.log('Rol de Mentor actualizado correctamente');
        this.cargarDatos()
      }, (error) => {
        console.error('Error al actualizar rol de Mentor:', error);
      });
    }
    agregarQuitarMentor(correo: string, isMentor: boolean){
      const newIsMentorStatus = !isMentor; // Cambiar el estado de isMentor
      this.updateUserMentorStatus(correo, newIsMentorStatus);
    }
  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
