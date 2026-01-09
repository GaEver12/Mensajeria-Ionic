import { Component, inject } from '@angular/core';
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
  IonAlert,
  IonItemSliding,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonText,
} from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';
import { RouterLink } from '@angular/router';
import { DataService, Message } from '../services/data.service';
import { IAService } from '../services/ia.service';
import { Router } from '@angular/router';
import type { OverlayEventDetail } from '@ionic/core';
import { CommonModule } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import {
  add,
  closeCircle,
  mailOpenOutline,
  trashOutline,
  trashSharp,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonChip,
    IonAvatar,
    IonLabel,
    MessageComponent,
    IonAlert,
    IonItemSliding,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonText,
  ],
})
export class HomePage {
  private iAService = inject(IAService);
  username: string = '';
  messages: Message[] = [];
  constructor(private router: Router, private dataService: DataService) {
    addIcons({ add, closeCircle, trashOutline, trashSharp, mailOpenOutline });
  }

  async ionViewWillEnter() {
    const { value } = await Preferences.get({ key: 'usuario' });
    if (value) {
      const user = JSON.parse(value);
      this.username = user.name;
    }

    this.messages = await this.dataService.getMessages();
  }

  trackById(index: number, message: Message) {
    return message.id;
  }

  async refresh(ev: any) {
    const response = await this.iAService.getResponse('Traduce este texto: Hello');
    console.log('Respuesta IA: ', response);
    this.getMessages();
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  async getMessages(): Promise<void> {
    this.messages = await this.dataService.getMessages();
  }

  async deleteMessage(id: string) {
    try {
      await this.dataService.deleteMessage(id);
      await this.getMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  async logout() {
    await Preferences.remove({ key: 'usuario' });
    this.router.navigate(['/login']);
  }
  public logoutButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.logout();
      },
    },
  ];

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }
}
