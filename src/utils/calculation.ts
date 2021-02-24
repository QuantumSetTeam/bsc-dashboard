import BigNumber from 'bignumber.js';

export const SLIPPAGE = new BigNumber('0.02');

export function increaseWithSlippage(n) {
  return new BigNumber(n)
    .multipliedBy(new BigNumber(1).plus(SLIPPAGE))
    .integerValue(BigNumber.ROUND_FLOOR);
}

export function decreaseWithSlippage(n) {
  return new BigNumber(n)
    .multipliedBy(new BigNumber(1).minus(SLIPPAGE))
    .integerValue(BigNumber.ROUND_FLOOR);
}

export function epochformatted() {
  const epochStart = 1612008000;
  const epochPeriod = 4 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  if (new Date().getTime() / 1000 < epochStart) {
    return `0 - Starts at ${new Date(epochStart * 1000).toLocaleString()}`;
  }

  let epochRemainder = unixTimeSec - epochStart;
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `${epoch}-0${epochHour}:${
    epochMinute > 9 ? epochMinute : '0' + epochMinute.toString()
  }:${epochRemainder > 9 ? epochRemainder : '0' + epochRemainder.toString()}`;
}

export function epochformattedRemaining() {
  const epochStart = 1612008000;
  const epochPeriod = 4 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  if (new Date().getTime() / 1000 < epochStart) {
    return `0 - Starts at ${new Date(epochStart * 1000).toLocaleString()}`;
  }

  let epochRemainder = unixTimeSec - epochStart;
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  let epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  epochHour = 3 - epochHour;
  let epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  epochMinute = 59 - epochMinute;
  epochRemainder = 59 - epochRemainder;
  return `${epoch}-0${epochHour}:${
    epochMinute > 9 ? epochMinute : '0' + epochMinute.toString()
  }:${epochRemainder > 9 ? epochRemainder : '0' + epochRemainder.toString()}`;
}
