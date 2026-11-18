import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  revokeUserSession,
  revokeApiToken,
} from "../services/security-service";

export function useSecurityActions() {
  const queryClient = useQueryClient();
  const [isRevokingSession, setIsRevokingSession] = useState(false);
  const [isRevokingToken, setIsRevokingToken] = useState(false);

  const handleRevokeSession = async (userUuid: string, sessionUuid: string) => {
    setIsRevokingSession(true);
    try {
      await revokeUserSession(userUuid, sessionUuid);
      toast.success("نشست کاربر با موفقیت لغو شد.");
      void queryClient.invalidateQueries({
        queryKey: ["get", "/api/admin/v1/auth/sessions"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["get", "/api/admin/v1/auth/reports/sessions"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["get", "/api/admin/v1/auth/users/{user_uuid}/sessions"],
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "خطا در لغو نشست کاربر.",
      );
      throw err;
    } finally {
      setIsRevokingSession(false);
    }
  };

  const handleRevokeToken = async (tokenUuid: string) => {
    setIsRevokingToken(true);
    try {
      await revokeApiToken(tokenUuid);
      toast.success("توکن API با موفقیت ابطال شد.");
      void queryClient.invalidateQueries({
        queryKey: ["get", "/api/admin/v1/auth/api-tokens"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["get", "/api/admin/v1/auth/reports/api-tokens"],
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "خطا در ابطال توکن API.",
      );
      throw err;
    } finally {
      setIsRevokingToken(false);
    }
  };

  return {
    revokeSession: handleRevokeSession,
    revokeToken: handleRevokeToken,
    isRevokingSession,
    isRevokingToken,
  };
}
