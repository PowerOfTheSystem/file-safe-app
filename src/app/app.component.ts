
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'File Safe';
  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef) {
    
    // set idle parameters
    idle.setIdle(5); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(5); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
      console.log("IDLE");
    });

    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      console.log("NOT_IDLE");
      this.idleState = "NOT_IDLE";
      console.log(`${this.idleState} ${new Date()}`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => this.idleState = "TIMED_OUT");
    
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    console.log("NOT_IDLE 2");
    this.idleState = "NOT_IDLE";
    
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
  }

}
