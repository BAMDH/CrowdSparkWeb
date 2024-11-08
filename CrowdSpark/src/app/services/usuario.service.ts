import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private correoUsuario: string | null = null;

  constructor() { }

  // Método para establecer el correo del usuario
  setCorreoUsuario(correo: string) {
    this.correoUsuario = correo;
  }

  // Método para obtener el correo del usuario
  getCorreoUsuario(): string | null {
    return this.correoUsuario;
  }
}
