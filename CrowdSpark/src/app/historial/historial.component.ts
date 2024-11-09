import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
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
      console.log(data);  // Imprimir los datos en consola
      this.donaciones = data;
    });
  }
  
  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}