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
    this.idle.setIdle(300);
    this.idle.setTimeout(30);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.resetTimer();
    });

    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      this.idleState = `You will time out in ${countdown} seconds!`;

      if (!this.countdownModalOpen) {
        this.countdownModalOpen = true;

        this.modalRef = this.modalService.open(TimeoutWarningModalComponent, {
          data: { countdown: countdown },
          backdrop: true,
          ignoreBackdropClick: false,
        });

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

    this.resetTimer();
  }

  resetTimer() {
    this.idle.watch();
    this.idleState = 'Started watching for inactivity.';
    this.timedOut = false;
  }

  logout() {
    sessionStorage.removeItem('userLoggedIn');
    this.router.navigateByUrl('login');
  }
}
