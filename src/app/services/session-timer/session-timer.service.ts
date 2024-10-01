import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { TimeoutWarningModalComponent } from 'src/app/shared/components/timeout-warning-modal/timeout-warning-modal.component';

@Injectable({
  providedIn: 'root',
})
export class SessionTimerService {
  idleState = 'Not started';
  timedOut = false;
  lastPing?: Date = null;
  countdownModalOpen = false;
  modalRef: MdbModalRef<TimeoutWarningModalComponent> | null = null;

  constructor(
    private idle: Idle,
    private router: Router,
    private modalService: MdbModalService
  ) {
    // Initialize the session timer to 5 minutes
    this.idle.setIdle(300);
    // Initialize the countdown timer after the 5 minutes have passed
    this.idle.setTimeout(30);

    // Initialize the session timer to 5 minutes
    // this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Detects activity and resets the timer
    this.idle.onIdleEnd.subscribe(() => {
      this.resetTimer();
    });

    // Initizalizes the countdown opening the TimeoutWarningModal
    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      if (!this.countdownModalOpen) {
        this.countdownModalOpen = true;

        this.modalRef = this.modalService.open(TimeoutWarningModalComponent, {
          data: { countdown: countdown },
          backdrop: true,
          ignoreBackdropClick: false,
        });

        // If the result from the TimeoutWarningModal is true, the timer resets, otherwise we logout the user
        this.modalRef.onClose.subscribe((result: boolean) => {
          this.countdownModalOpen = false;

          if (result || result === undefined) {
            this.resetTimer();
          } else {
            this.logout();
          }
        });
      }
    });

    // Initializes the timer
    this.resetTimer();
  }

  // Initializes the timer
  resetTimer() {
    this.idle.watch();
    this.idleState = 'Started watching for inactivity.';
    this.timedOut = false;
  }

  // Clear the userLoggedIn object from the sessionStorage and navigates the user to the login
  logout() {
    sessionStorage.removeItem('userLoggedIn');
    this.router.navigateByUrl('login');
  }
}
