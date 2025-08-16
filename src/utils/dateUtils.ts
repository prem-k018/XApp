export function timeToPresent(initialTime: Date): string {
  const utc1 = new Date(initialTime.toUTCString());
  const utc2 = new Date(new Date().toUTCString());
  let timeSince = Math.abs(utc2 - utc1) / 1000;

  if (timeSince < 60) {
    return Math.floor(timeSince) + ' sec';
  }

  timeSince /= 60;

  if (timeSince < 60) {
    return Math.floor(timeSince) + ' min';
  }

  timeSince /= 60;

  if (timeSince < 24) {
    return (
      Math.floor(timeSince) + (Math.floor(timeSince) === 1 ? ' hr' : ' hrs')
    );
  }

  timeSince /= 24;

  if (timeSince < 365) {
    return Math.floor(timeSince) + ' d';
  }

  timeSince /= 365.25;
  return Math.floor(timeSince) + ' y';
}
