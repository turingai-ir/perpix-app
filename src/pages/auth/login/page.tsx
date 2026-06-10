import { Activity, type FC } from "react";
import { useImmerAtom } from "jotai-immer";

import authLoginPageState from "./_state";
import AuthLoginPageStart from "./_components/start";
import AuthLoginPageEnterPassword from "./_components/enter-password";
import AuthLoginPageSetPassword from "./_components/set-password";

const AuthLoginPage: FC = () => {
  const [pageState] = useImmerAtom(authLoginPageState);

  return (
    <div className="relative flex h-dvh w-full items-center justify-center p-4">
      <Activity mode={pageState.currentView === "START" ? "visible" : "hidden"}>
        <AuthLoginPageStart />
      </Activity>
      <Activity
        mode={pageState.currentView === "PASSWORD" ? "visible" : "hidden"}
      >
        <AuthLoginPageEnterPassword />
      </Activity>
      <Activity
        mode={pageState.currentView === "SET_PASSWORD" ? "visible" : "hidden"}
      >
        <AuthLoginPageSetPassword />
      </Activity>
    </div>
  );
};

export default AuthLoginPage;
