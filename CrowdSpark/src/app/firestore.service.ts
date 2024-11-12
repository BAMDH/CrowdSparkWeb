// src/app/firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, collectionData, query, where, getDocs, updateDoc  } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Obtener todos los elementos de una colección
  getCollectionData(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef);
  }

  // Obtener un documento específico por ID
  getDocumentData(collectionName: string, docId: string) {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return getDoc(docRef);
  }

  // Agregar un nuevo documento a una colección
  addDocument(collectionName: string, data: any) {
    const collectionRef = collection(this.firestore, collectionName);
    return addDoc(collectionRef, data);
  }

  // Actualizar un documento existente
  updateDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return setDoc(docRef, data, { merge: true });
  }

  getProjectByName(collectionName: string, name: string) {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where("nombre", "==", name)); // Filtrar por projectName
    return getDocs(q);
  }

  // Obtener proyectos filtrados por idEncargado y correo
  getProyectosByEncargado(correo: string): Observable<any[]> {
    const proyectosRef = collection(this.firestore, 'Proyecto'); 
    const q = query(proyectosRef, where('idEncargado', '==', correo));
    return collectionData(q); 
  }

  getUsuariosByCorreo(correo: string) {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where("correo", "==", correo)); // Filtrar por correo
    return getDocs(q); // Devuelve los documentos encontrados
  }
  // Verificar si un usuario con un correo específico ya existe
  userExistsByEmail(correo: string): Observable<boolean> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where("correo", "==", correo));
    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty) // Retorna true si existe al menos un documento
    );
  }
  projectExistsByName(nombre: string): Observable<boolean> {
    const collectionRef = collection(this.firestore, 'Proyecto');
    const q = query(collectionRef, where("nombre", "==", nombre));
    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty) // Retorna true si existe al menos un documento
    );
  }
   // Método para modificar el estado del usuario
   updateUserStatusByCorreo(correo: string, newStatus: string) {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where("correo", "==", correo)); // Filtrar por correo
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          // Si existe el usuario, obtenemos el documento
          snapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(this.firestore, `Usuarios/${docSnapshot.id}`);
            await updateDoc(userDocRef, { estado: newStatus }); // Actualizamos el estado
          });
        }
      })
    );
  }
   // Método para actualizar el estado de "isMentor" de un usuario basado en su correo electrónico
   updateUserMentorStatusByCorreo(correo: string, isMentor: boolean) {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where("correo", "==", correo)); // Filtrar por correo
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          // Si existe el usuario, obtenemos el documento
          snapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(this.firestore, `Usuarios/${docSnapshot.id}`);
            await updateDoc(userDocRef, { isMentor: isMentor }); // Actualizamos el valor de isMentor
          });
        }
      })
    );
  }
  // Verificar si un usuario está inactivo por correo
  getInactiveUserByCorreo(correo: string): Observable<boolean> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    // Consulta para filtrar por correo y estado "inactivo"
    const q = query(collectionRef, where("correo", "==", correo), where("estado", "==", "inactivo"));
    
    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty) // Retorna true si se encuentra un usuario con estado "inactivo"
    );
  }
  getApprovedProjects(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'Proyecto');
    const q = query(collectionRef, where('aprobado', '==', true));
    return collectionData(q);
  }
  getPendingProjects(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'Proyecto');
    const q = query(collectionRef, where('aprobado', '==', false));
    return collectionData(q);
  }
  approveProject(name: string): Observable<void> {
    const collectionName = 'Proyecto';
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where("nombre", "==", name)); // Filtrar por projectName
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const updatePromises = snapshot.docs.map(docSnapshot => {
            const projectDocRef = doc(this.firestore, `${collectionName}/${docSnapshot.id}`);
            return updateDoc(projectDocRef, { aprobado: true }).catch(error => {
              console.error(`Error updating document ${docSnapshot.id}:`, error);
              throw error;
            });
          });
          return Promise.all(updatePromises);
        } else {
          console.warn(`No documents found with name: ${name}`);
          return Promise.resolve();
        }
      }),
      map(() => void 0) // Ensure the observable returns void
    );
  }
  checkMentor(correo: string|null): Observable<boolean> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where("correo", "==", correo), where("isMentor", "==", true));
    
    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty) 
    );
  }
}
