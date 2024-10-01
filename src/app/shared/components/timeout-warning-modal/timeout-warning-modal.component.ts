import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-timeout-warning-modal',
  standalone: true,
  imports: [],
  templateUrl: './timeout-warning-modal.component.html',
  styleUrl: './timeout-warning-modal.component.scss',
})
export class TimeoutWarningModalComponent {
  countdown: number;
  private intervalId: any;

  constructor(public modalRef: MdbModalRef<TimeoutWarningModalComponent>) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Initialize the countdown
  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.intervalId);
        this.modalRef.close(false);
      }
    }, 1000);
  }

  // Clear the interval
  continueSession(): void {
    clearInterval(this.intervalId);
    this.modalRef.close(true);
  }
}
