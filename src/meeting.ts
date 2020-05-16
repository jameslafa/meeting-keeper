import { MeetingStep } from './meeting-step';
import { tickListener } from './timer';

export type stepChangeListener = () => void;

export class Meeting {
  private steps: MeetingStep[];
  private currentStepIdx: number;
  private startedAt?: Date;
  private finishedAt?: Date;

  private onTicklisteners: Set<tickListener>;
  private onStepChangeListeners: Set<stepChangeListener>;

  constructor(steps: MeetingStep[]) {
    this.steps = steps;
    this.currentStepIdx = 0;
    this.onTicklisteners = new Set();
    this.onStepChangeListeners = new Set();
  }

  addStep(s: MeetingStep) {
    this.steps.push(s);
    this.currentStepIdx = 0;
  }

  currentStep(): MeetingStep {
    return this.steps[this.currentStepIdx];
  }

  start() {
    this.startedAt = new Date();
    this.resume();
  }

  stop() {
    this.finishedAt = new Date();
  }

  resume() {
    this.onTicklisteners.forEach((l) => this.currentStep().timer().onTick(l));
    this.currentStep().timer().resume();
  }

  nextStep() {
    if (this.currentStepIdx < this.steps.length - 1) {
      this.onTicklisteners.forEach((l) => this.currentStep().timer().offTick(l));
      this.currentStepIdx++;
      this.resume();
      this.onStepChangeListeners.forEach((l) => l());
    }
  }

  onTick(f: tickListener) {
    this.onTicklisteners.add(f);
  }

  onStepChange(f: stepChangeListener) {
    this.onStepChangeListeners.add(f);
  }
}
