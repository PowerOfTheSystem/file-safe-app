import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { SessionTimerService } from 'src/app/services/session-timer/session-timer.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { UserFiles } from 'src/app/models/user-files';
import { File } from 'src/app/models/file';

@Component({
  selector: 'app-file-list',
  standalone:true,
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  imports: [CommonModule],
})
export class FileListComponent {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  router = inject(Router);
  userLoggedInUploadedFiles: File[] = [];
  currentUploadingFiles: File[] = [];
  userLoggedIn: User = null;
  modalRef: MdbModalRef<ConfirmModalComponent> | null = null;

  constructor(
    private modalService: MdbModalService,
    private sessionTimerService: SessionTimerService,
    public toastr: ToastrService
  ) {}


  ngOnInit(): void {
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    const user = sessionStorage.getItem('userLoggedIn');

    if (user) {
      this.userLoggedIn = JSON.parse(user);
    }

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

    this.modalRef.onClose.subscribe((result: boolean) => {
      if (result) {
        const savedFiles = sessionStorage.getItem('uploadedFiles');
        let userFiles: UserFiles[] = savedFiles ? JSON.parse(savedFiles) : [];

        userFiles = userFiles.filter(
          (userFile) => userFile.email !== this.userLoggedIn.email
        );

        sessionStorage.setItem('uploadedFiles', JSON.stringify(userFiles));

        this.userLoggedInUploadedFiles = [];

        this.toastr.success('All files successfully removed.');
      }
    });
  }

  deleteFile(id: string): void {
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    if (savedFiles) {
      let userFiles: UserFiles[] = JSON.parse(savedFiles);

      const userFileEntry = userFiles.find(
        (entry) => entry.email === this.userLoggedIn.email
      );

      if (userFileEntry) {
        const fileToDelete = userFileEntry.files.find((file) => file.id === id);

        if (fileToDelete) {
          this.modalRef = this.modalService.open(ConfirmModalComponent, {
            data: {
              title: `Delete [${fileToDelete.name}] file`,
              body: 'Are you sure you want to delete this file?',
            },
          });

          this.modalRef.onClose.subscribe((result: boolean) => {
            if (result) {
              userFileEntry.files = userFileEntry.files.filter(
                (file) => file.id !== id
              );

              if (userFileEntry.files.length === 0) {
                userFiles = userFiles.filter(
                  (entry) => entry.email !== this.userLoggedIn.email
                );
              }

              sessionStorage.setItem(
                'uploadedFiles',
                JSON.stringify(userFiles)
              );

              this.userLoggedInUploadedFiles = userFileEntry.files;

              this.toastr.success('File successfully removed.');
            }
          });
        }
      }
    }
  }

  saveFilesToSession(): void {
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

    const savedFiles = sessionStorage.getItem('uploadedFiles');
    let userFiles: UserFiles[] = savedFiles ? JSON.parse(savedFiles) : [];

    const userFileEntry = userFiles.find(
      (entry) => entry.email === this.userLoggedIn.email
    );

    if (userFileEntry) {
      userFileEntry.files = userFileEntry.files.concat(uploadFiles);
    } else {
      userFiles.push({
        email: this.userLoggedIn.email,
        files: uploadFiles,
      });
    }

    sessionStorage.setItem('uploadedFiles', JSON.stringify(userFiles));
    this.userLoggedInUploadedFiles = userFileEntry
      ? userFileEntry.files
      : uploadFiles;

    this.sessionTimerService.resetTimer();

    const alertMessage =
      this.currentUploadingFiles.length === 1
        ? 'File successfully uploaded.'
        : 'Files successfully uploaded.';

    this.toastr.success(alertMessage);
    this.resetFileInput();
  }

  resetFileInput() {
    this.currentUploadingFiles = [];
    this.fileInput.nativeElement.value = null;
  }
}