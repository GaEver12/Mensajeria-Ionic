import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonButton, IonList, IonToast } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonButton, IonList, IonToast,
    CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  username: string = "";

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit() {
  }

  async login() {
    if (!this.username.trim()) {
      alert('Ingresa un nombre de usuario.');
      return;
    }

    const user = this.usersService.getUserByName(this.username);

    if (user) {
      await Preferences.set({
        key: 'usuario',
        value: JSON.stringify(user),
      });

      this.router.navigate(['/home']);
    } else {
      this.setOpen(true);
    }
  }

  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
