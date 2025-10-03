import type { FC } from 'react';
import { useImmerAtom } from 'jotai-immer';

import authLoginPageState from './_state';
import AuthLoginPageStart from './_components/start';
import AuthLoginPageEnterPassword from './_components/enter-password';
import AuthLoginPageSetPassword from './_components/set-password';

const AuthLoginPage: FC = () => {
  const [pageState] = useImmerAtom(authLoginPageState);

  return (
    <div className="w-full h-dvh flex justify-center items-center p-4 relative">
      {pageState.currentView === 'START' ? <AuthLoginPageStart /> : null}
      {pageState.currentView === 'PASSWORD' ? <AuthLoginPageEnterPassword /> : null}
      {pageState.currentView === 'SET_PASSWORD' ? <AuthLoginPageSetPassword /> : null}
    </div>
  );
};

export default AuthLoginPage;
