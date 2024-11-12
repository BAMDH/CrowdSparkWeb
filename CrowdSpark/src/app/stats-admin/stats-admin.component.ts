import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stats-admin',
  templateUrl: './stats-admin.component.html',
  imports: [CommonModule],
  styleUrls: ['./stats-admin.component.css']
})

export class StatsAdminComponent implements OnInit {
  title = 'Estadísticas del Proyecto';
  
  totalProjects = 0;
  completedProjects = 0;
  approvedProjectsPercentage = 0;
  totalFundingPercentage = 0;

  totalDonations = 0;
  averageDonation = 0; 
  totalUsers = 0;
  activeUsersPercentage = 0;
  mentorUsersPercentage = 0;

  constructor(
    private router: Router, 
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Cargar estadísticas de proyectos
    this.firestoreService.getAllProjects().subscribe((projects: any[]) => {
      this.totalProjects = projects.length;
      const approvedProjects = projects.filter(project => project.aprobado);
      const completedProjects = projects.filter(project => project.monto >= project.objetivoFinanciacion);
      this.completedProjects = completedProjects.length;
      
      // Porcentaje de proyectos aprobados con 2 decimales
      this.approvedProjectsPercentage = parseFloat(((approvedProjects.length / this.totalProjects) * 100).toFixed(2)); 

      let totalFundingAchieved = 0;
      let totalFundingGoal = 0;
      projects.forEach(project => {
        totalFundingAchieved += project.monto;
        totalFundingGoal += project.objetivoFinanciacion;
      });
      
      // Porcentaje de financiamiento total con 2 decimales
      this.totalFundingPercentage = parseFloat(((totalFundingAchieved / totalFundingGoal) * 100).toFixed(2));  
    });

    // Cargar estadísticas de donaciones
    this.firestoreService.getAllDonations().subscribe((donations: any[]) => {
      this.totalDonations = donations.length;
      
      // Calcular el promedio de donación
      let totalAmount = 0;
      donations.forEach(donation => {
        totalAmount += donation.monto; // Suponiendo que cada donación tiene un campo 'monto'
      });
      
      // Promedio de donación con 2 decimales
      this.averageDonation = this.totalDonations ? parseFloat((totalAmount / this.totalDonations).toFixed(2)) : 0;  // Redondear a 2 decimales
    });

    // Cargar estadísticas de usuarios
    this.firestoreService.getAllUsers().subscribe((users: any[]) => {
      this.totalUsers = users.length;
    });

    // Calcular porcentaje de usuarios activos
    this.firestoreService.getActiveUsers().subscribe((activeUsers: any[]) => {
      this.activeUsersPercentage = parseFloat(((activeUsers.length / this.totalUsers) * 100).toFixed(2));  // Redondear a 2 decimales
    });

    // Calcular porcentaje de usuarios mentores
    this.firestoreService.getMentorUsers().subscribe((mentorUsers: any[]) => {
      this.mentorUsersPercentage = parseFloat(((mentorUsers.length / this.totalUsers) * 100).toFixed(2));  // Redondear a 2 decimales
    });
  } 

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
