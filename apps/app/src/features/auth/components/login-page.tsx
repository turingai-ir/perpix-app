import { useState, type FC } from "react";

import { AuthFlow } from "./auth-flow";
import LoginShell from "./login-shell";

export const LoginPage: FC = () => {
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

export default LoginPage;
