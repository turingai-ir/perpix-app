import { atomWithImmer } from 'jotai-immer';

import { OPEN_AI_TEXT_MODELS } from '@/services/api';
export type ConversionRole = 'user' | 'assistant';

interface Conversation {
  content: string;
  role: ConversionRole;
}
interface TextPageState {
  conversions: Conversation[];
  chatId: string;
}
export const textPageState = atomWithImmer<TextPageState>({ conversions: [], chatId: '' });

interface TextLayoutState {
  currentModel: string;
}
export const textLayoutState = atomWithImmer<TextLayoutState>({
  currentModel: OPEN_AI_TEXT_MODELS.gpt_4o_mini,
});
