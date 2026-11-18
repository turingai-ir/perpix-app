import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  User,
  Phone,
  Mail,
  Wallet,
  Calendar,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Copy,
  Check,
  LogOut,
  Ban,
  Trash2,
  KeyRound,
  Laptop,
} from "lucide-react";
import { useUserDetail } from "../hooks/use-user-detail";
import { useUserSessions } from "../hooks/use-user-sessions";
import { useUserActions } from "../hooks/use-user-actions";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import type { AdminSessionResponse } from "../model/types";

const formatDate = (isoString?: string | null) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export function UserDetailPage() {
  const { t } = useAppTranslate();
  const { userUuid = "" } = useParams<{ userUuid: string }>();
  const navigate = useNavigate();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Dialog states
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

  const {
    data: user,
    isPending: isUserPending,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useUserDetail(userUuid);

  const {
    data: sessionsData,
    isPending: isSessionsPending,
    isError: isSessionsError,
    refetch: refetchSessions,
  } = useUserSessions(userUuid);

  const {
    banUser,
    unbanUser,
    revokeSession,
    revokeAllSessions,
    hardDeleteUser,
    isBanning,
    isUnbanning,
    isRevokingSession,
    isRevokingAll,
    isDeleting,
  } = useUserActions(userUuid);

  const handleCopy = (field: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBan = async ({ reason }: { reason?: string }) => {
    try {
      await banUser(reason);
      setBanDialogOpen(false);
    } catch {
      // error handled in hook
    }
  };

  const handleUnban = async ({ reason }: { reason?: string }) => {
    try {
      await unbanUser(reason);
      setUnbanDialogOpen(false);
    } catch {
      // error handled in hook
    }
  };

  const handleRevokeAll = async ({ reason }: { reason?: string }) => {
    try {
      await revokeAllSessions(reason);
      setRevokeAllDialogOpen(false);
    } catch {
      // error handled in hook
    }
  };

  const handleRevokeSession = async ({ reason }: { reason?: string }) => {
    if (!sessionToRevoke) return;
    try {
      await revokeSession(sessionToRevoke, reason);
      setSessionToRevoke(null);
    } catch {
      // error handled in hook
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      await hardDeleteUser(user.phone_number);
      setDeleteDialogOpen(false);
      navigate("/users", { replace: true });
    } catch {
      // error handled in hook
    }
  };

  // Sessions Table Columns
  const sessionColumns: DataTableColumn<AdminSessionResponse>[] = [
    {
      id: "uuid",
      header: t("features.users.sessions.uuid", { defaultValue: "شناسه نشست" }),
      cell: (session) => {
        const isCopied = copiedField === session.uuid;
        return (
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <span title={session.uuid}>
              {session.uuid.slice(0, 8)}…{session.uuid.slice(-4)}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(session.uuid, session.uuid)}
              aria-label="کپی شناسه نشست"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
            >
              {isCopied ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("features.users.sessions.status", {
        defaultValue: "وضعیت نشست",
      }),
      cell: (session) => {
        const isRevoked = Boolean(session.revoked_at);
        const isExpired =
          !isRevoked && new Date(session.expires_at) < new Date();

        if (isRevoked) {
          return (
            <Badge variant="destructive" className="gap-1 text-xs">
              {t("features.users.sessions.revoked", {
                defaultValue: "لغو شده",
              })}
            </Badge>
          );
        }
        if (isExpired) {
          return (
            <Badge variant="muted" className="gap-1 text-xs">
              {t("features.users.sessions.expired", {
                defaultValue: "منقضی شده",
              })}
            </Badge>
          );
        }
        return (
          <Badge variant="success" className="gap-1 text-xs">
            {t("features.users.sessions.active", { defaultValue: "فعال" })}
          </Badge>
        );
      },
    },
    {
      id: "created_at",
      header: t("features.users.sessions.createdAt", {
        defaultValue: "تاریخ شروع",
      }),
      cell: (session) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(session.created_at)}
        </span>
      ),
    },
    {
      id: "expires_at",
      header: t("features.users.sessions.expiresAt", {
        defaultValue: "تاریخ انقضا",
      }),
      cell: (session) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(session.expires_at)}
        </span>
      ),
    },
    {
      id: "revoked_at",
      header: t("features.users.sessions.revokedAt", {
        defaultValue: "تاریخ لغو",
      }),
      cell: (session) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(session.revoked_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("features.users.sessions.actions", { defaultValue: "عملیات" }),
      className: "text-left",
      headerClassName: "text-left",
      cell: (session) => {
        const isRevoked = Boolean(session.revoked_at);
        const isExpired =
          !isRevoked && new Date(session.expires_at) < new Date();
        const isActive = !isRevoked && !isExpired;

        if (!isActive)
          return <span className="text-muted-foreground text-xs">—</span>;

        return (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 border-destructive/30 gap-1 text-xs"
            onClick={() => setSessionToRevoke(session.uuid)}
          >
            <LogOut className="size-3.5" />
            {t("features.users.sessions.revokeOne", {
              defaultValue: "لغو نشست",
            })}
          </Button>
        );
      },
    },
  ];

  const userScopes: string[] = user?.scopes
    ? Array.from(user.scopes as unknown as ArrayLike<string>)
    : [];
  const isSuperadmin = userScopes.includes("superadmin");
  const isAdmin = userScopes.includes("admin") || isSuperadmin;

  return (
    <DetailPageLayout
      breadcrumbs={[
        {
          label: t("features.users.title", { defaultValue: "کاربران" }),
          href: "/users",
        },
        {
          label: user?.name || user?.phone_number || userUuid.slice(0, 8),
        },
      ]}
      backHref="/users"
      backLabel={t("features.users.backToList", {
        defaultValue: "بازگشت به لیست کاربران",
      })}
      title={
        user?.name ||
        user?.phone_number ||
        t("features.users.userDetail", { defaultValue: "جزئیات کاربر" })
      }
      subtitle={user?.user_uuid}
      isLoading={isUserPending}
      isError={isUserError}
      errorMessage={userError instanceof Error ? userError.message : undefined}
      onRetry={() => {
        void refetchUser();
      }}
      badges={
        user && (
          <>
            {user.is_active ? (
              <Badge variant="success" className="gap-1">
                <UserCheck className="size-3" />
                {t("features.users.statuses.active", {
                  defaultValue: "حساب فعال",
                })}
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <UserX className="size-3" />
                {t("features.users.statuses.banned", {
                  defaultValue: "حساب مسدود",
                })}
              </Badge>
            )}

            {user.is_verified ? (
              <Badge
                variant="outline"
                className="border-emerald-500/30 text-emerald-600"
              >
                {t("features.users.verified.yes", {
                  defaultValue: "شماره تأیید شده",
                })}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground border-border"
              >
                {t("features.users.verified.no", {
                  defaultValue: "تأیید نشده",
                })}
              </Badge>
            )}

            {isSuperadmin ? (
              <Badge
                variant="default"
                className="gap-1 bg-amber-600 text-white"
              >
                <ShieldAlert className="size-3" />
                {t("features.users.roles.superadmin", {
                  defaultValue: "مدیر ارشد",
                })}
              </Badge>
            ) : isAdmin ? (
              <Badge variant="default" className="gap-1">
                <ShieldCheck className="size-3" />
                {t("features.users.roles.admin", { defaultValue: "مدیر" })}
              </Badge>
            ) : (
              <Badge variant="secondary">
                {t("features.users.roles.user", { defaultValue: "کاربر عادی" })}
              </Badge>
            )}
          </>
        )
      }
      actions={
        user && (
          <div className="flex flex-wrap items-center gap-2">
            {user.is_active ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                onClick={() => setBanDialogOpen(true)}
              >
                <Ban className="size-3.5" />
                {t("features.users.actions.ban", {
                  defaultValue: "مسدودسازی کاربر",
                })}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                onClick={() => setUnbanDialogOpen(true)}
              >
                <UserCheck className="size-3.5" />
                {t("features.users.actions.unban", {
                  defaultValue: "رفع مسدودیت",
                })}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-foreground hover:bg-muted gap-1.5"
              onClick={() => setRevokeAllDialogOpen(true)}
            >
              <LogOut className="size-3.5" />
              {t("features.users.actions.revokeAllSessions", {
                defaultValue: "قطع تمام نشست‌ها",
              })}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-3.5" />
              {t("features.users.actions.hardDelete", {
                defaultValue: "حذف دائمی",
              })}
            </Button>
          </div>
        )
      }
    >
      {user && (
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="border-border/60 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <User className="text-primary size-4" />
                {t("features.users.profile.title", {
                  defaultValue: "مشخصات حساب کاربری",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {t("features.users.profile.name", {
                      defaultValue: "نام و نام خانوادگی",
                    })}
                  </span>
                  <p className="text-foreground text-sm font-semibold">
                    {user.name || "—"}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Phone className="size-3" />
                    {t("features.users.profile.phone", {
                      defaultValue: "شماره همراه",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <p dir="ltr" className="text-foreground font-mono text-sm">
                      {user.phone_number}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy("phone", user.phone_number)}
                      aria-label="کپی شماره همراه"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                    >
                      {copiedField === "phone" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Mail className="size-3" />
                    {t("features.users.profile.email", {
                      defaultValue: "آدرس ایمیل",
                    })}
                  </span>
                  <p
                    dir="ltr"
                    className="text-foreground text-right font-mono text-sm"
                  >
                    {user.email || "—"}
                  </p>
                </div>

                {/* User UUID */}
                <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <KeyRound className="size-3" />
                    {t("features.users.profile.uuid", {
                      defaultValue: "شناسه کاربری (UUID)",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <p
                      dir="ltr"
                      className="text-foreground max-w-[220px] truncate font-mono text-xs"
                    >
                      {user.user_uuid}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy("user_uuid", user.user_uuid)}
                      aria-label="کپی شناسه کاربری"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                    >
                      {copiedField === "user_uuid" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Default Wallet UUID */}
                <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Wallet className="size-3" />
                    {t("features.users.profile.walletUuid", {
                      defaultValue: "شناسه کیف پول پیش‌فرض",
                    })}
                  </span>
                  {user.default_wallet_uuid ? (
                    <div className="flex items-center gap-2">
                      <p
                        dir="ltr"
                        className="text-foreground max-w-[220px] truncate font-mono text-xs"
                      >
                        {user.default_wallet_uuid}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("wallet", user.default_wallet_uuid!)
                        }
                        aria-label="کپی شناسه کیف پول"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                      >
                        {copiedField === "wallet" ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">—</p>
                  )}
                </div>

                {/* Scopes */}
                <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Shield className="size-3" />
                    {t("features.users.profile.scopes", {
                      defaultValue: "دسترسی‌ها و مجوزها",
                    })}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {userScopes.length > 0 ? (
                      userScopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="font-mono text-[11px]"
                        >
                          {scope}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </div>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="size-3" />
                    {t("features.users.profile.createdAt", {
                      defaultValue: "تاریخ عضویت",
                    })}
                  </span>
                  <p className="text-foreground text-sm">
                    {formatDate(user.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-3" />
                    {t("features.users.profile.updatedAt", {
                      defaultValue: "آخرین ویرایش",
                    })}
                  </span>
                  <p className="text-foreground text-sm">
                    {formatDate(user.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Sessions Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Laptop className="text-primary size-4" />
                  {t("features.users.sessions.title", {
                    defaultValue: "نشست‌های فعال و پیشین کاربر",
                  })}
                </h2>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {t("features.users.sessions.subtitle", {
                    defaultValue:
                      "مشاهده وضعیت دستگاه‌ها و ورودهای اخیر به حساب کاربری",
                  })}
                </p>
              </div>

              {sessionsData?.items && sessionsData.items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5 text-xs"
                  onClick={() => setRevokeAllDialogOpen(true)}
                >
                  <LogOut className="size-3.5" />
                  {t("features.users.sessions.revokeAll", {
                    defaultValue: "قطع همه نشست‌ها",
                  })}
                </Button>
              )}
            </div>

            <DataTable
              columns={sessionColumns}
              data={
                sessionsData?.items
                  ? Array.from(
                      sessionsData.items as unknown as ArrayLike<AdminSessionResponse>,
                    )
                  : undefined
              }
              isLoading={isSessionsPending}
              isError={isSessionsError}
              emptyMessage={t("features.users.sessions.empty", {
                defaultValue: "نشستی برای این کاربر ثبت نشده است.",
              })}
              onRetry={() => {
                void refetchSessions();
              }}
              keyExtractor={(s) => s.uuid}
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {/* 1. Ban Dialog */}
      <ConfirmDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        variant="destructive"
        title={t("features.users.dialogs.banTitle", {
          defaultValue: "مسدودسازی حساب کاربر",
        })}
        description={t("features.users.dialogs.banDescription", {
          defaultValue:
            "با مسدودسازی، تمام نشست‌های کاربر بلافاصله باطل شده و امکان ورود مجدد به حساب غیرفعال خواهد شد.",
        })}
        confirmText={t("features.users.dialogs.banConfirm", {
          defaultValue: "مسدود کردن کاربر",
        })}
        requiresReason
        reasonLabel={t("features.users.dialogs.banReasonLabel", {
          defaultValue: "دلیل مسدودسازی (اختیاری):",
        })}
        reasonPlaceholder={t("features.users.dialogs.banReasonPlaceholder", {
          defaultValue: "مثال: نقض قوانین استفاده از سرویس...",
        })}
        isLoading={isBanning}
        onConfirm={handleBan}
      />

      {/* 2. Unban Dialog */}
      <ConfirmDialog
        open={unbanDialogOpen}
        onOpenChange={setUnbanDialogOpen}
        variant="default"
        title={t("features.users.dialogs.unbanTitle", {
          defaultValue: "رفع مسدودیت کاربر",
        })}
        description={t("features.users.dialogs.unbanDescription", {
          defaultValue:
            "با رفع مسدودیت، کاربر مجدداً قادر به ورود به سامانه خواهد بود. اعتبار نشست‌های قبلی احیا نخواهد شد.",
        })}
        confirmText={t("features.users.dialogs.unbanConfirm", {
          defaultValue: "رفع مسدودیت",
        })}
        requiresReason
        reasonLabel={t("features.users.dialogs.unbanReasonLabel", {
          defaultValue: "دلیل رفع مسدودیت (اختیاری):",
        })}
        isLoading={isUnbanning}
        onConfirm={handleUnban}
      />

      {/* 3. Revoke All Sessions Dialog */}
      <ConfirmDialog
        open={revokeAllDialogOpen}
        onOpenChange={setRevokeAllDialogOpen}
        variant="destructive"
        title={t("features.users.dialogs.revokeAllTitle", {
          defaultValue: "قطع تمامی نشست‌های کاربر",
        })}
        description={t("features.users.dialogs.revokeAllDescription", {
          defaultValue:
            "با انجام این عملیات، کاربر از کلیه دستگاه‌ها و مرورگرها خارج خواهد شد اما حساب کاربری مسدود نمی‌شود.",
        })}
        confirmText={t("features.users.dialogs.revokeAllConfirm", {
          defaultValue: "قطع تمام نشست‌ها",
        })}
        requiresReason
        reasonLabel={t("features.users.dialogs.revokeReasonLabel", {
          defaultValue: "علت قطع نشست‌ها (اختیاری):",
        })}
        isLoading={isRevokingAll}
        onConfirm={handleRevokeAll}
      />

      {/* 4. Revoke Single Session Dialog */}
      <ConfirmDialog
        open={Boolean(sessionToRevoke)}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
        variant="destructive"
        title={t("features.users.dialogs.revokeOneTitle", {
          defaultValue: "قطع این نشست",
        })}
        description={t("features.users.dialogs.revokeOneDescription", {
          defaultValue: "دستگاه متصل به این نشست از حساب خارج خواهد شد.",
        })}
        confirmText={t("features.users.dialogs.revokeOneConfirm", {
          defaultValue: "قطع نشست",
        })}
        requiresReason
        isLoading={isRevokingSession}
        onConfirm={handleRevokeSession}
      />

      {/* 5. Hard Delete User Dialog */}
      {user && (
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          variant="destructive"
          title={t("features.users.dialogs.deleteTitle", {
            defaultValue: "حذف دائمی حساب کاربری",
          })}
          description={t("features.users.dialogs.deleteDescription", {
            defaultValue:
              "هشدار: این عملیات غیرقابل بازگشت است! تمام اطلاعات، فایل‌ها و سوابق این کاربر به صورت دائمی حذف خواهد شد. جهت تأیید، شماره همراه کاربر را وارد کنید.",
          })}
          confirmText={t("features.users.dialogs.deleteConfirm", {
            defaultValue: "حذف دائمی کاربر",
          })}
          confirmRequirement={{
            requiredText: user.phone_number,
            promptLabel: t("features.users.dialogs.enterPhonePrompt", {
              phone: user.phone_number,
              defaultValue: `جهت تأیید شماره همراه «${user.phone_number}» را در کادر زیر وارد کنید:`,
            }),
            placeholder: user.phone_number,
          }}
          isLoading={isDeleting}
          onConfirm={handleDeleteUser}
        />
      )}
    </DetailPageLayout>
  );
}
