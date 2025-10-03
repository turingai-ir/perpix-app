import { useEffect, useState } from 'react';

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatSeconds(totalSeconds: number) {
  const sign = totalSeconds < 0 ? '-' : '';
  const abs = Math.abs(Math.floor(totalSeconds));
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  return `${sign}${minutes}:${pad(seconds)}`;
}

export function useSecondsCountDown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      return () => {};
    }
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return { formatted: formatSeconds(seconds), seconds, setSeconds };
}
