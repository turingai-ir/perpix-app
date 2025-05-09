import { atom } from 'jotai'

import { loadAtom, saveAtom } from '../utils/db'
import { APP_KEYS } from '../utils/app-keys'

const STORAGE = APP_KEYS.DB.STORGES.globalState
const ATOM_KEY = 'globalState'

const baseAtom = atom<number>(0)

export const globalState = atom(
  async () => {
    const value = await loadAtom<number>(STORAGE, ATOM_KEY)
    return value ?? 0
  },
  async (_get, set, newValue: number) => {
    set(baseAtom, newValue)
    await saveAtom(STORAGE, ATOM_KEY, newValue)
  },
)
