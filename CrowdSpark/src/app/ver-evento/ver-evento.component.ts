import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-evento.component.html',
  styleUrl: './ver-evento.component.css'
})
export class VerEventoComponent {
  eventos : any[] = [];
  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Llama al servicio para obtener los datos de la colección
    this.firestoreService.getCollectionData('Eventos')
      .subscribe(data => {
        this.eventos = data;

      });
  }
  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
