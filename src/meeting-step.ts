import { Timer } from './timer';

export class MeetingStep {
  name: string;
  private stepTimer: Timer;

  constructor(name: string, timeInSeconds: number) {
    this.name = name;
    this.stepTimer = new Timer(timeInSeconds);
  }

  timer(): Timer {
    return this.stepTimer;
  }
}
