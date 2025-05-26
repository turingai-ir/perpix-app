import { useCounter, useInterval } from '@mantine/hooks';

export function useCountdown(start: number, end: number = 0) {
  const [count, { set, decrement }] = useCounter(start, { min: end });
  const interval = useInterval(() => decrement(), 1000);

  const startCountdown = () => {
    set(start);
    interval.start();
  };

  const stopCountdown = () => interval.stop();

  const resetCountdown = () => {
    set(start);
    interval.stop();
  };

  return { count, startCountdown, stopCountdown, resetCountdown };
}
