import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonSearchbar,IonList, ModalController } from '@ionic/angular/standalone'
import { UsersService } from '../services/users.service';
import { User } from '../models/user.models';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [CommonModule, FormsModule, AngularFirestoreModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonSearchbar, IonList]
})
export class SearchComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  caracterBusqueda: string = '';

  private usersSubscription!: Subscription;

  constructor(private modalCtrl: ModalController, public usersService: UsersService) {}

  ngOnInit() {
    this.usersSubscription = this.usersService.users$.subscribe(data => {
      this.usuarios = data;
      this.usuariosFiltrados = data;
      console.log('Usuarios recibidos desde Firebase:', data);
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  filtrarUsuarios() {
    const term = this.caracterBusqueda.toLowerCase();
    if (!term) {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(user =>
        user.name.toLowerCase().includes(term)
      );
    }
  }

  seleccionarUsuario(user: User) {
    this.modalCtrl.dismiss(user);
  }
}

