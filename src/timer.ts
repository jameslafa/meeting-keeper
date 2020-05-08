interface TickEvent {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerEvents {
  tick(t: TickEvent): void;
  expires(): void;
}

class Timer {
  private remainingSeconds: number;
  private running: boolean;
  private timer?: number; // timer for the ticker

  // listeners
  private onTicklisteners: Set<TimerEvents['tick']>;
  private onExpireslisteners: Set<TimerEvents['expires']>;

  constructor(seconds: number) {
    this.remainingSeconds = seconds;
    this.running = false;
    this.onTicklisteners = new Set();
    this.onExpireslisteners = new Set();
  }

  onTick(f: TimerEvents['tick']) {
    this.onTicklisteners.add(f);
  }

  offTick(f: TimerEvents['tick']): void {
    this.onTicklisteners.delete(f);
  }

  onExpires(f: TimerEvents['expires']) {
    this.onExpireslisteners.add(f);
  }

  offExpires(f: TimerEvents['expires']): void {
    this.onExpireslisteners.delete(f);
  }

  resume() {
    this.running = true;

    const tick = () => {
      const now = Date.now();
      if (this.onTicklisteners.size > 0) {
        const hours = Math.floor(this.remainingSeconds / (60 * 60));
        const minutes = Math.floor((this.remainingSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(this.remainingSeconds % 60);
        this.onTicklisteners.forEach((listener) => listener({ hours, minutes, seconds }));
      }
      if (this.remainingSeconds < 1) {
        this.onExpireslisteners.forEach((listener) => listener());
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
