import { atomWithImmer } from 'jotai-immer';

interface AuthLoginPageState {
  currentView: 'START' | 'PASSWORD' | 'SET_PASSWORD';
  mobile: string;
  tempToken: string;
}
const authLoginPageState = atomWithImmer<AuthLoginPageState>({
  currentView: 'START',
  mobile: '',
  tempToken: '',
});

export default authLoginPageState;
