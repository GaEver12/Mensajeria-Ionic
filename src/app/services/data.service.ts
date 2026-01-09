import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Message } from '../models/message.models';
import { collection, collectionData, CollectionReference, DocumentData, Firestore, updateDoc, doc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  private messagesRef: CollectionReference<DocumentData> = collection(this.firestore, 'messages');

  private messages$ = collectionData(this.messagesRef, { idField: 'id' }) as Observable<Message[]>;
  messages: WritableSignal<Message[]> = signal<Message[]>([]);


  constructor() { 
    this.messages$.subscribe(data => {
      //console.log("data firestore",data);
      this.messages.set(data);
    });
  }

  public async getMessages(): Promise<Message[]> {
    const { value } = await Preferences.get({ key: 'usuario' });
    if (!value) return [];

    const user = JSON.parse(value);

    let retries = 0;
    while (this.messages().length === 0 && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    return this.messages().filter(msg => msg.toName === user.name);
  }

  public getMessageById(id: string): Message {
    return this.messages().find(message => message.id === id)!;
  }

  public async getNextId(): Promise<number> {
    const messages = await this.getMessages();
    const ids = messages
      .map(msg => parseInt(msg.id, 10))
      .filter(id => !isNaN(id));

    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  public async addMessage(message: Message): Promise<void> {
    await addDoc(this.messagesRef, message);
  }

  public async updateMessage(id: string, changes: Partial<Message>): Promise<void> {
    const docRef = doc(this.firestore, `messages/${id}`);
    await updateDoc(docRef, changes);
  }

  public async deleteMessage(id: string): Promise<void> {
    const docRef = doc(this.firestore, `messages/${id}`);
    await deleteDoc(docRef);
  }
}
export {Message};