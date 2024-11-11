import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../firestore.service';
@Component({
  standalone:true,
  selector: 'app-donaciones-admin',
  
  imports: [CommonModule],
  templateUrl: './donaciones-admin.component.html',
  styleUrls: ['./donaciones-admin.component.css']
})
export class DonacionesAdminComponent implements OnInit {
  title = 'Historial de Donaciones';
  donations = [
    { projectName: 'Proyecto A', amount: 50, date: '2024-11-01' },
    { projectName: 'Proyecto B', amount: 30, date: '2024-10-15' },
    { projectName: 'Proyecto C', amount: 20, date: '2024-09-25' }
  ];
  correoUsuario: string | null = null;
  donaciones: any[] = [];  // Variable para almacenar las donaciones

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

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
 

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}

