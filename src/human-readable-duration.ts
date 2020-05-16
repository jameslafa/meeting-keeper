// HumanReadableDuration represents a duration in something most humans would
// prefer to read (hours, minutes and seconds).
export interface HumanReadableDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

// secondsToHumanReadableDuration converts a number of second to a HumanReadableDuration.
export function secondsToHumanReadableDuration(s: number): HumanReadableDuration {
  const hours = Math.floor(s / (60 * 60));
  const minutes = Math.floor((s % (60 * 60)) / 60);
  const seconds = Math.floor(s % 60);
  return { hours, minutes, seconds };
}

// humanReadableDurationToString converts a HumanReadableDuration to a string XXhXXmXXs
export function humanReadableDurationToString(h: HumanReadableDuration) {
  const s = [];
  if (h.hours > 0) {
    s.push(h.hours.toString() + 'h');
  }
  if (h.hours > 0 || h.minutes > 0) {
    s.push(h.minutes.toString() + 'm');
  }
  s.push(h.seconds.toString() + 's');
  return s.join(' ');
}
