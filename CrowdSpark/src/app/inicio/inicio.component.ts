import { Component } from '@angular/core';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  title = 'CrowdSpark';
  items: any[] = [];
  constructor(private emailService: EmailService,private firestoreService: FirestoreService,
    private router: Router) {}
 
  sendEmail(to: string,subject: string,text: string) {
    this.emailService.sendEmail(to, subject, text).subscribe(
      response => {
        console.log('Correo enviado:', response);
      
      },
      error => {
        console.error('Error al enviar correo:', error);
       
      }
    );
  }


 cambiarPantalla() {
  console.log("entra aqui")
  this.router.navigate(['/registro']);
}

  prueba(){
    //this.sendEmail("brandon04e@gmail.com","Buajaja","Hola")
    const newUser = {
      area: "papas",
      cedula: "3",
      correo: "azu@estudiantec.cr",
      dinero: "555",
      estado: "activo",
      nombre: "Azu",
      password: "09999",
      telefono: "23456"
    };
    
  }
  addUser(newUser: any) {
    

    // Llamamos al servicio para agregar el documento
    this.firestoreService.addDocument('Usuarios', newUser)
      .then(() => {
        console.log('Usuario agregado correctamente');
      })
      .catch((error) => {
        console.error('Error al agregar el usuario:', error);
      });
  }

}
