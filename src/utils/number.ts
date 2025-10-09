import { jotaiStore } from '@/main';
import { globalAtom } from '@/state';

export const microDollarToToken = (amount: number) => amount / 1_000;

type FormatLocalizedNumberParams = {
  value: number;
};

export function formatLocalizedNumber({ value }: FormatLocalizedNumberParams) {
  if (typeof value !== 'number') {
    return '';
  }

  return new Intl.NumberFormat(jotaiStore.get(globalAtom).language, {
    maximumFractionDigits: 0,
  }).format(value);
}
