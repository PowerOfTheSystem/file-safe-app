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

  // Method to handle user registration
  onRegister() {
    const isLocalData = sessionStorage.getItem('userStorage');

    // Check if there's any user data stored in sessionStorage
    if (isLocalData != null) {
      // If user data exists, parse the array and add new user object
      const localArray = JSON.parse(isLocalData);
      localArray.push(this.userRegisterObj);
      sessionStorage.setItem('userStorage', JSON.stringify(localArray));
    } else {
      // If no user data exists, create a new array with the user object
      const localArray = [];
      localArray.push(this.userRegisterObj);
      sessionStorage.setItem('userStorage', JSON.stringify(localArray));
    }

    // Show success notification and switch to the login view
    this.toastr.success('User successfully registered', 'Success!');
    this.isLoginView = true;
  }

  // Method to handle user login
  onLogin() {
    const isLocalData = sessionStorage.getItem('userStorage');

    // Check if user data is stored in sessionStorage
    if (isLocalData != null) {
      const users = JSON.parse(isLocalData);

      // Find the user by email and password
      const isUserFound = users.find(
        (m: any) =>
          m.email == this.userLogin.email &&
          m.password == this.userLogin.password
      );
      if (isUserFound != undefined) {
        // If user is found, store user data in sessionStorage and navigate to file list
        sessionStorage.setItem('userLoggedIn', JSON.stringify(isUserFound));
        this.router.navigateByUrl('file-list');
      } else {
        // Show error notification if email or password is incorrect
        this.toastr.error('Username or password is wrong', 'Warning!');
      }
    } else {
      // Show warning notification if no user data is registered
      this.toastr.warning('No user registered', 'Attention!');
    }
  }
}
