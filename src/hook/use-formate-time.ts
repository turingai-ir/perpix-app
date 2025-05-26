import { useAppTranslate } from '@/hook';

export function useFormateTime() {
  const { t } = useAppTranslate();

  const formate = (totalSeconds: number) => {
    const toLocalizedNumber = (num: number): string => num.toString();

    const labels = {
      day: t('common.day'),
      hour: t('common.hour'),
      minute: t('common.minute'),
      second: t('common.seconds'),
      and: t('common.and'),
    };

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    if (days > 0) parts.push(`${toLocalizedNumber(days)} ${labels.day}`);
    if (hours > 0) parts.push(`${toLocalizedNumber(hours)} ${labels.hour}`);
    if (minutes > 0) parts.push(`${toLocalizedNumber(minutes)} ${labels.minute}`);
    if (seconds > 0 || parts.length === 0)
      parts.push(`${toLocalizedNumber(seconds)} ${labels.second}`);

    return parts.join(` ${labels.and} `);
  };

  return { formate };
}
