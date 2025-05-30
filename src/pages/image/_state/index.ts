import { atomWithImmer } from 'jotai-immer';

import { OPEN_AI_IMAGE_MODELS } from '@/services/api';
export type ConversionRole = 'user' | 'assistant';

interface Conversation {
  message?: string;
  role: ConversionRole;
  images: { name: string; url: string }[];
}
interface ImagePageState {
  conversions: Conversation[];
  chatId: string;
}
export const imagePageState = atomWithImmer<ImagePageState>({ conversions: [], chatId: '' });

interface ImageLayoutState {
  currentModel: string;
}
export const imageLayoutState = atomWithImmer<ImageLayoutState>({
  currentModel: OPEN_AI_IMAGE_MODELS.dall_e_2,
});
