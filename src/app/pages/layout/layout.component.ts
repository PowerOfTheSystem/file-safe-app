import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

export interface File {
  id: number; // Unique identifier for the file
  name: string; // Name of the file
  size: number; // Size of the file (typically in bytes)
  type: string; // MIME type of the file (e.g., 'image/png', 'application/pdf')
  imgURL: string; // URL to the image preview of the file (if applicable)
}

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [CommonModule],
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  uploadedFiles: File[] = [];
  modalRef: MdbModalRef<ConfirmModalComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {
    // Load files from sessionStorage on component initialization
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    if (savedFiles) {
      this.uploadedFiles = JSON.parse(savedFiles);
    }
  }

  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
    }

    // Save files to sessionStorage
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
      this.uploadedFiles = [];
      sessionStorage.removeItem('uploadedFiles');
    });
  }

  deleteFile(id): void {
    console.log('id', id);
    console.log(this.uploadedFiles);

    let fileToDelete;

    const savedFiles = sessionStorage.getItem('uploadedFiles');
    if (savedFiles) {
      this.uploadedFiles = JSON.parse(savedFiles);

      fileToDelete = this.uploadedFiles.find((item) => item.id == id);

      if (fileToDelete) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, {
          data: {
            title: `Delete ${fileToDelete.name} file`,
            body: 'Are you sure you want to delete this file?',
          },
        });
        this.modalRef.onClose.subscribe(() => {
          console.log('entrou no subscribe');
          this.uploadedFiles = this.uploadedFiles.filter(
            (item) => item.id !== id
          );
          sessionStorage.setItem(
            'uploadedFiles',
            JSON.stringify(this.uploadedFiles)
          );
        });
      }
    }
  }

  saveFilesToSession(): void {
    // Save the file metadata (name and size) into sessionStorage
    const fileMetadata = this.uploadedFiles.map((file) => {
      const randLetter = String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
      const uniqid = randLetter + Date.now();

      return {
        id: uniqid,
        name: file.name,
        size: file.size,
        type: file.type,
        imgURL: `../../../assets/img/files/${file.name.split('.')[1]}.png`,
      };
    });

    sessionStorage.setItem('uploadedFiles', JSON.stringify(fileMetadata));
  }

  logout(): void {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    console.log("userLoggedIn",userLoggedIn);
    if (userLoggedIn) {
      sessionStorage.removeItem('userLoggedIn');
      this.router.navigateByUrl('dashboard');
    }
  }
}
