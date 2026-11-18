import { useNavigate } from "react-router";
import { useActiveSubscription, usePricingFeature } from "@/features/pricing";
import { useSignOutActions } from "@/features/auth";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";

export function useSidebarUserProfile() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const signOutActions = useSignOutActions();
  const activeSubscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();

  const planName =
    activeSubscriptionState.data?.plan.display_name ??
    t("features.pricing.plans.free.title");

  const navigateToProfile = () => {
    navigate(APP_ROUTES_KEY.profile.root.path);
  };

  const handleOpenPricing = () => {
    openPricingFeature();
  };

  const handleSignOut = () => {
    void signOutActions.signOut();
  };

  return {
    t,
    planName,
    navigateToProfile,
    handleOpenPricing,
    handleSignOut,
    isSignOutPending: signOutActions.isPending,
  };
}
