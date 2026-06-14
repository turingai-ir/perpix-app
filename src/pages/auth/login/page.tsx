import { Activity, type FC } from "react";
import { useImmerAtom } from "jotai-immer";

import authLoginPageState from "./_state";
import AuthLoginPageStart from "./_components/start";
import AuthLoginPageEnterPassword from "./_components/enter-password";
import AuthLoginPageSetPassword from "./_components/set-password";

const AuthLoginPage: FC = () => {
  const [pageState] = useImmerAtom(authLoginPageState);

  return (
    <div className="grid h-dvh w-full place-items-center p-4">
      <div
        className={
          pageState.currentView === "START"
            ? "col-start-1 row-start-1 flex w-full justify-center"
            : "hidden"
        }
      >
        <Activity
          mode={pageState.currentView === "START" ? "visible" : "hidden"}
        >
          <AuthLoginPageStart />
        </Activity>
      </div>
      <div
        className={
          pageState.currentView === "PASSWORD"
            ? "col-start-1 row-start-1 flex w-full justify-center"
            : "hidden"
        }
      >
        <Activity
          mode={pageState.currentView === "PASSWORD" ? "visible" : "hidden"}
        >
          <AuthLoginPageEnterPassword />
        </Activity>
      </div>
      <div
        className={
          pageState.currentView === "SET_PASSWORD"
            ? "col-start-1 row-start-1 flex w-full justify-center"
            : "hidden"
        }
      >
        <Activity
          mode={pageState.currentView === "SET_PASSWORD" ? "visible" : "hidden"}
        >
          <AuthLoginPageSetPassword />
        </Activity>
      </div>
    </div>
  );
};

export default AuthLoginPage;
