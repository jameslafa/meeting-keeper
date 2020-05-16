import { HumanReadableDuration } from './human-readable-duration';

export class TickEvent {
  time: HumanReadableDuration;

  constructor(hours: number, minutes: number, seconds: number) {
    this.time = { hours, minutes, seconds };
  }

  isExpired(): boolean {
    return this.time.hours === 0 && this.time.minutes === 0 && this.time.seconds === 0;
  }
}
