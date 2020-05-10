import { MeetingStep } from './meeting-step';
import { Meeting } from './meeting';
import { TickEvent } from './tick-event';

function updateTimer(t: TickEvent) {
  document.getElementById('hours').innerText = String(t.hours);
  document.getElementById('minutes').innerText = String(t.minutes);
  document.getElementById('seconds').innerText = String(t.seconds);
}

window.onload = () => {
  const steps: MeetingStep[] = [];
  steps.push(new MeetingStep('Introduction', 5));
  steps.push(new MeetingStep('Product comprehension', 10));

  const meeting = new Meeting(steps);
  meeting.onTick((t): void => {
    updateTimer(t);
    if (t.isExpired()) {
      console.log('expired');
      setTimeout(() => meeting.nextStep(), 1000);
    }
  });
  meeting.start();
};
