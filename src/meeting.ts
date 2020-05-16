import { MeetingStep } from './meeting-step';
import { tickListener } from './timer';
import { HumanReadableDuration, secondsToHumanReadableDuration } from './human-readable-duration';

export type stepChangeListener = () => void;

export class Meeting {
  private _steps: MeetingStep[];
  private _currentStepIdx: number;
  private _startedAt?: Date;
  private _finishedAt?: Date;

  private onTicklisteners: Set<tickListener>;
  private onStepChangeListeners: Set<stepChangeListener>;

  constructor(steps: MeetingStep[]) {
    this._steps = steps;
    this._currentStepIdx = 0;
    this.onTicklisteners = new Set();
    this.onStepChangeListeners = new Set();
  }

  // addStep adds a new step to the meeting.
  addStep(s: MeetingStep) {
    this._steps.push(s);
    this._currentStepIdx = 0;
  }

  // steps returns an array of all steps.
  steps(): MeetingStep[] {
    return this._steps;
  }

  // currentStep returns the current step.
  currentStep(): MeetingStep {
    return this._steps[this._currentStepIdx];
  }

  // startMeeting starts the meeting and the first step timer.
  startMeeting() {
    this._startedAt = new Date();
    this.startCurrentTimer();
  }

  // hasStarted returns true if the meeting has already started.
  hasStarted() {
    return this._startedAt !== undefined;
  }

  // stopMeeting stops the meeting.
  stopMeeting() {
    this._finishedAt = new Date();
  }

  // startCurrentTimer binds onTick events and resume the current step.
  // should be called when steps is started for the first time or after a change of step.
  startCurrentTimer() {
    this.onTicklisteners.forEach((l) => this.currentStep().timer().onTick(l));
    this.currentStep().timer().resume();
  }

  // stopCurrentTimer unbinds onTick events and pause the current step.
  // should be called when steps is stopped before a change of step.
  stopCurrentTimer() {
    this.onTicklisteners.forEach((l) => this.currentStep().timer().offTick(l));
    this.currentStep().timer().pause();
  }

  // resumeCurrentTimer resumes the current step timer after it has been paused.
  resumeCurrentTimer() {
    this.currentStep().timer().resume();
  }

  // pauseCurrentTimer pauses the current step timer.
  pauseCurrentTimer() {
    this.currentStep().timer().pause();
  }

  // nextStep jumps to the next step if available.
  nextStep() {
    if (this._currentStepIdx < this._steps.length - 1) {
      this.startStep(this._currentStepIdx + 1);
    }
  }

  // jumpToStep jumps to a specific steps identified by its id.
  jumpToStep(id: string) {
    const stepIdx = this._steps.findIndex((s) => s.id === id);
    if (stepIdx !== undefined) {
      this.startStep(stepIdx);
    }
  }

  // startStep starts a new step and make sure the previous one is stopped.
  startStep(stepIdx: number) {
    this.stopCurrentTimer();
    this._currentStepIdx = stepIdx;
    this.startCurrentTimer();
    this.onStepChangeListeners.forEach((l) => l());
  }

  // totalDuration returns a HumanReadableDuration of the duration of the entire meeting.
  totalDuration(): HumanReadableDuration {
    return secondsToHumanReadableDuration(this._steps.reduce((acc, step) => acc + step.timeInSeconds, 0));
  }

  // onTick register a new tickListener.
  onTick(f: tickListener) {
    this.onTicklisteners.add(f);
  }

  // onStepChange register a new stepChangeListener.
  onStepChange(f: stepChangeListener) {
    this.onStepChangeListeners.add(f);
  }
}
