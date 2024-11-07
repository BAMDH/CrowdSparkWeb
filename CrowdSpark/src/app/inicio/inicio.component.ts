import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {
  title = 'CrowdSpark';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  loginError: string | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router  
  ) {}

  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.firestoreService.getCollectionData('Usuarios').subscribe(users => {
      const user = users.find((u: any) => u.correo === email && u.password === password);
      
      if (user) {
        // Redirige al usuario si el login es exitoso
        this.router.navigate(['/pantalla-principal']);
      } else {
        // Muestra un mensaje de error si el login falla
        this.loginError = 'Correo o contraseña incorrectos.';
      }
    });
  }

  cambiarPantalla() {
    this.router.navigate(['/registro']);
  }
}