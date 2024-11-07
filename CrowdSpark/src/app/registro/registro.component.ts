import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  newUser : any;
  document = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    regEmail: new FormControl('', [Validators.required]),
    workArea: new FormControl('', [Validators.required]),
    initialAmount: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    regPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  constructor(private emailService: EmailService,private firestoreService: FirestoreService,
    private router: Router) {
   
  }
  onSubmit() {
    if (this.document.valid) {
      this.newUser = {
        area: this.document.get('workArea')?.value,
        cedula: this.document.get('idNumber')?.value,
        correo: this.document.get('regEmail')?.value,
        dinero: this.document.get('initialAmount')?.value,
        estado: 'activo',  // Mantener valor por defecto
        nombre: this.document.get('fullName')?.value,
        password: this.document.get('regPassword')?.value,
        telefono: this.document.get('phone')?.value,
      };
      this.addUser(this.newUser);
      
    } else {
      console.log('Formulario inválido');
    }
  }
  addUser(newUser: any) {
    

    // Llamamos al servicio para agregar el documento
    this.firestoreService.addDocument('Usuarios', newUser)
      .then(() => {
        console.log('Usuario agregado correctamente');
        alert("Registro exitoso.");
        this.router.navigate(['/inicio'])
      })
      .catch((error) => {
        console.error('Error al agregar el usuario:', error);
      });
  }
  // allowedDomains = /@(estudiantec\.cr|itcr\.ac\.cr)$/;

/*

  if (password === confirmPassword) {
      alert("Registro exitoso.");
      window.location.href = "inicio.html";
  } else {
      alert("Las contraseñas no coinciden.");
  }
});
*/
}
