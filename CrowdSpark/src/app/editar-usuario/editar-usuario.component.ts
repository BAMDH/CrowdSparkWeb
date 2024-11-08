import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent {
  emailError: string | null = null;  // Variable para el mensaje de error
  passwordError: string | null = null;
  correoUsuario: string | null = null;

  document = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    workArea: new FormControl('', [Validators.required]),
    initialAmount: new FormControl('', [Validators.required, this.validatePositiveNumber]),
    phone: new FormControl('', [Validators.required]),
    regPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {this.correoUsuario = this.usuarioService.getCorreoUsuario()}

  updateUsuario() {
    const updatedUserData = this.document.value;

    // Creamos un objeto vacío para los campos que vamos a actualizar
    const updateData: any = {};

    // Verificar si cada campo tiene un valor no vacío
    if (updatedUserData.fullName && updatedUserData.fullName.trim() !== '') {
      updateData.nombre = updatedUserData.fullName;
    }
    if (updatedUserData.idNumber && updatedUserData.idNumber.toString().trim() !== '') {
      updateData.cedula = updatedUserData.idNumber;
    }
    if (updatedUserData.workArea && updatedUserData.workArea.trim() !== '') {
      updateData.areaTrabajo = updatedUserData.workArea;
    }
    if (updatedUserData.initialAmount && updatedUserData.initialAmount.toString().trim() !== '') {
      updateData.montoInicial = updatedUserData.initialAmount;
    }
    if (updatedUserData.phone && updatedUserData.phone.toString().trim() !== '') {
      updateData.telefono = updatedUserData.phone;
    }
    if (updatedUserData.regPassword && updatedUserData.regPassword.trim() !== '') {
      updateData.contraseña = updatedUserData.regPassword;
    }

    // Si hay datos para actualizar (al menos un campo no está vacío)
    if (Object.keys(updateData).length > 0 && this.correoUsuario) {
      // Obtener el usuario por correo para actualizarlo
      this.firestoreService.getUsuariosByCorreo(this.correoUsuario)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const docId = doc.id;
            // Realizar la actualización en Firestore
            this.firestoreService.updateDocument('Usuarios', docId, updateData)
              .then(() => {

                console.log('Usuario actualizado correctamente');
                alert("Usuario actualizado exitosamente.");
                this.router.navigate(['/pantalla-principal']);
              })
              .catch((error) => {
                console.error('Error al actualizar el usuario:', error);
              });
          });
        });
    } else {
      console.log('No se han realizado cambios en los campos o no hay correo disponible.');
    }
  }















 

  validatePositiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return { invalidAmount: true };
    }
    return null;
  }

  validatePasswords() {
    const password = this.document.get('regPassword')?.value;
    const confirmPassword = this.document.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      this.passwordError = 'Las contraseñas deben coincidir';
      this.document.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.passwordError = null;
      this.document.get('confirmPassword')?.setErrors(null);
    }
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
