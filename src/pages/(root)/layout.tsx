import type { FC } from "react";
import { Outlet } from "react-router";

import { AuthUnavailable } from "@/features/auth";
import { PaymentEventsProvider } from "@/features/payment";
import { useRootLayout } from "@/app/hooks/use-root-layout";

const RootLayout: FC = () => {
  const { authStatus, pageTitle } = useRootLayout();

  return (
    <>
      <title>{pageTitle}</title>
      <PaymentEventsProvider />
      {authStatus === "unavailable" ? <AuthUnavailable /> : <Outlet />}
    </>
  );
};

export default RootLayout;
