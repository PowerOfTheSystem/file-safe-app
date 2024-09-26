import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [MdbFormsModule,FormsModule],
})
export class LoginComponent {
  isLoginView: boolean = true;

  userRegisterObj: any = {
    password: '',
    email: '',
  };

  userLogin: any = {
    email: '',
    password: '',
  };

  router = inject(Router);

  onRegister() {
    const isLocalData = localStorage.getItem('userStorage');
    if (isLocalData != null) {
      const localArray = JSON.parse(isLocalData);
      localArray.push(this.userRegisterObj);
      localStorage.setItem('userStorage', JSON.stringify(localArray));
    } else {
      const localArray = [];
      localArray.push(this.userRegisterObj);
      localStorage.setItem('userStorage', JSON.stringify(localArray));
    }

    alert('Registration Success');
    this.isLoginView = true;
  }

  onLogin() {
    const isLocalData = localStorage.getItem('userStorage');
    if (isLocalData != null) {
      const users = JSON.parse(isLocalData);

      const isUserFound = users.find(
        (m: any) =>
          m.email == this.userLogin.email &&
          m.password == this.userLogin.password
      );
      if (isUserFound != undefined) {
        localStorage.setItem('userLoggedIn', JSON.stringify(isUserFound));
        this.router.navigateByUrl('dashboard');
      } else {
        alert('User name or password is Wrong');
      }
    } else {
      alert('No User Found');
    }
  }
}
