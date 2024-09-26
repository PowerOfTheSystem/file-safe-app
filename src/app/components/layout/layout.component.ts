import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { File } from 'src/app/models/file';
import { User } from 'src/app/models/user';
import { UserFiles } from 'src/app/models/file copy';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [CommonModule],
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  userLoggedInUploadedFiles: File[] = [];
  currentUploadingFiles: File[] = [];
  userLoggedIn: User = null;
  modalRef: MdbModalRef<ConfirmModalComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    const user = sessionStorage.getItem('userLoggedIn');

    // Retrieve logged-in user data
    if (user) {
      this.userLoggedIn = JSON.parse(user);
    }

    // Retrieve logged-in user uploaded files
    if (savedFiles) {
      const files: UserFiles[] = JSON.parse(savedFiles);
      const userFiles = files.find((x) => x.email == this.userLoggedIn.email);

      if (userFiles) {
        this.userLoggedInUploadedFiles = userFiles.files;
      }
    }
  }

  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.currentUploadingFiles.push(files[i]);
    }

    this.saveFilesToSession();
  }

  deleteAllFiles(): void {
    this.modalRef = this.modalService.open(ConfirmModalComponent, {
      data: {
        title: 'Delete all files',
        body: 'Are you sure you want to delete all files?',
      },
    });

    this.modalRef.onClose.subscribe(() => {
      const savedFiles = sessionStorage.getItem('uploadedFiles');
      let userFiles: UserFiles[] = savedFiles ? JSON.parse(savedFiles) : [];

      // Filter out the files for the logged-in user
      userFiles = userFiles.filter(
        (userFile) => userFile.email !== this.userLoggedIn.email
      );

      // Save the updated file list back to session storage
      sessionStorage.setItem('uploadedFiles', JSON.stringify(userFiles));

      // Clear the logged-in user's file list in memory
      this.userLoggedInUploadedFiles = [];
    });
  }

  deleteFile(id: string): void {
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    if (savedFiles) {
      let userFiles: UserFiles[] = JSON.parse(savedFiles);

      // Find the logged-in user's file entry
      const userFileEntry = userFiles.find(
        (entry) => entry.email === this.userLoggedIn.email
      );

      if (userFileEntry) {
        // Find the file to delete within the user's files
        const fileToDelete = userFileEntry.files.find((file) => file.id === id);

        if (fileToDelete) {
          this.modalRef = this.modalService.open(ConfirmModalComponent, {
            data: {
              title: `Delete [${fileToDelete.name}] file`,
              body: 'Are you sure you want to delete this file?',
            },
          });

          this.modalRef.onClose.subscribe(() => {
            // Remove the file from the logged-in user's file list
            userFileEntry.files = userFileEntry.files.filter(
              (file) => file.id !== id
            );

            // If no files are left for the user, consider removing the user entry
            if (userFileEntry.files.length === 0) {
              userFiles = userFiles.filter(
                (entry) => entry.email !== this.userLoggedIn.email
              );
            }

            // Save the updated files back to session storage
            sessionStorage.setItem('uploadedFiles', JSON.stringify(userFiles));

            // Update the user's uploaded files in memory
            this.userLoggedInUploadedFiles = userFileEntry.files;
          });
        }
      }
    }
  }

  saveFilesToSession(): void {
    // Prepare files to upload
    const uploadFiles: File[] = this.currentUploadingFiles.map((file) => {
      const randomId = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const uniqid = randomId + Date.now();

      return {
        id: uniqid,
        name: file.name,
        size: file.size,
        type: file.type,
        imgURL: `../../../assets/img/files/${file.name.split('.')[1]}.png`,
      };
    });

    // Retrieve previously saved files from session storage
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    let userFiles: UserFiles[] = savedFiles ? JSON.parse(savedFiles) : [];

    // Check if the logged-in user already has files
    const userFileEntry = userFiles.find(
      (entry) => entry.email === this.userLoggedIn.email
    );

    if (userFileEntry) {
      // User already has files, append the new ones
      userFileEntry.files = userFileEntry.files.concat(uploadFiles);
    } else {
      // New user, create a new entry
      userFiles.push({
        email: this.userLoggedIn.email,
        files: uploadFiles,
      });
    }

    // Save updated files back to session storage
    sessionStorage.setItem('uploadedFiles', JSON.stringify(userFiles));
    this.userLoggedInUploadedFiles = userFileEntry
      ? userFileEntry.files
      : uploadFiles;
  }

  logout(): void {
    if (this.userLoggedIn) {
      sessionStorage.removeItem('userLoggedIn');
      this.router.navigateByUrl('login');
    }
  }
}
