// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Obtener todos los elementos de una colección
  getItems(collectionName: string): Observable<any[]> {
    const itemsRef = collection(this.firestore, collectionName);
    return collectionData(itemsRef);
  }

  // Agregar un nuevo elemento a la colección
  addItem(collectionName: string, data: any) {
    const itemsRef = collection(this.firestore, collectionName);
    return addDoc(itemsRef, data);
  }

  // Obtener un documento específico
  getItem(collectionName: string, id: string) {
    const itemRef = doc(this.firestore, `${collectionName}/${id}`);
    return getDoc(itemRef);
  }

  // Eliminar un documento
  deleteItem(collectionName: string, id: string) {
    const itemRef = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(itemRef);
  }
}
