import { MeetingStep } from './meeting-step';
import { Meeting } from './meeting';
import { TickEvent } from './tick-event';

// updateTimer updates the timer values on the page.
// lastTickEvent is used to update only elements which have changed.
function updateTimer(newTickEvent: TickEvent, lastTickEvent: TickEvent) {
  const pad = (n: number): string => {
    return String(n).padStart(2, '0');
  };
  if (newTickEvent.hours !== lastTickEvent.hours) {
    document.getElementById('hours')!.innerText = pad(newTickEvent.hours);
  }
  if (newTickEvent.minutes !== lastTickEvent.minutes) {
    document.getElementById('minutes')!.innerText = pad(newTickEvent.minutes);
  }
  if (newTickEvent.seconds !== lastTickEvent.seconds) {
    document.getElementById('seconds')!.innerText = pad(newTickEvent.seconds);
  }
}

// updateSteps update the list of steps displayed on the page.
// currentStep is used to mark the current step as active.
function updateSteps(steps: MeetingStep[], currentStep: MeetingStep) {
  const domElements = [];
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    const elemClass = step.id === currentStep.id ? 'step active' : 'step';
    domElements[i] = `<div class="${elemClass}" id="${step.id}">${step.name} [${step.timeInSeconds} sec]</div>`;
  }
  document.getElementById('steps')!.innerHTML = domElements.join('\n');
}

window.onload = () => {
  // keep the last tickEvent to update only changed values
  let lastTickEvent = new TickEvent(0, 0, 0);

  // create the meeting with the respective steps
  // TODO: load this from a JSON instead of hardcoding values
  const steps: MeetingStep[] = [];
  steps.push(new MeetingStep('Introduction', 5));
  steps.push(new MeetingStep('Product comprehension', 10));
  const meeting = new Meeting(steps);

  // display the current steps
  updateSteps(steps, meeting.currentStep());

  // subcribe to tick event to update timer values
  meeting.onTick((t): void => {
    updateTimer(t, lastTickEvent);
    if (t.isExpired()) {
      setTimeout(() => meeting.nextStep(), 1000);
    }
    lastTickEvent = t;
  });

  // subscribe to step changes to update the step list
  meeting.onStepChange(() => {
    updateSteps(steps, meeting.currentStep());
  });

  // start the meeting
  // TODO: should be initiated by a button click
  meeting.start();
};
