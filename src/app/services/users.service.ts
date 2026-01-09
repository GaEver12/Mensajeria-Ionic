import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user.models';
import { collection, collectionData, CollectionReference, DocumentData, Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private firestore = inject(Firestore);

  private usersRef: CollectionReference<DocumentData> = collection(this.firestore, 'users');

  public users$ = collectionData(this.usersRef, { idField: 'id' }) as Observable<User[]>;
  users: WritableSignal<User[]> = signal<User[]>([]);


  constructor() { 
    this.users$.subscribe(data => {
      this.users.set(data);
    });
  }

  public getUsers(): User[] {
    return this.users();
  }

  public getUserByName(name: string): User | undefined {
    return this.users().find(user => user.name === name);
  }

  public async updateUser(id: string, changes: Partial<User>): Promise<void> {
    const docRef = doc(this.firestore, `users/${id}`);
    await updateDoc(docRef, changes);
  }
}
export {User};
