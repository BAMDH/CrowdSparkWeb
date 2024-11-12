import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-sesiones-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sesiones-pendientes.component.html',
  styleUrls: ['./sesiones-pendientes.component.css']
})
export class SesionesPendientesComponent implements OnInit {
  correoUsuario: string | null = null;
  sessions: any[] = [];  // Variable para almacenar las sesiones

  constructor(
    private usuarioService: UsuarioService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.correoUsuario = this.usuarioService.getCorreoUsuario();
  }

  ngOnInit() {
    this.cargarProyectos();
  }

  // Método para cargar las sesiones desde Firebase
  cargarProyectos() {
    this.firestoreService.getPendingSessions(this.correoUsuario).subscribe((data: any[]) => {
      this.sessions = data;
      console.log(this.sessions);  // Imprimir las sesiones filtradas en consola
    }, (error) => {
      console.error("Error al cargar las sesiones:", error);
    });
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }

  pagarSesion(session: any) {
    this.firestoreService.paySession(session).subscribe({
      next: () => {
        console.log("Sesion pagada");
        
        this.cargarProyectos();  // Recargar las sesiones después del pago
      },
      error: (error) => {
        console.error("Error al pagar la sesion:", error);
        alert("Error al pagar la sesion. Por favor, intente nuevamente.");
      }
    });
  }
}