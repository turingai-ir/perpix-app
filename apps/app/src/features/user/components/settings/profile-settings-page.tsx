import type { FC } from "react";

import ErrorSection from "@/shared/components/error-section";
import LoadingSection from "@/shared/components/loading-section";
import { useProfileSettings } from "../../hooks/use-profile-settings";
import { IdentityHero } from "./identity-hero";
import { PersonalInfoForm } from "./personal-info-form";
import { AccountGlance } from "./account-glance";
import { PasswordSecurity } from "./password-security";

export const ProfileSettingsPage: FC = () => {
  const { userState, editState, form, onSubmit } = useProfileSettings();

  if (userState.isError) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <ErrorSection onRetry={() => userState.refetch()} />
      </div>
    );
  }

  if (!userState.data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <IdentityHero user={userState.data} />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <PersonalInfoForm
          form={form}
          isPending={editState.isPending}
          onSubmit={onSubmit}
        />
        <AccountGlance />
      </div>
      <div className="mt-6">
        <PasswordSecurity />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
