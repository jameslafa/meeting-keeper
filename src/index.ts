import { MeetingStep } from './meeting-step';
import { Meeting } from './meeting';
import { humanReadableDurationToString, HumanReadableDuration } from './human-readable-duration';

// updateTimer updates the timer values on the page.
// lastTickEvent is used to update only elements which have changed.
function updateTimer(newTime: HumanReadableDuration, lastTime: HumanReadableDuration) {
  const pad = (n: number): string => {
    return String(n).padStart(2, '0');
  };
  if (newTime.hours !== lastTime.hours) {
    document.getElementById('hours')!.innerText = pad(newTime.hours);
  }
  if (newTime.minutes !== lastTime.minutes) {
    document.getElementById('minutes')!.innerText = pad(newTime.minutes);
  }
  if (newTime.seconds !== lastTime.seconds) {
    document.getElementById('seconds')!.innerText = pad(newTime.seconds);
  }
}

// updateSteps update the list of steps displayed on the page.
function updateSteps(meeting: Meeting) {
  const domElements = [];
  for (let i = 0; i < meeting.steps().length; i++) {
    const step = meeting.steps()[i];
    const elemClass = step.id === meeting.currentStep().id ? 'step active' : 'step';
    domElements[i] = `<div class="${elemClass}" id="${step.id}">${
      step.name
    } <span class="duration">${humanReadableDurationToString(step.humanReadableDuration())}</span></div>`;
  }
  document.getElementById('steps')!.innerHTML = domElements.join('\n');

  for (const step of meeting.steps()) {
    const btnElt = document.getElementById(step.id);
    if (btnElt) {
      btnElt.addEventListener('click', () => {
        jumpToStep(meeting, step.id);
        return false;
      });
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
        resumeElt.innerText = 'RESUME';
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
  // create the meeting with the respective steps
  // TODO: load this from a JSON instead of hardcoding values
  const steps: MeetingStep[] = [];
  steps.push(new MeetingStep('Introduction', 300));
  steps.push(new MeetingStep('Product understanding', 600));
  steps.push(new MeetingStep('Present team and stack', 300));
  steps.push(new MeetingStep('Introduction candidate', 300));
  steps.push(new MeetingStep("Candidate's ideal position", 300));
  steps.push(new MeetingStep("Candidate's questions", 600));
  steps.push(new MeetingStep("Process' next steps", 300));
  const meeting = new Meeting(steps);

  let lastTimeDuration = { hours: 0, minutes: 0, seconds: 0 };
  // keep the last tickEvent to update only changed values
  updateTimer(meeting.currentStep().humanReadableDuration(), lastTimeDuration);

  // display the current steps
  updateSteps(meeting);

  // setup control buttons
  setupControls(meeting);

  // subcribe to tick event to update timer values
  meeting.onTick((t): void => {
    console.debug('new tick', t);
    updateTimer(t.time, lastTimeDuration);
    if (t.isExpired()) {
      setTimeout(() => meeting.nextStep(), 1000);
    }
    lastTimeDuration = t.time;
  });

  // subscribe to step changes to update the step list
  meeting.onStepChange(() => {
    console.debug('step changed');
    updateSteps(meeting);
  });
};
