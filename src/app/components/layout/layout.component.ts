import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { FileListComponent } from '../file-list/file-list.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [CommonModule, FileListComponent],
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  userLoggedIn: User = null;

  ngOnInit(): void {
    const user = sessionStorage.getItem('userLoggedIn');

    if (user) {
      this.userLoggedIn = JSON.parse(user);
    }
  }

  // Clear the userLoggedIn object from the sessionStorage and navigates the user to the login
  logout(): void {
    if (this.userLoggedIn) {
      sessionStorage.removeItem('userLoggedIn');
      this.router.navigateByUrl('login');
    }
  }
}
