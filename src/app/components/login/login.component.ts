import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [MdbFormsModule, FormsModule],
})
export class LoginComponent {
  isLoginView: boolean = true;

  userRegisterObj: User = {
    password: '',
    email: '',
  };

  userLogin: User = {
    email: '',
    password: '',
  };

  router = inject(Router);

  constructor(private toastr: ToastrService) {}

  onRegister() {
    const isLocalData = sessionStorage.getItem('userStorage');
    if (isLocalData != null) {
      const localArray = JSON.parse(isLocalData);
      localArray.push(this.userRegisterObj);
      sessionStorage.setItem('userStorage', JSON.stringify(localArray));
    } else {
      const localArray = [];
      localArray.push(this.userRegisterObj);
      sessionStorage.setItem('userStorage', JSON.stringify(localArray));
    }

    this.toastr.success('User successfully registered', 'Success!');
    this.isLoginView = true;
  }

  onLogin() {
    const isLocalData = sessionStorage.getItem('userStorage');
    if (isLocalData != null) {
      const users = JSON.parse(isLocalData);

      const isUserFound = users.find(
        (m: any) =>
          m.email == this.userLogin.email &&
          m.password == this.userLogin.password
      );
      if (isUserFound != undefined) {
        sessionStorage.setItem('userLoggedIn', JSON.stringify(isUserFound));
        this.router.navigateByUrl('file-list');
      } else {
        this.toastr.error('Username or password is wrong', 'Warning!');
      }
    } else {
      this.toastr.warning('No user registered', 'Attention!');
    }
  }
}
