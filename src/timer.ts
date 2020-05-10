import { TickEvent } from './tick-event';

export type tickListener = (t: TickEvent) => void;
export class Timer {
  private remainingSeconds: number;
  private running: boolean;
  private timer?: number; // timer for the ticker

  // listeners
  private onTicklisteners: Set<tickListener>;

  constructor(seconds: number) {
    this.remainingSeconds = seconds;
    this.running = false;
    this.onTicklisteners = new Set();
  }

  onTick(f: tickListener) {
    this.onTicklisteners.add(f);
  }

  offTick(f: tickListener): void {
    this.onTicklisteners.delete(f);
  }

  resume() {
    this.running = true;

    const tick = () => {
      const now = Date.now();
      if (this.onTicklisteners.size > 0) {
        const hours = Math.floor(this.remainingSeconds / (60 * 60));
        const minutes = Math.floor((this.remainingSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(this.remainingSeconds % 60);
        this.onTicklisteners.forEach((listener) => listener(new TickEvent(hours, minutes, seconds)));
      }
      if (this.remainingSeconds < 1) {
        this.pause();
      } else {
        this.remainingSeconds -= 1;
        this.timer = setTimeout(tick, now + 1000 - Date.now());
      }
    };

    tick();
  }

  pause() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
  }

  isRunning?() {
    return this.running;
  }
}
