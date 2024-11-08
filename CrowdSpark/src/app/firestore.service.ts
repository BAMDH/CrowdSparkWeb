// src/app/firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
}
