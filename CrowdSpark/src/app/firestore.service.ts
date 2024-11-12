// src/app/firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, collectionData, query, where, getDocs, updateDoc, DocumentData, DocumentReference, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  getMentors(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where('isMentor', '==', true));
    return collectionData(q, { idField: 'id' }).pipe(
      map((mentors: any[]) => mentors.map(mentor => ({
        nombre: mentor.nombre,
        correo: mentor.correo
      })))
    );
  }

  getProyectosByMentor(correo: string | null): Observable<any[]> {
    const proyectosRef = collection(this.firestore, 'Mentoria');
    const q = query(proyectosRef, where('mentor', '==', correo), where('aceptado', '==', true));
    return collectionData(q);
  }
  // Obtener todos los documentos de la colección Donacion
  getAllDonations(): Observable<any[]> {
    return this.getCollectionData('Donacion');
  }

  // Obtener todos los documentos de la colección Usuarios
  getAllUsers(): Observable<any[]> {
    return this.getCollectionData('Usuarios');
  }

  // Obtener usuarios activos
  getActiveUsers(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where('estado', '==', 'activo'));
    return collectionData(q);

 
  }
  getAllProjects(): Observable<any[]> {
    return this.getCollectionData('Proyecto');
  }

  // Obtener usuarios mentores
  getMentorUsers(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'Usuarios');
    const q = query(collectionRef, where('isMentor', '==', true));
    return collectionData(q);
  }

  getProyectosByMentorPendientes(correo: string | null): Observable<any[]> {
    const proyectosRef = collection(this.firestore, 'Mentoria');
    const q = query(proyectosRef, where('mentor', '==', correo), where('aceptado', '==', false));
    return collectionData(q);
  }

  approveMentorship(proyecto: string): Observable<void> {
    const collectionName = 'Mentoria';
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where("proyecto", "==", proyecto)); // Filtrar por projectName
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const updatePromises = snapshot.docs.map(docSnapshot => {
            const projectDocRef = doc(this.firestore, `${collectionName}/${docSnapshot.id}`);
            return updateDoc(projectDocRef, { aceptado: true }).catch(error => {
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
  denyMentorship(proyecto: string): Observable<void> {
    const collectionName = 'Mentoria';
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where("proyecto", "==", proyecto)); // Filtrar por projectName

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const deletePromises = snapshot.docs.map(docSnapshot => {
            const docRef = doc(this.firestore, `${collectionName}/${docSnapshot.id}`);
            return deleteDoc(docRef).catch(error => {
              console.error(`Error deleting document ${docSnapshot.id}:`, error);
              throw error;
            });
          });
          return Promise.all(deletePromises);
        } else {
          console.warn(`No documents found with project: ${proyecto}`);
          return Promise.resolve();
        }
      }),
      map(() => void 0) // Ensure the observable returns void
    );
  }
  getPendingSessions(correo: string | null): Observable<any[]> {
    const proyectosRef = collection(this.firestore, 'Proyecto');
    const proyectosQuery = query(proyectosRef, where('idEncargado', '==', correo));

    return from(getDocs(proyectosQuery)).pipe(
      switchMap(proyectosSnapshot => {
        const projectNames = proyectosSnapshot.docs.map(doc => doc.data()['nombre']);
        if (projectNames.length === 0) {
          return [];
        }
        const sesionesRef = collection(this.firestore, 'Sesion');
        const sesionesQuery = query(sesionesRef, where('project', 'in', projectNames), where('pagado', '==', false));
        return collectionData(sesionesQuery);
      })
    );
  }

  paySession(session: any): Observable<void> {
    const collectionName = 'Sesion';
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where("project", "==", session.project), where("sessionTime", "==", session.sessionTime), where("sessionDate", "==", session.sessionDate), where("price", "==", session.price), where("mentor", "==", session.mentor)); 
    let projectRef: DocumentReference<DocumentData>;
    let projectSnapshot: any;
    return from(getDocs(q)).pipe(
      switchMap(snapshot => {
        if (!snapshot.empty) {
          const updatePromises = snapshot.docs.map(docSnapshot => {
            const projectDocRef = doc(this.firestore, `${collectionName}/${docSnapshot.id}`);
            projectRef = projectDocRef;
            projectSnapshot = docSnapshot;
            return updateDoc(projectDocRef, { pagado: true }).catch(error => {
              console.error(`Error updating document ${docSnapshot.id}:`, error);
              throw error;
            });
          });
          return from(Promise.all(updatePromises));
        } else {
          console.warn(`No documents found with the specified session details.`);
          return Promise.resolve();
        }
      }),
      switchMap(() => {
        // Step 1: Get the idEncargado (user email) for the given project
        const proyectosRef = collection(this.firestore, 'Proyecto');
        const proyectosQuery = query(proyectosRef, where('nombre', '==', session.project));
        return from(getDocs(proyectosQuery)).pipe(
          switchMap(proyectosSnapshot => {
            if (!proyectosSnapshot.empty) {
              const projectDoc = proyectosSnapshot.docs[0];
              const idEncargado = projectDoc.data()['idEncargado'];

              // Step 2: Get the current dinero value for the user
              const usuariosRef = collection(this.firestore, 'Usuarios');
              const usuarioQuery = query(usuariosRef, where('correo', '==', idEncargado));
              return from(getDocs(usuarioQuery)).pipe(
                switchMap(usuarioSnapshot => {
                  if (!usuarioSnapshot.empty) {
                    const usuarioDoc = usuarioSnapshot.docs[0];
                    const usuarioDocRef = doc(this.firestore, `Usuarios/${usuarioDoc.id}`);
                    const currentDinero = usuarioDoc.data()['dinero'] || 0;
                    const newDinero = currentDinero - session.price;
                    if (newDinero < 0) {
                      console.error(`No tiene dinero suficiente para pagar la sesion.`);
                      alert("No tiene dinero suficiente para pagar la sesion.");
                      return updateDoc(projectRef, { pagado: false }).catch(error => {
                        console.error(`Error updating document ${projectSnapshot.id}:`, error);
                        alert("No tiene dinero suficiente para pagar la sesion.");
                        throw error;
                      });
                    } else {
                      // Step 3: Update the dinero value for the user
                      console.log("Sesion pagada");
                      alert("Sesion pagada");
                      return from(updateDoc(usuarioDocRef, { dinero: newDinero }));
                    }
                  } else {
                    console.warn(`No user found with idEncargado: ${idEncargado}`);
                    return updateDoc(projectRef, { pagado: false }).catch(error => {
                      console.error(`Error updating document ${projectSnapshot.id}:`, error);
                      throw error;
                    });
                  }
                })
              );
            } else {
              console.warn(`No project found with name: ${session.project}`);
              return Promise.resolve();
            }
          })
        );
      }),
      map(() => void 0) // Ensure the observable returns void
    );
  }
}


