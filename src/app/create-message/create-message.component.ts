import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Platform, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { paperPlane, paperPlaneOutline, documentTextOutline, arrowBackOutline, sparklesOutline, cameraOutline, close, closeCircle } from 'ionicons/icons';
import { SearchComponent } from '../search/search.component';
import {ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonInput, IonIcon, IonTextarea, IonButton, IonButtons, IonToast, IonProgressBar, IonChip, IonLabel, IonModal} from '@ionic/angular/standalone';
import { User } from '../models/user.models';
import { DataService } from '../services/data.service';
import { Message } from '../models/message.models'
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IAService } from '../services/ia.service';
import { StorageService } from '../services/storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { OverlayEventDetail} from '@ionic/core/components';


@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss'],
  imports: [FormsModule, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonInput, IonIcon, IonTextarea, IonButton, IonButtons, IonToast, IonProgressBar, IonChip, IonLabel, IonModal]
})
export class CreateMessageComponent  implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private storageService = inject(StorageService);
  private iAService = inject(IAService);
  private platform = inject(Platform);
  private fb = inject(FormBuilder);
  usuario: string = '';
  subject: string = '';
  message: string = '';
  username: string = "";
  urlImg: string = "";
  isLoading: boolean = false;
  downloadUrl: string = "";
  


  constructor(private modalCtrl: ModalController, public dataService: DataService, public router: Router, private loadingCtrl: LoadingController) { 
    addIcons({ paperPlane, paperPlaneOutline, documentTextOutline, arrowBackOutline, sparklesOutline, cameraOutline, closeCircle  })
  }

  ngOnInit() {}

  goBack(){ 
    this.router.navigate(['/home']);
  }
  
  async takePhoto(){
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagen...'
    });

    loading.present();
    console.log(image);
    this.downloadUrl = await this.storageService.uploadBase64Image(image.dataUrl!);
    console.log('Foto guardada en: ', this.downloadUrl);
    loading.dismiss();
  }

  async betterRedaction(){
    this.isLoading = true;
    const response = await this.iAService.getResponse(`Mejora la redacción del siguiente mensaje, dándole formato de correo y ampliándolo ligeramente para que suene más claro, completo y profesional.
    Incluye un saludo apropiado al inicio.
    No elimines, resumas ni reformules ninguna parte del contenido original. No omitas repeticiones ni detalles.
    No agregues el nombre del remitente, ya que se incluye automáticamente.
    Ten en cuenta que algunos nombres (como “Mumba”) son lugares locales y no deben interpretarse como ciudades extranjeras ni modificarse. Mensaje: ${this.message}`);
    console.log(response);
    const responseObject = JSON.parse(response);
    console.log(responseObject.traduccion);
    this.message = responseObject.traduccion;
    this.isLoading = false;
  }

  async sendMessage() {
    const newId = this.dataService.getNextId();
    const { value } = await Preferences.get({ key: 'usuario' });
    if (value) {
      const user = JSON.parse(value);
      this.username = user.name;
    }

    const fechaFormateada = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });


    const newMessage: Message = {
      id: newId.toString(),
      toName: this.usuario,
      fromName: this.username,
      subject: this.subject,
      message: this.message,
      date: fechaFormateada,
      read: false,
      urlImg: this.downloadUrl
    };
    try {
      if(this.usuario === "" || this.subject === "" || this.message === ""){
        this.setOpen(true);
      }else{
        await this.dataService.addMessage(newMessage);
        console.log('Mensaje enviado con éxito');
        this.usuario = '';
        this.subject = '';
        this.message = '';
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
    });

    modal.present();

    const { data } = await modal.onDidDismiss<User>();
    if (data) {
      this.usuario = data.name;
    }
  }

  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    console.log("Confirmado");
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }
  removeImage(){
    this.downloadUrl = "";
  }
}