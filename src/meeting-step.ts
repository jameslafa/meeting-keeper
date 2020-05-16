import { Timer } from './timer';
import { randomID } from './helper';
import { HumanReadableDuration, secondsToHumanReadableDuration } from './human-readable-duration';

export class MeetingStep {
  id: string;
  name: string;
  timeInSeconds: number;
  private stepTimer: Timer;

  // create a new MeetingStep. If `id` is immited, we generate a random one.
  constructor(name: string, timeInSeconds: number, id?: string) {
    this.name = name;
    this.timeInSeconds = timeInSeconds;
    this.stepTimer = new Timer(timeInSeconds);
    this.id = id !== undefined ? id : randomID();
  }

  timer(): Timer {
    return this.stepTimer;
  }

  humanReadableDuration(): HumanReadableDuration {
    return secondsToHumanReadableDuration(this.timeInSeconds);
  }
}
