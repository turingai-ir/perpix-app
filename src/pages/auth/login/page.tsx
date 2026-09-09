import type { FC } from "react";

import { AuthFlow } from "@/features/auth";
import LoginShell from "./_components/login-shell";

const AuthLoginPage: FC = () => (
  <LoginShell>
    <AuthFlow />
  </LoginShell>
);

export default AuthLoginPage;