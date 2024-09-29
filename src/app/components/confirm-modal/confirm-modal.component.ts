import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  title: string | null = null;
  body: string | null = null;

  constructor(public modalRef: MdbModalRef<ConfirmModalComponent>) {}

  close(): void {
    this.modalRef.close(true);
  }
}
