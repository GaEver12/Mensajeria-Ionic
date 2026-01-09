
import { Component, inject, OnInit, computed, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote, IonChip, IonModal, IonButton, IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, close, imageOutline, personCircle } from 'ionicons/icons';
import { DataService, Message } from '../services/data.service';
import { effect } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote, IonChip, IonModal, IonButton, IonTitle], 
})
export class ViewMessagePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  //public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  public messageId: string = '';
  public urlImg: string = "";
  public message = computed(() => 
    this.data.messages().find(msg => msg.id === this.messageId) )

  constructor() {
    addIcons({ personCircle, cameraOutline, close, imageOutline });
    
    effect(() => {
        console.log('efecto');
        const msg = this.message();
        if(msg && !msg.read){
          this.data.updateMessage(this.messageId, { read: true })
            .then(() => console.log('mensaje actualizado'))
            .catch(err => console.log('Error al actualizar el mensaje: ',err));
        }
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    //this.message = this.data.getMessageById(id);
    //this.data.updateMessage(id, { read: true });
    this.messageId = id;
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  
  confirm() {
    console.log("Confirmado");
  }
  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      console.log("");
    }
  }
}
