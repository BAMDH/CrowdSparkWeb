import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats-admin',
  templateUrl: './stats-admin.component.html',
  styleUrls: ['./stats-admin.component.css']
})
export class StatsAdminComponent implements OnInit {
  title = 'Estadísticas del Proyecto';
  
  // Datos de ejemplo como placeholders
  totalProjects = 120;
  totalDonations = 1500;
  averageDonation = 50;
  activeUsers = 300;
  completedProjects = 80;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Cargando estadísticas del proyecto...');
  }

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
