import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donaciones-admin',
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Fetching donation history...');
  }

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}

