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
function updateSteps(meeting: Meeting) {
  const domElements = [];
  for (let i = 0; i < meeting.steps().length; i++) {
    const step = meeting.steps()[i];
    const elemClass = step.id === meeting.currentStep().id ? 'step active' : 'step';
    domElements[i] = `<div class="${elemClass}" id="${step.id}">${step.name} [${step.timeInSeconds} sec]</div>`;
  }
  document.getElementById('steps')!.innerHTML = domElements.join('\n');

  for (const step of meeting.steps()) {
    const btnElt = document.getElementById(step.id);
    if (btnElt) {
      btnElt.addEventListener('click', () => jumpToStep(meeting, step.id));
    }
  }
}

// jumpToStep jump to the step identified by stepId.
function jumpToStep(meeting: Meeting, stepId: string) {
  meeting.jumpToStep(stepId);
}

// setupControls binds controls click event.
function setupControls(meeting: Meeting) {
  const resumeElt = document.getElementById('resume');
  if (resumeElt) {
    resumeElt.addEventListener('click', () => {
      if (!meeting.hasStarted()) {
        resumeElt.innerText = 'resume';
        meeting.startMeeting();
      } else {
        meeting.resumeCurrentTimer();
      }
    });
  }

  const pauseElt = document.getElementById('pause');
  if (pauseElt) {
    pauseElt.addEventListener('click', () => meeting.pauseCurrentTimer());
  }
}

window.onload = () => {
  // keep the last tickEvent to update only changed values
  let lastTickEvent = new TickEvent(0, 0, 0);

  // create the meeting with the respective steps
  // TODO: load this from a JSON instead of hardcoding values
  const steps: MeetingStep[] = [];
  steps.push(new MeetingStep('Introduction', 10));
  steps.push(new MeetingStep('Product comprehension', 20));
  const meeting = new Meeting(steps);

  // display the current steps
  updateSteps(meeting);

  // setup control buttons
  setupControls(meeting);

  // subcribe to tick event to update timer values
  meeting.onTick((t): void => {
    console.debug('new tick', t);
    updateTimer(t, lastTickEvent);
    if (t.isExpired()) {
      setTimeout(() => meeting.nextStep(), 1000);
    }
    lastTickEvent = t;
  });

  // subscribe to step changes to update the step list
  meeting.onStepChange(() => {
    console.debug('step changed');
    updateSteps(meeting);
  });
};
