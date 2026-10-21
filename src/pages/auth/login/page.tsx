import { useState, type FC } from "react";

import { AuthFlow } from "@/features/auth";
import LoginShell from "./_components/login-shell";

const AuthLoginPage: FC = () => {
  const [celebrating, setCelebrating] = useState(false);
  const onAuthenticated = async () => {
    setCelebrating(true);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 5000));
  };

  return (
    <LoginShell celebrating={celebrating}>
      <AuthFlow onAuthenticated={onAuthenticated} />
    </LoginShell>
  );
};

export default AuthLoginPage;
