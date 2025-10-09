import { atom } from 'jotai';

interface AuthLoginPageState {
  currentView: 'START' | 'PASSWORD' | 'SET_PASSWORD';
  mobile: string;
  tempToken: string;
}
const authLoginPageState = atom<AuthLoginPageState>({
  currentView: 'START',
  mobile: '',
  tempToken: '',
});

export default authLoginPageState;
