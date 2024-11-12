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
  donaciones: any[] = [];  // Variable para almacenar las donaciones

  constructor(
    private usuarioService: UsuarioService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {this.correoUsuario = this.usuarioService.getCorreoUsuario()}

  ngOnInit() {
    this.cargarDonaciones();
  }

  // Método para cargar las donaciones desde Firebase
  cargarDonaciones() {
    this.firestoreService.getCollectionData('Donacion').subscribe((data: any[]) => {
      // Filtrar las donaciones cuyo 'correo' coincida con 'correoUsuario'
      const donacionesFiltradas = data.filter((donacion: any) => donacion.correo === this.correoUsuario);
      
      // Asignar las donaciones filtradas a la variable donaciones
      this.donaciones = donacionesFiltradas;
      
      console.log(this.donaciones);  // Imprimir las donaciones filtradas en consola
    }, (error) => {
      console.error("Error al cargar las donaciones:", error);
    });
  }
  
  cambiarPantalla() {
    this.router.navigate(['/pagina-mentor']);
  }
}
