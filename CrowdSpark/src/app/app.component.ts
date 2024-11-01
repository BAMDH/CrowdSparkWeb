import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailService } from './email.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CrowdSpark';

  constructor(private emailService: EmailService) {}

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
  prueba(){
    this.sendEmail("brandon04e@gmail.com","Buajaja","Hola")
  }
}
