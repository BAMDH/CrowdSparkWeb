import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  title = 'Lista de Usuarios';
  users = [
    { name: 'Juan Pérez', email: 'juan@example.com', role: 'User' },
    { name: 'Ana García', email: 'ana@example.com', role: 'Admin' },
    { name: 'Carlos López', email: 'carlos@example.com', role: 'User' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Fetching user list...');
    // Aquí puedes realizar una llamada al servicio para obtener usuarios desde la base de datos.
  }

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
