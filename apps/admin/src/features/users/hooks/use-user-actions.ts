import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";
import {
  banUser,
  unbanUser,
  revokeSession,
  revokeAllSessions,
  hardDeleteUser,
} from "../services/users-service";

export function useUserActions(userUuid?: string) {
  const queryClient = useQueryClient();
  const { t } = useAppTranslate();

  const banMutation = useMutation({
    mutationFn: ({ uuid, reason }: { uuid: string; reason?: string }) =>
      banUser(uuid, reason),
    onSuccess: () => {
      toast.success(
        t("features.users.actions.banSuccess", {
          defaultValue: "کاربر با موفقیت مسدود شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.users.actions.banError", {
            defaultValue: "مسدودسازی کاربر با خطا مواجه شد.",
          }),
      );
    },
  });

  const unbanMutation = useMutation({
    mutationFn: ({ uuid, reason }: { uuid: string; reason?: string }) =>
      unbanUser(uuid, reason),
    onSuccess: () => {
      toast.success(
        t("features.users.actions.unbanSuccess", {
          defaultValue: "مسدودیت کاربر با موفقیت رفع شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.users.actions.unbanError", {
            defaultValue: "رفع مسدودیت کاربر با خطا مواجه شد.",
          }),
      );
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: ({
      uuid,
      sessionUuid,
      reason,
    }: {
      uuid: string;
      sessionUuid: string;
      reason?: string;
    }) => revokeSession(uuid, sessionUuid, reason),
    onSuccess: () => {
      toast.success(
        t("features.users.actions.revokeSessionSuccess", {
          defaultValue: "نشست با موفقیت لغو شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.users.actions.revokeSessionError", {
            defaultValue: "لغو نشست با خطا مواجه شد.",
          }),
      );
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: ({ uuid, reason }: { uuid: string; reason?: string }) =>
      revokeAllSessions(uuid, reason),
    onSuccess: () => {
      toast.success(
        t("features.users.actions.revokeAllSessionsSuccess", {
          defaultValue: "تمام نشست‌های کاربر با موفقیت لغو شدند.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.users.actions.revokeAllSessionsError", {
            defaultValue: "لغو نشست‌های کاربر با خطا مواجه شد.",
          }),
      );
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: ({ phoneNumber }: { phoneNumber: string }) =>
      hardDeleteUser(phoneNumber),
    onSuccess: () => {
      toast.success(
        t("features.users.actions.deleteSuccess", {
          defaultValue: "کاربر با موفقیت به طور دائمی حذف شد.",
        }),
      );
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          t("features.users.actions.deleteError", {
            defaultValue: "حذف کاربر با خطا مواجه شد.",
          }),
      );
    },
  });

  return {
    banUser: (reason?: string) => {
      if (!userUuid) return Promise.reject(new Error("User UUID required"));
      return banMutation.mutateAsync({ uuid: userUuid, reason });
    },
    unbanUser: (reason?: string) => {
      if (!userUuid) return Promise.reject(new Error("User UUID required"));
      return unbanMutation.mutateAsync({ uuid: userUuid, reason });
    },
    revokeSession: (sessionUuid: string, reason?: string) => {
      if (!userUuid) return Promise.reject(new Error("User UUID required"));
      return revokeSessionMutation.mutateAsync({
        uuid: userUuid,
        sessionUuid,
        reason,
      });
    },
    revokeAllSessions: (reason?: string) => {
      if (!userUuid) return Promise.reject(new Error("User UUID required"));
      return revokeAllSessionsMutation.mutateAsync({ uuid: userUuid, reason });
    },
    hardDeleteUser: (phoneNumber: string) => {
      return hardDeleteMutation.mutateAsync({ phoneNumber });
    },
    isBanning: banMutation.isPending,
    isUnbanning: unbanMutation.isPending,
    isRevokingSession: revokeSessionMutation.isPending,
    isRevokingAll: revokeAllSessionsMutation.isPending,
    isDeleting: hardDeleteMutation.isPending,
  };
}
