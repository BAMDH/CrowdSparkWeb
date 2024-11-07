import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pantalla-principal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pantalla-principal.component.html',
  styleUrl: './pantalla-principal.component.css'
})

export class PantallaPrincipalComponent {

}
