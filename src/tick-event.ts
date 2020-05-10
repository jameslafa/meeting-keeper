export class TickEvent {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  isExpired(): boolean {
    return this.hours === 0 && this.minutes === 0 && this.seconds === 0;
  }
}
