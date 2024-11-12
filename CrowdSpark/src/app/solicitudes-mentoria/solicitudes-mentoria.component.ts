import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-solicitudes-mentoria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './solicitudes-mentoria.component.html',
  styleUrl: './solicitudes-mentoria.component.css'
})
export class SolicitudesMentoriaComponent {
  correoUsuario: string | null = null;
  projects: any[] = [];  // Variable para almacenar las donaciones

  constructor(
    private usuarioService: UsuarioService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {this.correoUsuario = this.usuarioService.getCorreoUsuario()}

  ngOnInit() {
    this.cargarProyectos();
  }

  // Método para cargar las donaciones desde Firebase
  cargarProyectos() {
    this.firestoreService.getProyectosByMentorPendientes(this.correoUsuario).subscribe((data: any[]) => {

      this.projects = data;
      
      console.log(this.projects);  // Imprimir las donaciones filtradas en consola
    }, (error) => {
      console.error("Error al cargar las donaciones:", error);
    });
  }
  
  cambiarPantalla() {
    this.router.navigate(['/pagina-mentor']);
  }

  rechazarSolicitud(project: any) {
    this.firestoreService.denyMentorship(project).subscribe(() => {
      console.log("Solicitud rechazada");
      alert("Solicitud rechazada");
      this.cargarProyectos();
    })
  }

  aprobarSolicitud(project: any) {
    this.firestoreService.approveMentorship(project).subscribe(() => {
      console.log("Solicitud aprobada");
      alert("Solicitud aprobada");
      this.cargarProyectos();
    })
  }
}
