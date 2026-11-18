export interface paths {
  readonly "/api/admin/v1/payments": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Payments */
    readonly get: operations["admin_payment_list_payments"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/payment/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Payments Daily */
    readonly get: operations["admin_payment_report_payments_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/payment/reports/statuses": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Payments Statuses */
    readonly get: operations["admin_payment_report_payments_statuses"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/payments/{resource_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Payments */
    readonly get: operations["admin_payment_get_payments"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallets": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Wallets */
    readonly get: operations["admin_wallet_list_wallets"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet-transactions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Transactions */
    readonly get: operations["admin_wallet_list_transactions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Transactions Daily */
    readonly get: operations["admin_wallet_report_transactions_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet/reports/sources": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Transactions Sources */
    readonly get: operations["admin_wallet_report_transactions_sources"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallets/{resource_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Wallets */
    readonly get: operations["admin_wallet_get_wallets"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet/reports/balances": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Wallets Balances */
    readonly get: operations["admin_wallet_report_wallets_balances"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet/reports/directions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Transactions Directions */
    readonly get: operations["admin_wallet_report_transactions_directions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/files": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Files */
    readonly get: operations["admin_file_manager_list_files"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/reports/content-types": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Files Content Types */
    readonly get: operations["admin_file_manager_report_files_content_types"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Files Daily */
    readonly get: operations["admin_file_manager_report_files_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscriptions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Subscriptions */
    readonly get: operations["admin_subscription_list_subscriptions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/reports/plans": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Subscriptions Plans */
    readonly get: operations["admin_subscription_report_subscriptions_plans"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/reports/expirations": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Subscriptions Expirations */
    readonly get: operations["admin_subscription_report_subscriptions_expirations"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/plans": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Plans */
    readonly get: operations["admin_subscription_list_plans"];
    readonly put?: never;
    /** Create Subscription Plan */
    readonly post: operations["admin_subscription_create_subscription_plan"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscriptions/{resource_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Subscriptions */
    readonly get: operations["admin_subscription_get_subscriptions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/plans/{plan_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly plan_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Plans */
    readonly get: operations["admin_subscription_get_plans"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    /** Update Subscription Plan */
    readonly patch: operations["admin_subscription_update_subscription_plan"];
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/operations": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Operations */
    readonly get: operations["admin_subscription_operations"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/tasks": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Tasks */
    readonly get: operations["admin_ai_task_list_tasks"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Tasks Daily */
    readonly get: operations["admin_ai_task_report_tasks_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/reports/types": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Tasks Types */
    readonly get: operations["admin_ai_task_report_tasks_types"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/tasks/{task_uuid}/messages": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly task_uuid: string;
      };
      readonly cookie?: never;
    };
    /** List Messages */
    readonly get: operations["admin_ai_task_messages"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/tasks/{resource_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Tasks */
    readonly get: operations["admin_ai_task_get_tasks"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/generations": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Generations */
    readonly get: operations["admin_ai_gateway_list_generations"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/generations/{generation_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Generation */
    readonly get: operations["admin_ai_gateway_get_generation"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Read Report */
    readonly get: operations["admin_ai_gateway_report_requests_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/reports/models": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Read Report */
    readonly get: operations["admin_ai_gateway_report_requests_models"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/reports/providers": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Read Report */
    readonly get: operations["admin_ai_gateway_report_requests_providers"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/reports/statuses": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Read Report */
    readonly get: operations["admin_ai_gateway_report_requests_statuses"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Models */
    readonly get: operations["admin_ai_registry_list_models"];
    readonly put?: never;
    /** Create Model */
    readonly post: operations["admin_ai_registry_create_model"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/reports/statuses": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Models Statuses */
    readonly get: operations["admin_ai_registry_report_models_statuses"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/providers": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Providers */
    readonly get: operations["admin_ai_registry_list_providers"];
    readonly put?: never;
    /** Create Provider */
    readonly post: operations["admin_ai_registry_create_provider"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/users": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Users */
    readonly get: operations["admin_user_list_users"];
    readonly put?: never;
    readonly post?: never;
    /** Hard Delete User */
    readonly delete: operations["admin_users_hard_delete_user"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/users/reports/daily": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Users Daily */
    readonly get: operations["admin_user_report_users_daily"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/users/reports/statuses": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Users Statuses */
    readonly get: operations["admin_user_report_users_statuses"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/users/{resource_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Users */
    readonly get: operations["admin_user_get_users"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/users/reports/verification": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Users Verification */
    readonly get: operations["admin_user_report_users_verification"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/api-tokens": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Tokens */
    readonly get: operations["admin_auth_list_tokens"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/reports/api-tokens": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Tokens Api Tokens */
    readonly get: operations["admin_auth_report_tokens_api_tokens"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/sessions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Sessions */
    readonly get: operations["admin_auth_search_sessions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/reports/sessions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Report Sessions Sessions */
    readonly get: operations["admin_auth_report_sessions_sessions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/me": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Identity */
    readonly get: operations["admin_auth_identity"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/audit-events": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Audit */
    readonly get: operations["admin_auth_audit_events"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/users/{user_uuid}/sessions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    /**
     * List a user's sessions
     * @description Requires a live administrator session. Managing administrators requires superadmin. Includes revoked and expired sessions, ordered by creation time and UUID descending.
     */
    readonly get: operations["admin_auth_list_sessions"];
    readonly put?: never;
    readonly post?: never;
    /**
     * Revoke all current sessions without banning the user
     * @description Requires a live administrator session; superadmin for administrator targets. Does not prevent signing in again. Idempotent.
     */
    readonly delete: operations["admin_auth_revoke_sessions"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/users/{user_uuid}/sessions/{session_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
        readonly session_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    readonly post?: never;
    /**
     * Revoke one owned session without banning the user
     * @description Requires a live administrator session; superadmin for administrator targets. Idempotent.
     */
    readonly delete: operations["admin_auth_revoke_session"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/users/{user_uuid}/ban": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    /**
     * Deactivate a user and revoke all sessions atomically
     * @description Requires a live administrator session; superadmin for administrator targets. Idempotent.
     */
    readonly put: operations["admin_auth_ban_user"];
    readonly post?: never;
    /**
     * Reactivate a user without restoring old credentials
     * @description Requires a live administrator session; superadmin for administrator targets. Idempotent.
     */
    readonly delete: operations["admin_auth_unban_user"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/api-tokens/{token_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly token_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    readonly post?: never;
    /** Revoke a user's machine credential with current administrator permissions */
    readonly delete: operations["admin_auth_revoke_api_token"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/auth/sms-tests": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Queue a verification SMS delivery test
     * @description Requires a live administrator browser session. Sends a random six-digit code using the existing verification SMS template. The code cannot authenticate or reset a password; existing challenges are unchanged. A 202 response confirms queue acceptance, not delivery. Limited to 5 requests per minute per administrator and the shared phone send budget. Each retry queues another message and consumes the same budgets.
     */
    readonly post: operations["admin_auth_test_sms"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/activate": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Activate User Subscription */
    readonly post: operations["admin_subscription_activate_user_subscription"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/subscription/deactivate": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Deactivate User Subscription */
    readonly post: operations["admin_subscription_deactivate_user_subscription"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/studio/caption-presets": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * List Caption Presets
     * @description The admin's presets in display order, hidden ones included.
     */
    readonly get: operations["admin_studio_list_caption_presets"];
    readonly put?: never;
    /** Create Caption Preset */
    readonly post: operations["admin_studio_create_caption_preset"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/studio/caption-presets/{preset_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly preset_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    /**
     * Update Caption Preset
     * @description Replace every field of one of the admin's presets.
     */
    readonly put: operations["admin_studio_update_caption_preset"];
    readonly post?: never;
    /**
     * Delete Caption Preset
     * @description Remove one of the admin's presets; copies users already saved are theirs and stay.
     */
    readonly delete: operations["admin_studio_delete_caption_preset"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallet/topup-policy": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get how wallet top-ups are priced */
    readonly get: operations["admin_wallet_get_topup_policy"];
    /** Set our profit, the charge range and the discount tiers of wallet top-ups */
    readonly put: operations["admin_wallet_update_topup_policy"];
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallets/{wallet_uuid}/transactions": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly wallet_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Wallet Transactions */
    readonly get: operations["admin_wallets_get_wallet_transactions"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/wallets/{wallet_uuid}/charge": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly wallet_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Charge Wallet */
    readonly post: operations["admin_wallets_charge_wallet"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/currency-exchange-rate/refresh": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Refresh Currency Exchange Rate */
    readonly post: operations["admin_exchange_rate_refresh"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/currency-exchange-rate": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Latest Exchange Rate */
    readonly get: operations["admin_exchange_rate_latest"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/files/{file_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get File */
    readonly get: operations["admin_file_manager_get_file"];
    readonly put?: never;
    readonly post?: never;
    /**
     * Delete File
     * @description Delete an active file as administrator. Managed deletion commits a logical retirement before success and preserves held bytes for claimed cleanup. Legacy deletion retains existing storage behavior. Failed or unknown commits return an error; inspect state before retrying.
     */
    readonly delete: operations["admin_file_manager_delete_file"];
    readonly options?: never;
    readonly head?: never;
    /** Update File */
    readonly patch: operations["admin_file_manager_update_file"];
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/files/delete-bulk": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Delete Bulk Files
     * @description Delete active files as administrator. Managed-only batches retire atomically before success and deduplicate UUIDs in first-occurrence order. Missing/expired/deleted targets return 404 before mutation. Mixed managed/legacy batches return 409 without mutation; submit separate batches. Legacy-only batches retain existing storage deletion behavior. Failed or unknown commits require reading current state before retrying.
     */
    readonly post: operations["admin_file_manager_delete_bulk_files"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/file-manager/files/{file_uuid}/presigned-urls": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Preview File */
    readonly get: operations["admin_file_preview"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-task/users/{user_uuid}/messages/{task_message_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
        readonly task_message_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Check User Task Result */
    readonly get: operations["admin_ai_task_check_user_task_result"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/generations/{generation_uuid}/external-task": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Record External Task */
    readonly post: operations["admin_ai_gateway_generation_external_task"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/generations/{generation_uuid}/cost": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Set Cost */
    readonly post: operations["admin_ai_gateway_generation_set_cost"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-gateway/generations/{generation_uuid}/fail": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Fail Generation */
    readonly post: operations["admin_ai_gateway_generation_fail"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/providers/{ai_provider_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_provider_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Provider */
    readonly get: operations["admin_ai_registry_get_provider"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    /** Update Provider */
    readonly patch: operations["admin_ai_registry_update_provider"];
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models/{ai_model_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Model */
    readonly get: operations["admin_ai_registry_get_model"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    /** Update Model */
    readonly patch: operations["admin_ai_registry_update_model"];
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models/{ai_model_uuid}/providers": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Provider To Model */
    readonly post: operations["admin_ai_registry_add_provider_to_model"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models/order": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    /**
     * Reorder Models
     * @description Show these models to users in this order, within the places they already hold in the catalog.
     */
    readonly put: operations["admin_ai_registry_reorder_models"];
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models/{ai_model_uuid}/providers/order": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    /** Reorder Model Providers */
    readonly put: operations["admin_ai_registry_reorder_model_providers"];
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/admin/v1/ai-registry/models/{ai_model_uuid}/providers/{ai_provider_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
        readonly ai_provider_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    /** Update Provider Link */
    readonly patch: operations["admin_ai_registry_update_provider_link"];
    readonly trace?: never;
  };
  readonly "/api/v1/auth/login": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Sign in with a phone number and password */
    readonly post: operations["auth_login"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/csrf": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Recover the refresh CSRF value after a page reload */
    readonly get: operations["auth_csrf"];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/refresh": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Refresh an existing session
     * @description Use credentials: include and X-CSRF-TOKEN. Coordinate refresh across tabs. Retries share a fixed 10-second grace window; the session expires 30 days after login.
     */
    readonly post: operations["auth_refresh"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/logout": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Revoke this session
     * @description Repeated logout with a valid refresh signature and CSRF returns 204.
     */
    readonly post: operations["auth_logout"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/logout-all": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Revoke all of your browser sessions */
    readonly post: operations["auth_logout_all"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/registration-challenges": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Request a registration code
     * @description Returns the same challenge shape for new and existing accounts. No session is created.
     */
    readonly post: operations["auth_registration_challenge"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/registrations": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Verify a registration code and create a session */
    readonly post: operations["auth_register"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/challenges/{challenge_id}/resend": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly challenge_id: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Resend a registration or password reset code
     * @description Requires an unexpired challenge. Replaces the code without resetting its attempt budget.
     */
    readonly post: operations["auth_challenge_resend"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/password-reset-challenges": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Request a password reset code
     * @description Returns the same challenge shape for eligible and unknown phone numbers.
     */
    readonly post: operations["auth_password_reset_challenge"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/password-resets": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Reset a password with an OTP and revoke all sessions
     * @description Does not sign in automatically. Registration codes cannot reset passwords.
     */
    readonly post: operations["auth_password_reset"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/password-changes": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Change a password and revoke all sessions
     * @description Requires the current password and a live access session. Sign in again after success.
     */
    readonly post: operations["auth_password_change"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/start": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /**
     * Start sign-in or registration with a phone number
     * @description Returns password for existing or unavailable accounts. Registerable numbers receive a registration challenge and an SMS is queued. This endpoint reveals account registration state. Repeated requests consume the shared phone/IP send budget and replace the registration code.
     */
    readonly post: operations["auth_start"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/api-tokens": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List your machine credentials without raw tokens */
    readonly get: operations["auth_list_api_tokens"];
    readonly put?: never;
    /** Create a machine credential; raw token is returned only once */
    readonly post: operations["auth_create_api_token"];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly "/api/v1/auth/api-tokens/{token_uuid}": {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly token_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    readonly post?: never;
    /** Revoke your token; repeat revocation is idempotent */
    readonly delete: operations["auth_revoke_api_token"];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** ActivateUserSubscriptionRequest */
    readonly ActivateUserSubscriptionRequest: {
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /**
       * Plan Uuid
       * Format: uuid
       */
      readonly plan_uuid: string;
    };
    /** AdminIdentityResponse */
    readonly AdminIdentityResponse: {
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Scopes */
      readonly scopes: readonly string[];
    };
    /** AdminPage */
    readonly AdminPage_AdminReportBucket_: {
      /** Items */
      readonly items: readonly components["schemas"]["AdminReportBucket"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_AuditRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["AuditRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_FilesRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["FilesRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_GenerationDetail_: {
      /** Items */
      readonly items: readonly components["schemas"]["GenerationDetail"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_MessageRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["MessageRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_ModelsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["ModelsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_PaymentsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["PaymentsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_PlansRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["PlansRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_ProvidersRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["ProvidersRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_SessionsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["SessionsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_SubscriptionOperationRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["SubscriptionOperationRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_SubscriptionsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["SubscriptionsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_TasksRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["TasksRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_TokensRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["TokensRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_TransactionsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["TransactionsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_UsersRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["UsersRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminPage */
    readonly AdminPage_WalletsRow_: {
      /** Items */
      readonly items: readonly components["schemas"]["WalletsRow"][];
      /** Total Count */
      readonly total_count: number;
      /** Offset */
      readonly offset: number;
      /** Limit */
      readonly limit: number;
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminReasonRequest */
    readonly AdminReasonRequest: {
      /** Reason */
      readonly reason: string;
    };
    /** AdminReportBucket */
    readonly AdminReportBucket: {
      /** Key */
      readonly key: string;
      /** Count */
      readonly count: number;
      /**
       * Amount Usdmicro
       * @default 0
       */
      readonly amount_usdmicro: number;
      /**
       * Amount Irr
       * @default 0
       */
      readonly amount_irr: number;
      /**
       * Bytes
       * @default 0
       */
      readonly bytes: number;
    };
    /** AdminSessionListResponse */
    readonly AdminSessionListResponse: {
      /** Items */
      readonly items: readonly components["schemas"]["AdminSessionResponse"][];
      /** Has Next */
      readonly has_next: boolean;
    };
    /** AdminSessionResponse */
    readonly AdminSessionResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /** Revoked At */
      readonly revoked_at: string | null;
    };
    /**
     * AdminSort
     * @enum {string}
     */
    readonly AdminSort: "-created_at" | "created_at";
    /** AdminTopupPolicyResponse */
    readonly AdminTopupPolicyResponse: {
      /** Min Amount Usdmicro */
      readonly min_amount_usdmicro: number;
      /** Max Amount Usdmicro */
      readonly max_amount_usdmicro: number;
      /** Tiers */
      readonly tiers: readonly components["schemas"]["TopupTierSchema"][];
      /** Profit Percent */
      readonly profit_percent: number;
    };
    /**
     * AiRegistryModeDefinition
     * @description A mode a model offers.
     */
    readonly AiRegistryModeDefinition: {
      /** Value */
      readonly value: string;
    };
    /** AiRegistryModelCreateRequest */
    readonly AiRegistryModelCreateRequest: {
      readonly model_owner: components["schemas"]["AiRegistryModelOwnerEnum"];
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name?: string | null;
      /** Description */
      readonly description?: string | null;
      /** Icon Url */
      readonly icon_url?: string | null;
      /** Modes Supported */
      readonly modes_supported?: {
        readonly [
          key: string
        ]: components["schemas"]["AiRegistryModeDefinition"];
      };
      /** Canonical Ui Schema */
      readonly canonical_ui_schema?: {
        readonly [key: string]: unknown;
      };
      /** Tags */
      readonly tags?: readonly string[];
      /** Supported Inputs */
      readonly supported_inputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /** Supported Outputs */
      readonly supported_outputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /**
       * Is Active
       * @default true
       */
      readonly is_active: boolean;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      };
    };
    /** AiRegistryModelDetail */
    readonly AiRegistryModelDetail: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      readonly model_owner: components["schemas"]["AiRegistryModelOwnerEnum"];
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Description */
      readonly description: string | null;
      /** Icon Url */
      readonly icon_url: string | null;
      /** Modes Supported */
      readonly modes_supported: {
        readonly [
          key: string
        ]: components["schemas"]["AiRegistryModeDefinition"];
      };
      /** Canonical Ui Schema */
      readonly canonical_ui_schema: {
        readonly [key: string]: unknown;
      };
      /** Tags */
      readonly tags: readonly string[];
      /** Supported Inputs */
      readonly supported_inputs: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /** Supported Outputs */
      readonly supported_outputs: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /** Min Cost */
      readonly min_cost?: number | null;
      /** Max Cost */
      readonly max_cost?: number | null;
      /** Is Active */
      readonly is_active: boolean;
      /**
       * Display Order
       * @default 0
       */
      readonly display_order: number;
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      };
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
      /** Provider Links */
      readonly provider_links?: readonly components["schemas"]["AiRegistryModelProviderLinkDetail"][];
    };
    /** AiRegistryModelOrderRequest */
    readonly AiRegistryModelOrderRequest: {
      /** Ai Model Uuids */
      readonly ai_model_uuids: readonly string[];
    };
    /**
     * AiRegistryModelOwnerEnum
     * @enum {string}
     */
    readonly AiRegistryModelOwnerEnum:
      | "ALIBABA"
      | "OPEN_AI"
      | "GOOGLE"
      | "BLACK_FOREST_LABS"
      | "K_LING_AI"
      | "BRIA"
      | "BYTE_DANCE"
      | "HEYGEN"
      | "IMAGINE_ART"
      | "LIGHT_TICKS"
      | "MID_JOURNEY"
      | "MINI_MAX"
      | "PIX_VERSE"
      | "PRUNA_AI"
      | "RUNWAY"
      | "SOURCE_FUL"
      | "VIDU"
      | "IDEOGRAM"
      | "X_AI";
    /** AiRegistryModelProviderLinkCreateRequest */
    readonly AiRegistryModelProviderLinkCreateRequest: {
      /**
       * Ai Provider Uuid
       * Format: uuid
       */
      readonly ai_provider_uuid: string;
      /**
       * Priority
       * @default 10
       */
      readonly priority: number;
      /**
       * Is Active
       * @default true
       */
      readonly is_active: boolean;
      /** Modes */
      readonly modes?: {
        readonly [key: string]: unknown;
      };
      /** Workflow Modes */
      readonly workflow_modes?: readonly string[];
    };
    /** AiRegistryModelProviderLinkDetail */
    readonly AiRegistryModelProviderLinkDetail: {
      /** Ai Provider Id */
      readonly ai_provider_id: number | null;
      /** Ai Model Id */
      readonly ai_model_id: number | null;
      /** Provider Uuid */
      readonly provider_uuid?: string | null;
      /** Priority */
      readonly priority: number;
      /** Is Active */
      readonly is_active: boolean;
      /** Modes */
      readonly modes: {
        readonly [key: string]: unknown;
      };
      /** Workflow Modes */
      readonly workflow_modes?: readonly string[];
    };
    /** AiRegistryModelProviderLinkUpdateRequest */
    readonly AiRegistryModelProviderLinkUpdateRequest: {
      /** Priority */
      readonly priority?: number | null;
      /** Is Active */
      readonly is_active?: boolean | null;
      /** Modes */
      readonly modes?: {
        readonly [key: string]: unknown;
      } | null;
      /** Workflow Modes */
      readonly workflow_modes?: readonly string[] | null;
    };
    /** AiRegistryModelProviderOrderRequest */
    readonly AiRegistryModelProviderOrderRequest: {
      /** Ai Provider Uuids */
      readonly ai_provider_uuids: readonly string[];
    };
    /**
     * AiRegistryModelSupportedTypesEnum
     * @enum {string}
     */
    readonly AiRegistryModelSupportedTypesEnum:
      "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    /** AiRegistryModelUpdateRequest */
    readonly AiRegistryModelUpdateRequest: {
      readonly model_owner?:
        components["schemas"]["AiRegistryModelOwnerEnum"] | null;
      /** Name */
      readonly name?: string | null;
      /** Display Name */
      readonly display_name?: string | null;
      /** Description */
      readonly description?: string | null;
      /** Icon Url */
      readonly icon_url?: string | null;
      /** Modes Supported */
      readonly modes_supported?: {
        readonly [
          key: string
        ]: components["schemas"]["AiRegistryModeDefinition"];
      } | null;
      /** Canonical Ui Schema */
      readonly canonical_ui_schema?: {
        readonly [key: string]: unknown;
      } | null;
      /** Tags */
      readonly tags?: readonly string[] | null;
      /** Supported Inputs */
      readonly supported_inputs?:
        | readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][]
        | null;
      /** Supported Outputs */
      readonly supported_outputs?:
        | readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][]
        | null;
      /** Is Active */
      readonly is_active?: boolean | null;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      } | null;
    };
    /** AiRegistryProviderCreateRequest */
    readonly AiRegistryProviderCreateRequest: {
      readonly name: components["schemas"]["AiRegistryProviderNameEnum"];
      /** Display Name */
      readonly display_name?: string | null;
      /** Base Api Url */
      readonly base_api_url?: string | null;
      /** Api Keys */
      readonly api_keys?: readonly components["schemas"]["AiRegistryProviderKeyRequest"][];
      /** Rate Limit Per Min */
      readonly rate_limit_per_min?: number | null;
      /** Cost To Usdmicro */
      readonly cost_to_usdmicro?: number | null;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      };
    };
    /** AiRegistryProviderDetail */
    readonly AiRegistryProviderDetail: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      readonly name: components["schemas"]["AiRegistryProviderNameEnum"];
      /** Display Name */
      readonly display_name: string | null;
      /** Base Api Url */
      readonly base_api_url: string | null;
      /** Rate Limit Per Min */
      readonly rate_limit_per_min: number | null;
      /** Cost To Usdmicro */
      readonly cost_to_usdmicro?: number | null;
      readonly unavailable_reason?:
        components["schemas"]["AiRegistryProviderUnavailableReasonEnum"] | null;
      /**
       * Has Api Key
       * @default false
       */
      readonly has_api_key: boolean;
      /** Api Keys */
      readonly api_keys?: readonly components["schemas"]["AiRegistryProviderKeyDetail"][];
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      };
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /**
     * AiRegistryProviderKeyDetail
     * @description A key as an admin sees it: never its value.
     */
    readonly AiRegistryProviderKeyDetail: {
      /**
       * Id
       * Format: uuid
       */
      readonly id: string;
      /** Label */
      readonly label: string | null;
      readonly unavailable_reason?:
        components["schemas"]["AiRegistryProviderUnavailableReasonEnum"] | null;
    };
    /**
     * AiRegistryProviderKeyRequest
     * @description An existing key by `id` (its value is kept unless `api_key` is sent), or a new one with its value.
     */
    readonly AiRegistryProviderKeyRequest: {
      /** Id */
      readonly id?: string | null;
      /** Label */
      readonly label?: string | null;
      /** Api Key */
      readonly api_key?: string | null;
    };
    /**
     * AiRegistryProviderNameEnum
     * @enum {string}
     */
    readonly AiRegistryProviderNameEnum:
      "RUNWARE" | "AIMLAPI" | "KIE" | "OPENAI" | "GOOGLE" | "OPENROUTER";
    /**
     * AiRegistryProviderUnavailableReasonEnum
     * @description Why routing skips a provider for new requests until it is cleared.
     * @enum {string}
     */
    readonly AiRegistryProviderUnavailableReasonEnum:
      "OUT_OF_CREDIT" | "AUTH_FAILED";
    /** AiRegistryProviderUpdateRequest */
    readonly AiRegistryProviderUpdateRequest: {
      /** Display Name */
      readonly display_name?: string | null;
      /** Base Api Url */
      readonly base_api_url?: string | null;
      /** Api Keys */
      readonly api_keys?:
        readonly components["schemas"]["AiRegistryProviderKeyRequest"][] | null;
      /** Rate Limit Per Min */
      readonly rate_limit_per_min?: number | null;
      /** Cost To Usdmicro */
      readonly cost_to_usdmicro?: number | null;
      readonly unavailable_reason?:
        components["schemas"]["AiRegistryProviderUnavailableReasonEnum"] | null;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      } | null;
    };
    /**
     * AiTaskMessageError
     * @description Structured, actionable error details for client applications.
     */
    readonly AiTaskMessageError: {
      /** @description High-level category of the generation failure. */
      readonly reason: components["schemas"]["GenerationFailureReasonEnum"];
      /**
       * Message
       * @description Persian localized user-facing explanation.
       */
      readonly message: string;
      /**
       * Message Key
       * @description Translation key for client-side localization.
       */
      readonly message_key?: string | null;
      /** @description Prescribed client action after this failure. */
      readonly action: components["schemas"]["GenerationFailureActionEnum"];
      /**
       * Retryable
       * @description Whether the client should allow resubmitting the request.
       */
      readonly retryable: boolean;
      /**
       * Target
       * @description Specific target component of the failure if known (prompt, reference_image).
       */
      readonly target?: string | null;
    };
    /**
     * AiTaskMessageResponse
     * @description Standardized representation of a single message within an AI task conversation.
     */
    readonly AiTaskMessageResponse: {
      /**
       * Uuid
       * Format: uuid
       * @description Unique identifier of this task message.
       */
      readonly uuid: string;
      /**
       * @description Role of the message creator: USER for user requests, ASSISTANT for AI outputs.
       * @example ASSISTANT
       */
      readonly role: components["schemas"]["AiTaskRuleEnum"];
      /**
       * @description Current processing status of this message (e.g. SUCCESS, FAILED, IN_PROGRESS).
       * @example SUCCESS
       */
      readonly task_status?:
        components["schemas"]["AiTaskMessageStatusEnum"] | null;
      /**
       * Message
       * @description Text content, normalized prompt, or error explanation associated with this message.
       */
      readonly message?: string | null;
      /**
       * Ai Model Uuid
       * @description UUID of the AI model executed for this message, if applicable.
       */
      readonly ai_model_uuid?: string | null;
      /**
       * Ai Model Config
       * @description Model parameters used and internal output registry.
       */
      readonly ai_model_config?: {
        readonly [key: string]: unknown;
      };
      /**
       * Under Review
       * @description The generation stopped for a support review while still PENDING or IN_PROGRESS. It is not generating; support will finish or fail it, and nothing is charged before that. Keep polling: the status moves on once support acts.
       * @default false
       */
      readonly under_review: boolean;
      /** @description Structured error details when the message failed, parsed from internal config. */
      readonly error: components["schemas"]["AiTaskMessageError"] | null;
      /**
       * Metadata
       * @description Non-sensitive generation metadata (seed, dimensions) if returned by the provider.
       */
      readonly metadata: {
        readonly [key: string]: unknown;
      };
      /**
       * Output File Uuids
       * @description Strongly-typed list of generated output file UUIDs extracted from generation results.
       */
      readonly output_file_uuids: readonly string[];
    };
    /**
     * AiTaskMessageStatusEnum
     * @enum {string}
     */
    readonly AiTaskMessageStatusEnum:
      "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED";
    /**
     * AiTaskRuleEnum
     * @enum {string}
     */
    readonly AiTaskRuleEnum:
      "SYSTEM" | "USER" | "ASSISTANT" | "TOOL" | "FUNCTION" | "INLINE";
    /**
     * AiTaskTypeEnum
     * @enum {string}
     */
    readonly AiTaskTypeEnum: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    /**
     * ApplicationErrorCode
     * @enum {integer}
     */
    readonly ApplicationErrorCode:
      | 900
      | 901
      | 902
      | 999
      | 1000
      | 1100
      | 1103
      | 1104
      | 1106
      | 1107
      | 1108
      | 1109
      | 1200
      | 1201
      | 1202
      | 1203
      | 1204
      | 1205
      | 1206
      | 1300
      | 1301
      | 1302
      | 1303
      | 1304
      | 1305
      | 1306
      | 1307
      | 1308
      | 1309
      | 1310
      | 1400
      | 1401
      | 1500
      | 1501
      | 1502
      | 1503
      | 1504
      | 1505
      | 1506
      | 1507
      | 1600
      | 1601
      | 1602
      | 1603
      | 1604
      | 1605
      | 1700
      | 1701
      | 1702
      | 1800
      | 1801
      | 1802
      | 1803
      | 1804
      | 1805
      | 1806
      | 1807
      | 1808
      | 1810
      | 1811
      | 1812
      | 1813
      | 1814
      | 1815
      | 1816
      | 1900
      | 1901
      | 1902
      | 1903
      | 1904
      | 1906
      | 1907;
    /** ApplicationErrorResponse */
    readonly ApplicationErrorResponse: {
      /**
       * Detail
       * @description Translated error message or validation details.
       */
      readonly detail: unknown;
      /** @description Stable application status code for frontend handling. */
      readonly status_code: components["schemas"]["ApplicationErrorCode"];
      /**
       * Request Id
       * @description Correlation id for tracing the request.
       */
      readonly request_id?: string | null;
      /**
       * Retry After
       * @description Seconds until a rate-limited request can retry.
       */
      readonly retry_after?: number | null;
      /**
       * Required Scopes
       * @description Subscription scopes required to perform the operation.
       */
      readonly required_scopes?: readonly string[] | null;
    };
    /** AuditRow */
    readonly AuditRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * Actor Uuid
       * Format: uuid
       */
      readonly actor_uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Action */
      readonly action: string;
      /** Resource Uuid */
      readonly resource_uuid: string | null;
      /** Reason */
      readonly reason: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** CaptionPresetListResponse */
    readonly CaptionPresetListResponse: {
      /** Items */
      readonly items: readonly components["schemas"]["CaptionPresetResponse"][];
    };
    /** CaptionPresetResponse */
    readonly CaptionPresetResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Config */
      readonly config: {
        readonly [key: string]: unknown;
      };
      /** Schema Version */
      readonly schema_version: number;
      /** Is Active */
      readonly is_active: boolean;
      /** Sort Order */
      readonly sort_order: number;
      /** Source Preset Uuid */
      readonly source_preset_uuid: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** ChargeWalletRequest */
    readonly ChargeWalletRequest: {
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Amount Usdmicro */
      readonly amount_usdmicro: number;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      };
    };
    /**
     * CreateSubscriptionPlanRequest
     * @description Request payload for creating a subscription plan.
     */
    readonly CreateSubscriptionPlanRequest: {
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name?: string | null;
      /** Description */
      readonly description?: string | null;
      /** Scopes */
      readonly scopes?: readonly string[];
      /** Allowed Models */
      readonly allowed_models?: readonly string[];
      /** Base Price Usdmicro */
      readonly base_price_usdmicro: number;
      /** Discounted Price Usdmicro */
      readonly discounted_price_usdmicro: number;
      /**
       * Duration Days
       * @default 30
       */
      readonly duration_days: number;
      /** Balance Gift Amount Usdmicro */
      readonly balance_gift_amount_usdmicro?: number | null;
      readonly settings?: components["schemas"]["PlanSettings"];
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      } | null;
      /**
       * Is Active
       * @default true
       */
      readonly is_active: boolean;
      /**
       * Is Recommended
       * @default false
       */
      readonly is_recommended: boolean;
      /**
       * Is Default
       * @default false
       */
      readonly is_default: boolean;
    };
    /** CreateWalletTransactionResponse */
    readonly CreateWalletTransactionResponse: {
      /**
       * Wallet Uuid
       * Format: uuid
       */
      readonly wallet_uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Amount Usdmicro */
      readonly amount_usdmicro: number;
      /** Old Balance Usdmicro */
      readonly old_balance_usdmicro: number;
      /** New Balance Usdmicro */
      readonly new_balance_usdmicro: number;
      /**
       * Transaction Uuid
       * Format: uuid
       */
      readonly transaction_uuid: string;
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      };
      /** Performed By Admin Uuid */
      readonly performed_by_admin_uuid: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** CurrencyExchangeRateRefreshResponse */
    readonly CurrencyExchangeRateRefreshResponse: {
      readonly from_currency: components["schemas"]["CurrencyUnitEnum"];
      readonly to_currency: components["schemas"]["CurrencyUnitEnum"];
      /** Value */
      readonly value: string;
      /**
       * Date
       * Format: date-time
       */
      readonly date: string;
    };
    /**
     * CurrencyUnitEnum
     * @enum {string}
     */
    readonly CurrencyUnitEnum: "USD" | "IRR" | "USDMICRO";
    /** DeactivateUserSubscriptionRequest */
    readonly DeactivateUserSubscriptionRequest: {
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
    };
    /** FileManagerAdminDeleteBulkRequest */
    readonly FileManagerAdminDeleteBulkRequest: {
      /** File Uuids */
      readonly file_uuids: readonly string[];
    };
    /** FileManagerAdminDeleteBulkResponse */
    readonly FileManagerAdminDeleteBulkResponse: {
      /** Files */
      readonly files: readonly components["schemas"]["FileManagerAdminFileResponse"][];
    };
    /** FileManagerAdminFileResponse */
    readonly FileManagerAdminFileResponse: {
      /** User Id */
      readonly user_id: number;
      /** File Name */
      readonly file_name: string;
      /** File Size */
      readonly file_size: number;
      /** Content Type */
      readonly content_type: string;
      /**
       * Is Public
       * @default true
       */
      readonly is_public: boolean;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      };
      /** Created At */
      readonly created_at?: string | null;
      /** Updated At */
      readonly updated_at?: string | null;
      /** Expire At */
      readonly expire_at?: string | null;
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
    };
    /** FileManagerAdminUpdateFileRequest */
    readonly FileManagerAdminUpdateFileRequest: {
      /** File Name */
      readonly file_name: string;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      };
    };
    /** FileManagerPresignedUrlsResponse */
    readonly FileManagerPresignedUrlsResponse: {
      /**
       * File Uuid
       * Format: uuid
       */
      readonly file_uuid: string;
      /** Preview Url */
      readonly preview_url: string;
      /** Download Url */
      readonly download_url: string;
      /**
       * Expire At
       * Format: date-time
       */
      readonly expire_at: string;
      /** File Size */
      readonly file_size: number;
      /** Content Type */
      readonly content_type: string;
    };
    /** FilesRow */
    readonly FilesRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** File Name */
      readonly file_name: string;
      /** File Size */
      readonly file_size: number;
      /** Content Type */
      readonly content_type: string;
      /** Is Public */
      readonly is_public: boolean;
      /** Expire At */
      readonly expire_at: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** GenerationActionRequest */
    readonly GenerationActionRequest: {
      /** Reason */
      readonly reason: string;
    };
    /** GenerationDetail */
    readonly GenerationDetail: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Model Uuid */
      readonly model_uuid: string | null;
      /** Model Name */
      readonly model_name: string | null;
      /** Provider Uuid */
      readonly provider_uuid: string | null;
      /** Provider Name */
      readonly provider_name: string | null;
      readonly status: components["schemas"]["GenerationStatusEnum"];
      readonly review_reason:
        components["schemas"]["GenerationReviewReasonEnum"] | null;
      /** Last Error */
      readonly last_error: string | null;
      /** Attempts */
      readonly attempts: number;
      /** Unreadable Polls */
      readonly unreadable_polls: number;
      /** Next Run At */
      readonly next_run_at: string | null;
      /** Has External Task */
      readonly has_external_task: boolean;
      /** Estimated Cost Usdmicro */
      readonly estimated_cost_usdmicro: number | null;
      /** Actual Cost Usdmicro */
      readonly actual_cost_usdmicro: number | null;
      /** Reservation Status */
      readonly reservation_status: string | null;
      /** Reserved Usdmicro */
      readonly reserved_usdmicro: number | null;
      /** Release Reason */
      readonly release_reason: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** GenerationExternalTaskRequest */
    readonly GenerationExternalTaskRequest: {
      /** Reason */
      readonly reason: string;
      /** External Task Id */
      readonly external_task_id: string;
    };
    /**
     * GenerationFailureActionEnum
     * @description What the client should offer the user after a failure.
     * @enum {string}
     */
    readonly GenerationFailureActionEnum:
      "MODIFY_INPUT" | "RETRY_LATER" | "RETRY_NOW" | "CONTACT_SUPPORT";
    /**
     * GenerationFailureReasonEnum
     * @description Why a generation failed, as far as the user can act on it; the provider's own code is kept apart.
     * @enum {string}
     */
    readonly GenerationFailureReasonEnum:
      | "CONTENT_POLICY"
      | "INVALID_INPUT"
      | "RATE_LIMITED"
      | "PROVIDER_UNAVAILABLE"
      | "PROVIDER_TIMEOUT"
      | "PROVIDER_OUT_OF_CREDIT"
      | "PROVIDER_AUTH_FAILED"
      | "PLATFORM_CONFIGURATION"
      | "PROVIDER_FAILED"
      | "INTERNAL"
      | "OPERATOR";
    /**
     * GenerationReviewReasonEnum
     * @enum {string}
     */
    readonly GenerationReviewReasonEnum:
      "COST_UNRESOLVED" | "RESULT_UNREADABLE";
    /** GenerationReviewResponse */
    readonly GenerationReviewResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      readonly status: components["schemas"]["GenerationStatusEnum"];
      readonly review_reason:
        components["schemas"]["GenerationReviewReasonEnum"] | null;
    };
    /** GenerationSetCostRequest */
    readonly GenerationSetCostRequest: {
      /** Reason */
      readonly reason: string;
      /** Actual Cost Usdmicro */
      readonly actual_cost_usdmicro: number;
    };
    /**
     * GenerationStatusEnum
     * @enum {string}
     */
    readonly GenerationStatusEnum:
      | "PENDING"
      | "SUBMITTING"
      | "WAITING_RESULT"
      | "PROCESSING_OUTPUT"
      | "COMPLETED"
      | "FAILED"
      | "NEEDS_REVIEW";
    /** GetWalletTransactionsResponse */
    readonly GetWalletTransactionsResponse: {
      /**
       * Wallet Uuid
       * Format: uuid
       */
      readonly wallet_uuid: string;
      /**
       * Owner User Uuid
       * Format: uuid
       */
      readonly owner_user_uuid: string;
      /** Transactions */
      readonly transactions: readonly components["schemas"]["WalletTransactionResponse"][];
      /** Has Next */
      readonly has_next: boolean;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** HTTPValidationError */
    readonly HTTPValidationError: {
      /** Detail */
      readonly detail?: readonly components["schemas"]["ValidationError"][];
    };
    /** MessageRow */
    readonly MessageRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * Task Uuid
       * Format: uuid
       */
      readonly task_uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Ai Model Uuid */
      readonly ai_model_uuid: string | null;
      /** Task Status */
      readonly task_status: string | null;
      /** Role */
      readonly role: string;
      /** Message */
      readonly message: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** ModelsRow */
    readonly ModelsRow: {
      /** Description */
      readonly description: string | null;
      /** Icon Url */
      readonly icon_url: string | null;
      /** Supported Inputs */
      readonly supported_inputs: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /** Supported Outputs */
      readonly supported_outputs: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][];
      /** Min Cost */
      readonly min_cost?: number | null;
      /** Max Cost */
      readonly max_cost?: number | null;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Model Owner */
      readonly model_owner: string;
      /** Tags */
      readonly tags: readonly string[];
      /** Is Active */
      readonly is_active: boolean;
      /** Display Order */
      readonly display_order: number;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /**
     * PaymentFinancialStatus
     * @enum {string}
     */
    readonly PaymentFinancialStatus: "PENDING" | "SUCCEEDED" | "CLOSED";
    /**
     * PaymentFulfillmentStatus
     * @enum {string}
     */
    readonly PaymentFulfillmentStatus:
      "NOT_READY" | "PENDING" | "SUCCEEDED" | "NEEDS_REVIEW";
    /** PaymentsRow */
    readonly PaymentsRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Target Type */
      readonly target_type: string;
      /** Target Id */
      readonly target_id: string;
      /** Financial Status */
      readonly financial_status: string;
      /** Fulfillment Status */
      readonly fulfillment_status: string;
      /** Total Usdmicro */
      readonly total_usdmicro: number;
      /** Total Irr */
      readonly total_irr: number;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
    };
    /**
     * PlanSettings
     * @description What one subscription plan allows, one key per area of the product, each with its own rules.
     *
     *     Stored as a single JSON object on the plan, so a new area or a new limit needs no migration: add a
     *     section here (like `studio`) or a field in a section, each with a default. A key nobody defined is
     *     rejected, so a typo made in the admin panel is not silently stored and ignored.
     */
    readonly PlanSettings: {
      readonly studio?: components["schemas"]["StudioPlanSettings"];
    };
    /** PlansRow */
    readonly PlansRow: {
      /** Description */
      readonly description: string | null;
      /** Scopes */
      readonly scopes: readonly string[];
      /** Allowed Models */
      readonly allowed_models: readonly string[];
      /** Balance Gift Amount Usdmicro */
      readonly balance_gift_amount_usdmicro: number | null;
      /** Settings */
      readonly settings: {
        readonly [key: string]: unknown;
      };
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      } | null;
      /** Is Recommended */
      readonly is_recommended: boolean;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
      /** Base Price Irr */
      readonly base_price_irr: number | null;
      /** Discounted Price Irr */
      readonly discounted_price_irr: number | null;
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Is Active */
      readonly is_active: boolean;
      /** Is Default */
      readonly is_default: boolean;
      /** Duration Days */
      readonly duration_days: number;
      /** Base Price Usdmicro */
      readonly base_price_usdmicro: number;
      /** Discounted Price Usdmicro */
      readonly discounted_price_usdmicro: number;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** ProvidersRow */
    readonly ProvidersRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Has Api Key */
      readonly has_api_key: boolean;
      readonly unavailable_reason:
        components["schemas"]["AiRegistryProviderUnavailableReasonEnum"] | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /**
     * SaveAdminCaptionPresetRequest
     * @description An admin preset: which users are offered it, and where in the list.
     */
    readonly SaveAdminCaptionPresetRequest: {
      /**
       * Name
       * @description Shown to the user.
       */
      readonly name: string;
      /**
       * Config
       * @description The look of the caption, in the frontend's own format; the backend only keeps it.
       */
      readonly config: {
        readonly [key: string]: unknown;
      };
      /**
       * Schema Version
       * @description Which version of the frontend's format `config` is in.
       * @default 1
       */
      readonly schema_version: number;
      /**
       * Is Active
       * @description A hidden preset is no longer offered to users.
       * @default true
       */
      readonly is_active: boolean;
      /**
       * Sort Order
       * @description Lower comes first.
       * @default 0
       */
      readonly sort_order: number;
    };
    /** SessionsRow */
    readonly SessionsRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /** Revoked At */
      readonly revoked_at: string | null;
      /** Status */
      readonly status: string;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /**
     * SmsTestRequest
     * @example {
     *       "phone_number": "+989123456789"
     *     }
     */
    readonly SmsTestRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
    };
    /** SmsTestResponse */
    readonly SmsTestResponse: {
      /**
       * Status
       * @default queued
       * @constant
       */
      readonly status: "queued";
    };
    /**
     * StudioPlanSettings
     * @description What one subscription plan allows in the studio; a new limit is a new field with a default here.
     *
     *     Stored as one JSON object on the plan, so a new limit needs no migration. A key nobody defined is
     *     rejected, so a typo made in the admin panel is not silently stored and ignored.
     */
    readonly StudioPlanSettings: {
      /**
       * Caption Preset Limit
       * @description How many caption presets of their own a user on this plan can keep.
       * @default 0
       */
      readonly caption_preset_limit: number;
    };
    /** SubscriptionOperationRow */
    readonly SubscriptionOperationRow: {
      /** Operation */
      readonly operation: string;
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * Actor Uuid
       * Format: uuid
       */
      readonly actor_uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Completed */
      readonly completed: boolean;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** SubscriptionPlanResponse */
    readonly SubscriptionPlanResponse: {
      /**
       * @description Currency of the converted *_irr prices.
       * @default IRR
       */
      readonly currency: components["schemas"]["SupportedCurrency"];
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Description */
      readonly description: string | null;
      /** Scopes */
      readonly scopes: readonly string[];
      /** Allowed Models */
      readonly allowed_models: readonly string[];
      /** Base Price Usdmicro */
      readonly base_price_usdmicro: number;
      /** Discounted Price Usdmicro */
      readonly discounted_price_usdmicro: number;
      /** Base Price Irr */
      readonly base_price_irr?: number | null;
      /** Discounted Price Irr */
      readonly discounted_price_irr?: number | null;
      /** Duration Days */
      readonly duration_days: number;
      /** Balance Gift Amount Usdmicro */
      readonly balance_gift_amount_usdmicro: number | null;
      readonly settings: components["schemas"]["PlanSettings"];
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      } | null;
      /** Is Active */
      readonly is_active: boolean;
      /** Is Recommended */
      readonly is_recommended: boolean;
      /** Is Default */
      readonly is_default: boolean;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** SubscriptionsRow */
    readonly SubscriptionsRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /**
       * Plan Uuid
       * Format: uuid
       */
      readonly plan_uuid: string;
      /** Plan Name */
      readonly plan_name: string;
      /** Status */
      readonly status: string;
      /**
       * Started At
       * Format: date-time
       */
      readonly started_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** SuperadminDeleteUserRequest */
    readonly SuperadminDeleteUserRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
    };
    /**
     * SupportedCurrency
     * @enum {string}
     */
    readonly SupportedCurrency: "IRR";
    /** TasksRow */
    readonly TasksRow: {
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Task Type */
      readonly task_type: string;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** TokensRow */
    readonly TokensRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Name */
      readonly name: string;
      /** Scopes */
      readonly scopes: readonly string[];
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /** Revoked At */
      readonly revoked_at: string | null;
      /** Status */
      readonly status: string;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** TopupTierSchema */
    readonly TopupTierSchema: {
      /** From Amount Usdmicro */
      readonly from_amount_usdmicro: number;
      /** Discount Percent */
      readonly discount_percent: number;
    };
    /** TransactionsRow */
    readonly TransactionsRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * Wallet Uuid
       * Format: uuid
       */
      readonly wallet_uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Type */
      readonly type: string;
      /** Source */
      readonly source: string;
      /** Amount Usdmicro */
      readonly amount_usdmicro: number | null;
      /** Balance Before */
      readonly balance_before: number | null;
      /** Balance After */
      readonly balance_after: number | null;
      /** Performed By Admin Uuid */
      readonly performed_by_admin_uuid: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** UpdateSubscriptionPlanRequest */
    readonly UpdateSubscriptionPlanRequest: {
      /** Name */
      readonly name?: string | null;
      /** Display Name */
      readonly display_name?: string | null;
      /** Description */
      readonly description?: string | null;
      /** Scopes */
      readonly scopes?: readonly string[] | null;
      /** Allowed Models */
      readonly allowed_models?: readonly string[] | null;
      /** Base Price Usdmicro */
      readonly base_price_usdmicro?: number | null;
      /** Discounted Price Usdmicro */
      readonly discounted_price_usdmicro?: number | null;
      /** Duration Days */
      readonly duration_days?: number | null;
      /** Balance Gift Amount Usdmicro */
      readonly balance_gift_amount_usdmicro?: number | null;
      readonly settings?: components["schemas"]["PlanSettings"] | null;
      /** Meta */
      readonly meta?: {
        readonly [key: string]: unknown;
      } | null;
      /** Is Active */
      readonly is_active?: boolean | null;
      /** Is Recommended */
      readonly is_recommended?: boolean | null;
      /** Is Default */
      readonly is_default?: boolean | null;
    };
    /** UpdateTopupPolicyRequest */
    readonly UpdateTopupPolicyRequest: {
      /** Profit Percent */
      readonly profit_percent: number;
      /** Min Amount Usdmicro */
      readonly min_amount_usdmicro: number;
      /** Max Amount Usdmicro */
      readonly max_amount_usdmicro: number;
      /** Tiers */
      readonly tiers: readonly components["schemas"]["TopupTierSchema"][];
    };
    /** UserSubscriptionResponse */
    readonly UserSubscriptionResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      readonly plan: components["schemas"]["SubscriptionPlanResponse"];
      /**
       * Started At
       * Format: date-time
       */
      readonly started_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
    };
    /** UsersRow */
    readonly UsersRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Email */
      readonly email: string | null;
      /** Phone Number */
      readonly phone_number: string;
      /** Name */
      readonly name: string | null;
      /** Is Active */
      readonly is_active: boolean;
      /** Is Verified */
      readonly is_verified: boolean;
      /** Scopes */
      readonly scopes: readonly string[];
      /** Default Wallet Uuid */
      readonly default_wallet_uuid: string | null;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /** ValidationError */
    readonly ValidationError: {
      /** Location */
      readonly loc: readonly (string | number)[];
      /** Message */
      readonly msg: string;
      /** Error Type */
      readonly type: string;
      /** Input */
      readonly input?: unknown;
      /** Context */
      readonly ctx?: Record<string, never>;
    };
    /**
     * WalletOperationSourceEnum
     * @description Stable namespaces used in wallet transaction idempotency keys.
     * @enum {string}
     */
    readonly WalletOperationSourceEnum:
      "admin" | "ai_gateway_request" | "ai_task_message" | "subscription";
    /** WalletTransactionResponse */
    readonly WalletTransactionResponse: {
      /**
       * Transaction Uuid
       * Format: uuid
       */
      readonly transaction_uuid: string;
      readonly type: components["schemas"]["WalletTransactionTypeEnum"];
      /** Amount Usdmicro */
      readonly amount_usdmicro: number;
      /** Balance Before */
      readonly balance_before: number;
      /** Balance After */
      readonly balance_after: number;
      /** Meta */
      readonly meta: {
        readonly [key: string]: unknown;
      };
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      readonly updated_at: string;
    };
    /**
     * WalletTransactionTypeEnum
     * @enum {string}
     */
    readonly WalletTransactionTypeEnum: "DEPOSIT" | "WITHDRAW" | "REFUND";
    /** WalletsRow */
    readonly WalletsRow: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /**
       * User Uuid
       * Format: uuid
       */
      readonly user_uuid: string;
      /** Name */
      readonly name: string;
      /** Balance Usdmicro */
      readonly balance_usdmicro: number;
      /** Is Active */
      readonly is_active: boolean;
      /** Is Locked */
      readonly is_locked: boolean;
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
    };
    /** AccessTokenResponse */
    readonly AccessTokenResponse: {
      /** Access Token */
      readonly access_token: string;
      /**
       * Token Type
       * @default bearer
       * @constant
       */
      readonly token_type: "bearer";
      /** Expires In */
      readonly expires_in: number;
    };
    /** ApiTokenListResponse */
    readonly ApiTokenListResponse: {
      /** Items */
      readonly items: readonly components["schemas"]["ApiTokenResponse"][];
      /** Has Next */
      readonly has_next: boolean;
    };
    /** ApiTokenResponse */
    readonly ApiTokenResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Scopes */
      readonly scopes: readonly components["schemas"]["MachineScope"][];
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /** Revoked At */
      readonly revoked_at: string | null;
    };
    /** AuthStartRequest */
    readonly AuthStartRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
    };
    readonly AuthStartResponse:
      | components["schemas"]["PasswordStepResponse"]
      | components["schemas"]["RegistrationStepResponse"];
    /** ChallengeResponse */
    readonly ChallengeResponse: {
      /**
       * Challenge Id
       * Format: uuid
       */
      readonly challenge_id: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /**
       * Resend Available At
       * Format: date-time
       */
      readonly resend_available_at: string;
    };
    /**
     * CreateApiTokenRequest
     * @example {
     *       "expires_in_days": 30,
     *       "name": "AI worker",
     *       "scopes": [
     *         "ai_task:read",
     *         "ai_task:write"
     *       ]
     *     }
     */
    readonly CreateApiTokenRequest: {
      /** Name */
      readonly name: string;
      /** Scopes */
      readonly scopes: readonly components["schemas"]["MachineScope"][];
      /**
       * Expires In Days
       * @default 30
       */
      readonly expires_in_days: number;
    };
    /** CreatedApiTokenResponse */
    readonly CreatedApiTokenResponse: {
      /**
       * Uuid
       * Format: uuid
       */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Scopes */
      readonly scopes: readonly components["schemas"]["MachineScope"][];
      /**
       * Created At
       * Format: date-time
       */
      readonly created_at: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /** Revoked At */
      readonly revoked_at: string | null;
      /** Token */
      readonly token: string;
      /**
       * Token Type
       * @default bearer
       * @constant
       */
      readonly token_type: "bearer";
    };
    /** CsrfResponse */
    readonly CsrfResponse: {
      /** Csrf Token */
      readonly csrf_token: string;
    };
    /**
     * LoginRequest
     * @example {
     *       "password": "example-password-only",
     *       "phone_number": "+989123456789"
     *     }
     */
    readonly LoginRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
      /**
       * Password
       * Format: password
       */
      readonly password: string;
    };
    /**
     * MachineScope
     * @enum {string}
     */
    readonly MachineScope:
      | "ai_registry:read"
      | "ai_task:read"
      | "ai_task:write"
      | "file_manager:read"
      | "file_manager:write";
    /**
     * PasswordChangeRequest
     * @example {
     *       "current_password": "example-password-only",
     *       "new_password": "new-example-password-only"
     *     }
     */
    readonly PasswordChangeRequest: {
      /**
       * Current Password
       * Format: password
       */
      readonly current_password: string;
      /**
       * New Password
       * Format: password
       */
      readonly new_password: string;
    };
    /**
     * PasswordResetChallengeRequest
     * @example {
     *       "phone_number": "+989123456789"
     *     }
     */
    readonly PasswordResetChallengeRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
    };
    /**
     * PasswordResetRequest
     * @example {
     *       "challenge_id": "11111111-1111-4111-8111-111111111111",
     *       "new_password": "new-example-password-only",
     *       "otp_code": "123456"
     *     }
     */
    readonly PasswordResetRequest: {
      /**
       * Challenge Id
       * Format: uuid
       */
      readonly challenge_id: string;
      /** Otp Code */
      readonly otp_code: string;
      /**
       * New Password
       * Format: password
       */
      readonly new_password: string;
    };
    /** PasswordStepResponse */
    readonly PasswordStepResponse: {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      readonly next_step: "password";
    };
    /**
     * RegistrationChallengeRequest
     * @example {
     *       "phone_number": "+989123456789"
     *     }
     */
    readonly RegistrationChallengeRequest: {
      /**
       * Phone Number
       * @example +989123456789
       */
      readonly phone_number: string;
    };
    /**
     * RegistrationRequest
     * @example {
     *       "challenge_id": "11111111-1111-4111-8111-111111111111",
     *       "otp_code": "123456",
     *       "password": "example-password-only"
     *     }
     */
    readonly RegistrationRequest: {
      /**
       * Challenge Id
       * Format: uuid
       */
      readonly challenge_id: string;
      /** Otp Code */
      readonly otp_code: string;
      /**
       * Password
       * Format: password
       */
      readonly password: string;
    };
    /** RegistrationStepResponse */
    readonly RegistrationStepResponse: {
      /**
       * Challenge Id
       * Format: uuid
       */
      readonly challenge_id: string;
      /**
       * Expires At
       * Format: date-time
       */
      readonly expires_at: string;
      /**
       * Resend Available At
       * Format: date-time
       */
      readonly resend_available_at: string;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      readonly next_step: "registration";
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type SchemaActivateUserSubscriptionRequest =
  components["schemas"]["ActivateUserSubscriptionRequest"];
export type SchemaAdminIdentityResponse =
  components["schemas"]["AdminIdentityResponse"];
export type SchemaAdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
export type SchemaAdminPageAuditRow =
  components["schemas"]["AdminPage_AuditRow_"];
export type SchemaAdminPageFilesRow =
  components["schemas"]["AdminPage_FilesRow_"];
export type SchemaAdminPageGenerationDetail =
  components["schemas"]["AdminPage_GenerationDetail_"];
export type SchemaAdminPageMessageRow =
  components["schemas"]["AdminPage_MessageRow_"];
export type SchemaAdminPageModelsRow =
  components["schemas"]["AdminPage_ModelsRow_"];
export type SchemaAdminPagePaymentsRow =
  components["schemas"]["AdminPage_PaymentsRow_"];
export type SchemaAdminPagePlansRow =
  components["schemas"]["AdminPage_PlansRow_"];
export type SchemaAdminPageProvidersRow =
  components["schemas"]["AdminPage_ProvidersRow_"];
export type SchemaAdminPageSessionsRow =
  components["schemas"]["AdminPage_SessionsRow_"];
export type SchemaAdminPageSubscriptionOperationRow =
  components["schemas"]["AdminPage_SubscriptionOperationRow_"];
export type SchemaAdminPageSubscriptionsRow =
  components["schemas"]["AdminPage_SubscriptionsRow_"];
export type SchemaAdminPageTasksRow =
  components["schemas"]["AdminPage_TasksRow_"];
export type SchemaAdminPageTokensRow =
  components["schemas"]["AdminPage_TokensRow_"];
export type SchemaAdminPageTransactionsRow =
  components["schemas"]["AdminPage_TransactionsRow_"];
export type SchemaAdminPageUsersRow =
  components["schemas"]["AdminPage_UsersRow_"];
export type SchemaAdminPageWalletsRow =
  components["schemas"]["AdminPage_WalletsRow_"];
export type SchemaAdminReasonRequest =
  components["schemas"]["AdminReasonRequest"];
export type SchemaAdminReportBucket =
  components["schemas"]["AdminReportBucket"];
export type SchemaAdminSessionListResponse =
  components["schemas"]["AdminSessionListResponse"];
export type SchemaAdminSessionResponse =
  components["schemas"]["AdminSessionResponse"];
export type SchemaAdminSort = components["schemas"]["AdminSort"];
export type SchemaAdminTopupPolicyResponse =
  components["schemas"]["AdminTopupPolicyResponse"];
export type SchemaAiRegistryModeDefinition =
  components["schemas"]["AiRegistryModeDefinition"];
export type SchemaAiRegistryModelCreateRequest =
  components["schemas"]["AiRegistryModelCreateRequest"];
export type SchemaAiRegistryModelDetail =
  components["schemas"]["AiRegistryModelDetail"];
export type SchemaAiRegistryModelOrderRequest =
  components["schemas"]["AiRegistryModelOrderRequest"];
export type SchemaAiRegistryModelOwnerEnum =
  components["schemas"]["AiRegistryModelOwnerEnum"];
export type SchemaAiRegistryModelProviderLinkCreateRequest =
  components["schemas"]["AiRegistryModelProviderLinkCreateRequest"];
export type SchemaAiRegistryModelProviderLinkDetail =
  components["schemas"]["AiRegistryModelProviderLinkDetail"];
export type SchemaAiRegistryModelProviderLinkUpdateRequest =
  components["schemas"]["AiRegistryModelProviderLinkUpdateRequest"];
export type SchemaAiRegistryModelProviderOrderRequest =
  components["schemas"]["AiRegistryModelProviderOrderRequest"];
export type SchemaAiRegistryModelSupportedTypesEnum =
  components["schemas"]["AiRegistryModelSupportedTypesEnum"];
export type SchemaAiRegistryModelUpdateRequest =
  components["schemas"]["AiRegistryModelUpdateRequest"];
export type SchemaAiRegistryProviderCreateRequest =
  components["schemas"]["AiRegistryProviderCreateRequest"];
export type SchemaAiRegistryProviderDetail =
  components["schemas"]["AiRegistryProviderDetail"];
export type SchemaAiRegistryProviderKeyDetail =
  components["schemas"]["AiRegistryProviderKeyDetail"];
export type SchemaAiRegistryProviderKeyRequest =
  components["schemas"]["AiRegistryProviderKeyRequest"];
export type SchemaAiRegistryProviderNameEnum =
  components["schemas"]["AiRegistryProviderNameEnum"];
export type SchemaAiRegistryProviderUnavailableReasonEnum =
  components["schemas"]["AiRegistryProviderUnavailableReasonEnum"];
export type SchemaAiRegistryProviderUpdateRequest =
  components["schemas"]["AiRegistryProviderUpdateRequest"];
export type SchemaAiTaskMessageError =
  components["schemas"]["AiTaskMessageError"];
export type SchemaAiTaskMessageResponse =
  components["schemas"]["AiTaskMessageResponse"];
export type SchemaAiTaskMessageStatusEnum =
  components["schemas"]["AiTaskMessageStatusEnum"];
export type SchemaAiTaskRuleEnum = components["schemas"]["AiTaskRuleEnum"];
export type SchemaAiTaskTypeEnum = components["schemas"]["AiTaskTypeEnum"];
export type SchemaApplicationErrorCode =
  components["schemas"]["ApplicationErrorCode"];
export type SchemaApplicationErrorResponse =
  components["schemas"]["ApplicationErrorResponse"];
export type SchemaAuditRow = components["schemas"]["AuditRow"];
export type SchemaCaptionPresetListResponse =
  components["schemas"]["CaptionPresetListResponse"];
export type SchemaCaptionPresetResponse =
  components["schemas"]["CaptionPresetResponse"];
export type SchemaChargeWalletRequest =
  components["schemas"]["ChargeWalletRequest"];
export type SchemaCreateSubscriptionPlanRequest =
  components["schemas"]["CreateSubscriptionPlanRequest"];
export type SchemaCreateWalletTransactionResponse =
  components["schemas"]["CreateWalletTransactionResponse"];
export type SchemaCurrencyExchangeRateRefreshResponse =
  components["schemas"]["CurrencyExchangeRateRefreshResponse"];
export type SchemaCurrencyUnitEnum = components["schemas"]["CurrencyUnitEnum"];
export type SchemaDeactivateUserSubscriptionRequest =
  components["schemas"]["DeactivateUserSubscriptionRequest"];
export type SchemaFileManagerAdminDeleteBulkRequest =
  components["schemas"]["FileManagerAdminDeleteBulkRequest"];
export type SchemaFileManagerAdminDeleteBulkResponse =
  components["schemas"]["FileManagerAdminDeleteBulkResponse"];
export type SchemaFileManagerAdminFileResponse =
  components["schemas"]["FileManagerAdminFileResponse"];
export type SchemaFileManagerAdminUpdateFileRequest =
  components["schemas"]["FileManagerAdminUpdateFileRequest"];
export type SchemaFileManagerPresignedUrlsResponse =
  components["schemas"]["FileManagerPresignedUrlsResponse"];
export type SchemaFilesRow = components["schemas"]["FilesRow"];
export type SchemaGenerationActionRequest =
  components["schemas"]["GenerationActionRequest"];
export type SchemaGenerationDetail = components["schemas"]["GenerationDetail"];
export type SchemaGenerationExternalTaskRequest =
  components["schemas"]["GenerationExternalTaskRequest"];
export type SchemaGenerationFailureActionEnum =
  components["schemas"]["GenerationFailureActionEnum"];
export type SchemaGenerationFailureReasonEnum =
  components["schemas"]["GenerationFailureReasonEnum"];
export type SchemaGenerationReviewReasonEnum =
  components["schemas"]["GenerationReviewReasonEnum"];
export type SchemaGenerationReviewResponse =
  components["schemas"]["GenerationReviewResponse"];
export type SchemaGenerationSetCostRequest =
  components["schemas"]["GenerationSetCostRequest"];
export type SchemaGenerationStatusEnum =
  components["schemas"]["GenerationStatusEnum"];
export type SchemaGetWalletTransactionsResponse =
  components["schemas"]["GetWalletTransactionsResponse"];
export type SchemaHttpValidationError =
  components["schemas"]["HTTPValidationError"];
export type SchemaMessageRow = components["schemas"]["MessageRow"];
export type SchemaModelsRow = components["schemas"]["ModelsRow"];
export type SchemaPaymentFinancialStatus =
  components["schemas"]["PaymentFinancialStatus"];
export type SchemaPaymentFulfillmentStatus =
  components["schemas"]["PaymentFulfillmentStatus"];
export type SchemaPaymentsRow = components["schemas"]["PaymentsRow"];
export type SchemaPlanSettings = components["schemas"]["PlanSettings"];
export type SchemaPlansRow = components["schemas"]["PlansRow"];
export type SchemaProvidersRow = components["schemas"]["ProvidersRow"];
export type SchemaSaveAdminCaptionPresetRequest =
  components["schemas"]["SaveAdminCaptionPresetRequest"];
export type SchemaSessionsRow = components["schemas"]["SessionsRow"];
export type SchemaSmsTestRequest = components["schemas"]["SmsTestRequest"];
export type SchemaSmsTestResponse = components["schemas"]["SmsTestResponse"];
export type SchemaStudioPlanSettings =
  components["schemas"]["StudioPlanSettings"];
export type SchemaSubscriptionOperationRow =
  components["schemas"]["SubscriptionOperationRow"];
export type SchemaSubscriptionPlanResponse =
  components["schemas"]["SubscriptionPlanResponse"];
export type SchemaSubscriptionsRow = components["schemas"]["SubscriptionsRow"];
export type SchemaSuperadminDeleteUserRequest =
  components["schemas"]["SuperadminDeleteUserRequest"];
export type SchemaSupportedCurrency =
  components["schemas"]["SupportedCurrency"];
export type SchemaTasksRow = components["schemas"]["TasksRow"];
export type SchemaTokensRow = components["schemas"]["TokensRow"];
export type SchemaTopupTierSchema = components["schemas"]["TopupTierSchema"];
export type SchemaTransactionsRow = components["schemas"]["TransactionsRow"];
export type SchemaUpdateSubscriptionPlanRequest =
  components["schemas"]["UpdateSubscriptionPlanRequest"];
export type SchemaUpdateTopupPolicyRequest =
  components["schemas"]["UpdateTopupPolicyRequest"];
export type SchemaUserSubscriptionResponse =
  components["schemas"]["UserSubscriptionResponse"];
export type SchemaUsersRow = components["schemas"]["UsersRow"];
export type SchemaValidationError = components["schemas"]["ValidationError"];
export type SchemaWalletOperationSourceEnum =
  components["schemas"]["WalletOperationSourceEnum"];
export type SchemaWalletTransactionResponse =
  components["schemas"]["WalletTransactionResponse"];
export type SchemaWalletTransactionTypeEnum =
  components["schemas"]["WalletTransactionTypeEnum"];
export type SchemaWalletsRow = components["schemas"]["WalletsRow"];
export type SchemaAccessTokenResponse =
  components["schemas"]["AccessTokenResponse"];
export type SchemaApiTokenListResponse =
  components["schemas"]["ApiTokenListResponse"];
export type SchemaApiTokenResponse = components["schemas"]["ApiTokenResponse"];
export type SchemaAuthStartRequest = components["schemas"]["AuthStartRequest"];
export type SchemaAuthStartResponse =
  components["schemas"]["AuthStartResponse"];
export type SchemaChallengeResponse =
  components["schemas"]["ChallengeResponse"];
export type SchemaCreateApiTokenRequest =
  components["schemas"]["CreateApiTokenRequest"];
export type SchemaCreatedApiTokenResponse =
  components["schemas"]["CreatedApiTokenResponse"];
export type SchemaCsrfResponse = components["schemas"]["CsrfResponse"];
export type SchemaLoginRequest = components["schemas"]["LoginRequest"];
export type SchemaMachineScope = components["schemas"]["MachineScope"];
export type SchemaPasswordChangeRequest =
  components["schemas"]["PasswordChangeRequest"];
export type SchemaPasswordResetChallengeRequest =
  components["schemas"]["PasswordResetChallengeRequest"];
export type SchemaPasswordResetRequest =
  components["schemas"]["PasswordResetRequest"];
export type SchemaPasswordStepResponse =
  components["schemas"]["PasswordStepResponse"];
export type SchemaRegistrationChallengeRequest =
  components["schemas"]["RegistrationChallengeRequest"];
export type SchemaRegistrationRequest =
  components["schemas"]["RegistrationRequest"];
export type SchemaRegistrationStepResponse =
  components["schemas"]["RegistrationStepResponse"];
export type $defs = Record<string, never>;
export interface operations {
  readonly admin_payment_list_payments: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly financial_status?:
          components["schemas"]["PaymentFinancialStatus"] | null;
        readonly fulfillment_status?:
          components["schemas"]["PaymentFulfillmentStatus"] | null;
        readonly target_type?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_PaymentsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_payment_report_payments_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly financial_status?:
          components["schemas"]["PaymentFinancialStatus"] | null;
        readonly fulfillment_status?:
          components["schemas"]["PaymentFulfillmentStatus"] | null;
        readonly target_type?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_payment_report_payments_statuses: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly financial_status?:
          components["schemas"]["PaymentFinancialStatus"] | null;
        readonly fulfillment_status?:
          components["schemas"]["PaymentFulfillmentStatus"] | null;
        readonly target_type?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_payment_get_payments: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["PaymentsRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_list_wallets: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_locked?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_WalletsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_list_transactions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly wallet_uuid?: string | null;
        readonly type?:
          components["schemas"]["WalletTransactionTypeEnum"] | null;
        readonly source?:
          components["schemas"]["WalletOperationSourceEnum"] | null;
        readonly performed_by_admin_uuid?: string | null;
        readonly direction?: ("credit" | "debit") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_TransactionsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_report_transactions_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly wallet_uuid?: string | null;
        readonly type?:
          components["schemas"]["WalletTransactionTypeEnum"] | null;
        readonly source?:
          components["schemas"]["WalletOperationSourceEnum"] | null;
        readonly performed_by_admin_uuid?: string | null;
        readonly direction?: ("credit" | "debit") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_report_transactions_sources: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly wallet_uuid?: string | null;
        readonly type?:
          components["schemas"]["WalletTransactionTypeEnum"] | null;
        readonly source?:
          components["schemas"]["WalletOperationSourceEnum"] | null;
        readonly performed_by_admin_uuid?: string | null;
        readonly direction?: ("credit" | "debit") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_get_wallets: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["WalletsRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_report_wallets_balances: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_locked?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_report_transactions_directions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly amount_min_usdmicro?: number | null;
        readonly amount_max_usdmicro?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly wallet_uuid?: string | null;
        readonly type?:
          components["schemas"]["WalletTransactionTypeEnum"] | null;
        readonly source?:
          components["schemas"]["WalletOperationSourceEnum"] | null;
        readonly performed_by_admin_uuid?: string | null;
        readonly direction?: ("credit" | "debit") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_file_manager_list_files: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly size_min_bytes?: number | null;
        readonly size_max_bytes?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly content_type?: string | null;
        readonly is_public?: boolean | null;
        readonly expired?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_FilesRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_file_manager_report_files_content_types: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly size_min_bytes?: number | null;
        readonly size_max_bytes?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly content_type?: string | null;
        readonly is_public?: boolean | null;
        readonly expired?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_file_manager_report_files_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly size_min_bytes?: number | null;
        readonly size_max_bytes?: number | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly content_type?: string | null;
        readonly is_public?: boolean | null;
        readonly expired?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_list_subscriptions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly expires_from?: string | null;
        readonly expires_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly plan_uuid?: string | null;
        readonly status?:
          ("active" | "expired" | "replaced" | "scheduled") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_SubscriptionsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_report_subscriptions_plans: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly expires_from?: string | null;
        readonly expires_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly plan_uuid?: string | null;
        readonly status?:
          ("active" | "expired" | "replaced" | "scheduled") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_report_subscriptions_expirations: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly expires_from?: string | null;
        readonly expires_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly plan_uuid?: string | null;
        readonly status?:
          ("active" | "expired" | "replaced" | "scheduled") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_list_plans: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_default?: boolean | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_PlansRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_create_subscription_plan: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["CreateSubscriptionPlanRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["SubscriptionPlanResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_get_subscriptions: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["SubscriptionsRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_get_plans: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly plan_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["PlansRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_update_subscription_plan: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly plan_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["UpdateSubscriptionPlanRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["SubscriptionPlanResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_operations: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly actor_uuid?: string | null;
        readonly user_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_SubscriptionOperationRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_list_tasks: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly task_type?: components["schemas"]["AiTaskTypeEnum"] | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_TasksRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_report_tasks_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly task_type?: components["schemas"]["AiTaskTypeEnum"] | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_report_tasks_types: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly task_type?: components["schemas"]["AiTaskTypeEnum"] | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_messages: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
      };
      readonly header?: never;
      readonly path: {
        readonly task_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_MessageRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_get_tasks: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["TasksRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_list_generations: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: components["schemas"]["GenerationStatusEnum"] | null;
        readonly review_reason?:
          components["schemas"]["GenerationReviewReasonEnum"] | null;
        readonly open_only?: boolean;
        readonly model_uuid?: string | null;
        readonly provider_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_GenerationDetail_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_get_generation: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["GenerationDetail"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_report_requests_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: components["schemas"]["GenerationStatusEnum"] | null;
        readonly review_reason?:
          components["schemas"]["GenerationReviewReasonEnum"] | null;
        readonly open_only?: boolean;
        readonly model_uuid?: string | null;
        readonly provider_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_report_requests_models: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: components["schemas"]["GenerationStatusEnum"] | null;
        readonly review_reason?:
          components["schemas"]["GenerationReviewReasonEnum"] | null;
        readonly open_only?: boolean;
        readonly model_uuid?: string | null;
        readonly provider_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_report_requests_providers: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: components["schemas"]["GenerationStatusEnum"] | null;
        readonly review_reason?:
          components["schemas"]["GenerationReviewReasonEnum"] | null;
        readonly open_only?: boolean;
        readonly model_uuid?: string | null;
        readonly provider_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_report_requests_statuses: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: components["schemas"]["GenerationStatusEnum"] | null;
        readonly review_reason?:
          components["schemas"]["GenerationReviewReasonEnum"] | null;
        readonly open_only?: boolean;
        readonly model_uuid?: string | null;
        readonly provider_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_list_models: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly tag?: string | null;
        readonly input_type?:
          components["schemas"]["AiRegistryModelSupportedTypesEnum"] | null;
        readonly output_type?:
          components["schemas"]["AiRegistryModelSupportedTypesEnum"] | null;
        readonly provider_uuid?: string | null;
        readonly resource_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly model_owner?:
          components["schemas"]["AiRegistryModelOwnerEnum"] | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_ModelsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_create_model: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelCreateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_report_models_statuses: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly tag?: string | null;
        readonly input_type?:
          components["schemas"]["AiRegistryModelSupportedTypesEnum"] | null;
        readonly output_type?:
          components["schemas"]["AiRegistryModelSupportedTypesEnum"] | null;
        readonly provider_uuid?: string | null;
        readonly resource_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly model_owner?:
          components["schemas"]["AiRegistryModelOwnerEnum"] | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_list_providers: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly search?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_ProvidersRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_create_provider: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryProviderCreateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryProviderDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_user_list_users: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_verified?: boolean | null;
        readonly role?: ("user" | "admin" | "superadmin") | null;
        readonly plan_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_UsersRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_users_hard_delete_user: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SuperadminDeleteUserRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_user_report_users_daily: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_verified?: boolean | null;
        readonly role?: ("user" | "admin" | "superadmin") | null;
        readonly plan_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_user_report_users_statuses: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_verified?: boolean | null;
        readonly role?: ("user" | "admin" | "superadmin") | null;
        readonly plan_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_user_get_users: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly resource_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["UsersRow"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Resource not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_user_report_users_verification: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly is_active?: boolean | null;
        readonly is_verified?: boolean | null;
        readonly role?: ("user" | "admin" | "superadmin") | null;
        readonly plan_uuid?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_list_tokens: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: ("active" | "revoked" | "expired") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_TokensRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_report_tokens_api_tokens: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly search?: string | null;
        readonly status?: ("active" | "revoked" | "expired") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_search_sessions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly status?: ("active" | "revoked" | "expired") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_SessionsRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_report_sessions_sessions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly resource_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly status?: ("active" | "revoked" | "expired") | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AdminReportBucket_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_identity: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminIdentityResponse"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly admin_auth_audit_events: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
        readonly sort?: components["schemas"]["AdminSort"];
        readonly created_from?: string | null;
        readonly created_to?: string | null;
        readonly actor_uuid?: string | null;
        readonly user_uuid?: string | null;
        readonly action?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminPage_AuditRow_"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_list_sessions: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
      };
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminSessionListResponse"];
        };
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Current role cannot manage this user */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description User or owned session not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_revoke_sessions: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: {
      readonly content: {
        readonly "application/json":
          components["schemas"]["AdminReasonRequest"] | null;
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Current role cannot manage this user */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description User or owned session not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_revoke_session: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
        readonly session_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: {
      readonly content: {
        readonly "application/json":
          components["schemas"]["AdminReasonRequest"] | null;
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Current role cannot manage this user */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description User or owned session not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_ban_user: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: {
      readonly content: {
        readonly "application/json":
          components["schemas"]["AdminReasonRequest"] | null;
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Current role cannot manage this user */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description User or owned session not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_unban_user: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: {
      readonly content: {
        readonly "application/json":
          components["schemas"]["AdminReasonRequest"] | null;
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Current role cannot manage this user */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description User or owned session not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_revoke_api_token: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly token_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Live administrator session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Insufficient current role */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Token not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_auth_test_sms: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SmsTestRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 202: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["SmsTestResponse"];
        };
      };
      /** @description Invalid or revoked access session */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Administrator role required */
      readonly 403: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Send budget exhausted; retry after the Retry-After header */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unable to queue the SMS test */
      readonly 500: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly admin_subscription_activate_user_subscription: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        readonly "Idempotency-Key": string;
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["ActivateUserSubscriptionRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["UserSubscriptionResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_subscription_deactivate_user_subscription: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        readonly "Idempotency-Key": string;
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["DeactivateUserSubscriptionRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["UserSubscriptionResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_studio_list_caption_presets: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CaptionPresetListResponse"];
        };
      };
    };
  };
  readonly admin_studio_create_caption_preset: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SaveAdminCaptionPresetRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CaptionPresetResponse"];
        };
      };
      /** @description Unprocessable Content */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_studio_update_caption_preset: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly preset_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SaveAdminCaptionPresetRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CaptionPresetResponse"];
        };
      };
      /** @description Not Found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Unprocessable Content */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_studio_delete_caption_preset: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly preset_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Not Found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallet_get_topup_policy: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminTopupPolicyResponse"];
        };
      };
    };
  };
  readonly admin_wallet_update_topup_policy: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["UpdateTopupPolicyRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AdminTopupPolicyResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallets_get_wallet_transactions: {
    readonly parameters: {
      readonly query: {
        readonly user_uuid: string;
        readonly type?:
          components["schemas"]["WalletTransactionTypeEnum"] | null;
        readonly source?:
          components["schemas"]["WalletOperationSourceEnum"] | null;
        readonly offset?: number;
        readonly limit?: number;
      };
      readonly header?: never;
      readonly path: {
        readonly wallet_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["GetWalletTransactionsResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_wallets_charge_wallet: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        readonly "Idempotency-Key": string;
      };
      readonly path: {
        readonly wallet_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["ChargeWalletRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 201: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CreateWalletTransactionResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_exchange_rate_refresh: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CurrencyExchangeRateRefreshResponse"];
        };
      };
    };
  };
  readonly admin_exchange_rate_latest: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CurrencyExchangeRateRefreshResponse"];
        };
      };
    };
  };
  readonly admin_file_manager_get_file: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["FileManagerAdminFileResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_file_manager_delete_file: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["FileManagerAdminFileResponse"];
        };
      };
      /** @description Not Found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Conflict */
      readonly 409: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Internal Server Error */
      readonly 500: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_file_manager_update_file: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["FileManagerAdminUpdateFileRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["FileManagerAdminFileResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_file_manager_delete_bulk_files: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["FileManagerAdminDeleteBulkRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["FileManagerAdminDeleteBulkResponse"];
        };
      };
      /** @description Not Found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Conflict */
      readonly 409: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Internal Server Error */
      readonly 500: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_file_preview: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly file_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["FileManagerPresignedUrlsResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_task_check_user_task_result: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly user_uuid: string;
        readonly task_message_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiTaskMessageResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_generation_external_task: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["GenerationExternalTaskRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["GenerationReviewResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_generation_set_cost: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["GenerationSetCostRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["GenerationReviewResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_gateway_generation_fail: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly generation_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["GenerationActionRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["GenerationReviewResponse"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_get_provider: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_provider_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryProviderDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_update_provider: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_provider_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryProviderUpdateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryProviderDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_get_model: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_update_model: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelUpdateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_add_provider_to_model: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelProviderLinkCreateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly admin_ai_registry_reorder_models: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelOrderRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unprocessable Content */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_ai_registry_reorder_model_providers: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelProviderOrderRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Not Found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
      /** @description Unprocessable Content */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
        };
      };
    };
  };
  readonly admin_ai_registry_update_provider_link: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly ai_model_uuid: string;
        readonly ai_provider_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AiRegistryModelProviderLinkUpdateRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AiRegistryModelDetail"];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly auth_login: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["LoginRequest"];
      };
    };
    readonly responses: {
      /** @description Access token; refresh token is set in a Secure HttpOnly cookie. */
      readonly 200: {
        headers: {
          readonly "X-CSRF-TOKEN"?: string;
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AccessTokenResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_csrf: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CsrfResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_refresh: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /** @description CSRF value from login/refresh response header or GET /auth/csrf. */
        readonly "X-CSRF-TOKEN": string;
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Access token; refresh token is set in a Secure HttpOnly cookie. */
      readonly 200: {
        headers: {
          readonly "X-CSRF-TOKEN"?: string;
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AccessTokenResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_logout: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /** @description CSRF value from login/refresh response header or GET /auth/csrf. */
        readonly "X-CSRF-TOKEN": string;
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_logout_all: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_registration_challenge: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["RegistrationChallengeRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 201: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ChallengeResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_register: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["RegistrationRequest"];
      };
    };
    readonly responses: {
      /** @description Access token; refresh token is set in a Secure HttpOnly cookie. */
      readonly 201: {
        headers: {
          readonly "X-CSRF-TOKEN"?: string;
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AccessTokenResponse"];
        };
      };
      /** @description Invalid challenge or code */
      readonly 400: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_challenge_resend: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly challenge_id: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ChallengeResponse"];
        };
      };
      /** @description Invalid challenge or code */
      readonly 400: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_password_reset_challenge: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["PasswordResetChallengeRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 201: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ChallengeResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_password_reset: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["PasswordResetRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid challenge or code */
      readonly 400: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_password_change: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["PasswordChangeRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_start: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["AuthStartRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["AuthStartResponse"];
        };
      };
      /** @description Unauthorized */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Rate limit exceeded */
      readonly 429: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_list_api_tokens: {
    readonly parameters: {
      readonly query?: {
        readonly offset?: number;
        readonly limit?: number;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["ApiTokenListResponse"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Owned token not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  readonly auth_create_api_token: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["CreateApiTokenRequest"];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 201: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["CreatedApiTokenResponse"];
        };
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Owned token not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Maximum 20 active tokens */
      readonly 409: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Current plan must grant every requested scope */
      readonly 426: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  readonly auth_revoke_api_token: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly token_uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      /** @description Successful Response */
      readonly 204: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Live browser session required */
      readonly 401: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Owned token not found */
      readonly 404: {
        headers: {
          readonly [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
}
type FlattenedDeepRequired<T> = {
  [K in keyof T]-?: FlattenedDeepRequired<
    T[K] extends unknown[] | undefined | null
      ? Extract<T[K], unknown[]>[number]
      : T[K]
  >;
};
type ReadonlyArray<T> = [Exclude<T, undefined>] extends [unknown[]]
  ? Readonly<Exclude<T, undefined>>
  : Readonly<Exclude<T, undefined>[]>;
export const pathsApiAdminV1WalletTransactionsGetParametersQueryDirectionAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/wallet-transactions"]["get"]["parameters"]["query"]["direction"]
> = ["credit", "debit"];
export const pathsApiAdminV1WalletReportsDailyGetParametersQueryDirectionAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/wallet/reports/daily"]["get"]["parameters"]["query"]["direction"]
> = ["credit", "debit"];
export const pathsApiAdminV1WalletReportsSourcesGetParametersQueryDirectionAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/wallet/reports/sources"]["get"]["parameters"]["query"]["direction"]
> = ["credit", "debit"];
export const pathsApiAdminV1WalletReportsDirectionsGetParametersQueryDirectionAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/wallet/reports/directions"]["get"]["parameters"]["query"]["direction"]
> = ["credit", "debit"];
export const pathsApiAdminV1SubscriptionsGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/subscriptions"]["get"]["parameters"]["query"]["status"]
> = ["active", "expired", "replaced", "scheduled"];
export const pathsApiAdminV1SubscriptionReportsPlansGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/subscription/reports/plans"]["get"]["parameters"]["query"]["status"]
> = ["active", "expired", "replaced", "scheduled"];
export const pathsApiAdminV1SubscriptionReportsExpirationsGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/subscription/reports/expirations"]["get"]["parameters"]["query"]["status"]
> = ["active", "expired", "replaced", "scheduled"];
export const pathsApiAdminV1UsersGetParametersQueryRoleAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/users"]["get"]["parameters"]["query"]["role"]
> = ["user", "admin", "superadmin"];
export const pathsApiAdminV1UsersReportsDailyGetParametersQueryRoleAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/users/reports/daily"]["get"]["parameters"]["query"]["role"]
> = ["user", "admin", "superadmin"];
export const pathsApiAdminV1UsersReportsStatusesGetParametersQueryRoleAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/users/reports/statuses"]["get"]["parameters"]["query"]["role"]
> = ["user", "admin", "superadmin"];
export const pathsApiAdminV1UsersReportsVerificationGetParametersQueryRoleAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/users/reports/verification"]["get"]["parameters"]["query"]["role"]
> = ["user", "admin", "superadmin"];
export const pathsApiAdminV1AuthApiTokensGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/auth/api-tokens"]["get"]["parameters"]["query"]["status"]
> = ["active", "revoked", "expired"];
export const pathsApiAdminV1AuthReportsApiTokensGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/auth/reports/api-tokens"]["get"]["parameters"]["query"]["status"]
> = ["active", "revoked", "expired"];
export const pathsApiAdminV1AuthSessionsGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/auth/sessions"]["get"]["parameters"]["query"]["status"]
> = ["active", "revoked", "expired"];
export const pathsApiAdminV1AuthReportsSessionsGetParametersQueryStatusAnyOf0Values: ReadonlyArray<
  FlattenedDeepRequired<paths>["/api/admin/v1/auth/reports/sessions"]["get"]["parameters"]["query"]["status"]
> = ["active", "revoked", "expired"];
export const adminSortValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AdminSort"]
> = ["-created_at", "created_at"];
export const aiRegistryModelOwnerEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiRegistryModelOwnerEnum"]
> = [
  "ALIBABA",
  "OPEN_AI",
  "GOOGLE",
  "BLACK_FOREST_LABS",
  "K_LING_AI",
  "BRIA",
  "BYTE_DANCE",
  "HEYGEN",
  "IMAGINE_ART",
  "LIGHT_TICKS",
  "MID_JOURNEY",
  "MINI_MAX",
  "PIX_VERSE",
  "PRUNA_AI",
  "RUNWAY",
  "SOURCE_FUL",
  "VIDU",
  "IDEOGRAM",
  "X_AI",
];
export const aiRegistryModelSupportedTypesEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiRegistryModelSupportedTypesEnum"]
> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const aiRegistryProviderNameEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiRegistryProviderNameEnum"]
> = ["RUNWARE", "AIMLAPI", "KIE", "OPENAI", "GOOGLE", "OPENROUTER"];
export const aiRegistryProviderUnavailableReasonEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiRegistryProviderUnavailableReasonEnum"]
> = ["OUT_OF_CREDIT", "AUTH_FAILED"];
export const aiTaskMessageStatusEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiTaskMessageStatusEnum"]
> = ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED"];
export const aiTaskRuleEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiTaskRuleEnum"]
> = ["SYSTEM", "USER", "ASSISTANT", "TOOL", "FUNCTION", "INLINE"];
export const aiTaskTypeEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["AiTaskTypeEnum"]
> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const applicationErrorCodeValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["ApplicationErrorCode"]
> = [
  900, 901, 902, 999, 1000, 1100, 1103, 1104, 1106, 1107, 1108, 1109, 1200,
  1201, 1202, 1203, 1204, 1205, 1206, 1300, 1301, 1302, 1303, 1304, 1305, 1306,
  1307, 1308, 1309, 1310, 1400, 1401, 1500, 1501, 1502, 1503, 1504, 1505, 1506,
  1507, 1600, 1601, 1602, 1603, 1604, 1605, 1700, 1701, 1702, 1800, 1801, 1802,
  1803, 1804, 1805, 1806, 1807, 1808, 1810, 1811, 1812, 1813, 1814, 1815, 1816,
  1900, 1901, 1902, 1903, 1904, 1906, 1907,
];
export const currencyUnitEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["CurrencyUnitEnum"]
> = ["USD", "IRR", "USDMICRO"];
export const generationFailureActionEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["GenerationFailureActionEnum"]
> = ["MODIFY_INPUT", "RETRY_LATER", "RETRY_NOW", "CONTACT_SUPPORT"];
export const generationFailureReasonEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["GenerationFailureReasonEnum"]
> = [
  "CONTENT_POLICY",
  "INVALID_INPUT",
  "RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "PROVIDER_TIMEOUT",
  "PROVIDER_OUT_OF_CREDIT",
  "PROVIDER_AUTH_FAILED",
  "PLATFORM_CONFIGURATION",
  "PROVIDER_FAILED",
  "INTERNAL",
  "OPERATOR",
];
export const generationReviewReasonEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["GenerationReviewReasonEnum"]
> = ["COST_UNRESOLVED", "RESULT_UNREADABLE"];
export const generationStatusEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["GenerationStatusEnum"]
> = [
  "PENDING",
  "SUBMITTING",
  "WAITING_RESULT",
  "PROCESSING_OUTPUT",
  "COMPLETED",
  "FAILED",
  "NEEDS_REVIEW",
];
export const paymentFinancialStatusValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["PaymentFinancialStatus"]
> = ["PENDING", "SUCCEEDED", "CLOSED"];
export const paymentFulfillmentStatusValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["PaymentFulfillmentStatus"]
> = ["NOT_READY", "PENDING", "SUCCEEDED", "NEEDS_REVIEW"];
export const supportedCurrencyValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["SupportedCurrency"]
> = ["IRR"];
export const walletOperationSourceEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["WalletOperationSourceEnum"]
> = ["admin", "ai_gateway_request", "ai_task_message", "subscription"];
export const walletTransactionTypeEnumValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["WalletTransactionTypeEnum"]
> = ["DEPOSIT", "WITHDRAW", "REFUND"];
export const machineScopeValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["MachineScope"]
> = [
  "ai_registry:read",
  "ai_task:read",
  "ai_task:write",
  "file_manager:read",
  "file_manager:write",
];
export const passwordStepResponseNext_stepValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["PasswordStepResponse"]["next_step"]
> = ["password"];
export const registrationStepResponseNext_stepValues: ReadonlyArray<
  FlattenedDeepRequired<components>["schemas"]["RegistrationStepResponse"]["next_step"]
> = ["registration"];

export const AdminSortMap = {
  "-created_at": "-created_at",
  created_at: "created_at",
} as const;
export type AdminSortKey = keyof typeof AdminSortMap;
export type AdminSortValue = (typeof AdminSortMap)[AdminSortKey];

export const AiRegistryModelOwnerEnumMap = {
  ALIBABA: "ALIBABA",
  OPEN_AI: "OPEN_AI",
  GOOGLE: "GOOGLE",
  BLACK_FOREST_LABS: "BLACK_FOREST_LABS",
  K_LING_AI: "K_LING_AI",
  BRIA: "BRIA",
  BYTE_DANCE: "BYTE_DANCE",
  HEYGEN: "HEYGEN",
  IMAGINE_ART: "IMAGINE_ART",
  LIGHT_TICKS: "LIGHT_TICKS",
  MID_JOURNEY: "MID_JOURNEY",
  MINI_MAX: "MINI_MAX",
  PIX_VERSE: "PIX_VERSE",
  PRUNA_AI: "PRUNA_AI",
  RUNWAY: "RUNWAY",
  SOURCE_FUL: "SOURCE_FUL",
  VIDU: "VIDU",
  IDEOGRAM: "IDEOGRAM",
  X_AI: "X_AI",
} as const;
export type AiRegistryModelOwnerEnumKey =
  keyof typeof AiRegistryModelOwnerEnumMap;
export type AiRegistryModelOwnerEnumValue =
  (typeof AiRegistryModelOwnerEnumMap)[AiRegistryModelOwnerEnumKey];

export const AiRegistryModelSupportedTypesEnumMap = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
} as const;
export type AiRegistryModelSupportedTypesEnumKey =
  keyof typeof AiRegistryModelSupportedTypesEnumMap;
export type AiRegistryModelSupportedTypesEnumValue =
  (typeof AiRegistryModelSupportedTypesEnumMap)[AiRegistryModelSupportedTypesEnumKey];

export const AiRegistryProviderNameEnumMap = {
  RUNWARE: "RUNWARE",
  AIMLAPI: "AIMLAPI",
  KIE: "KIE",
  OPENAI: "OPENAI",
  GOOGLE: "GOOGLE",
  OPENROUTER: "OPENROUTER",
} as const;
export type AiRegistryProviderNameEnumKey =
  keyof typeof AiRegistryProviderNameEnumMap;
export type AiRegistryProviderNameEnumValue =
  (typeof AiRegistryProviderNameEnumMap)[AiRegistryProviderNameEnumKey];

export const AiRegistryProviderUnavailableReasonEnumMap = {
  OUT_OF_CREDIT: "OUT_OF_CREDIT",
  AUTH_FAILED: "AUTH_FAILED",
} as const;
export type AiRegistryProviderUnavailableReasonEnumKey =
  keyof typeof AiRegistryProviderUnavailableReasonEnumMap;
export type AiRegistryProviderUnavailableReasonEnumValue =
  (typeof AiRegistryProviderUnavailableReasonEnumMap)[AiRegistryProviderUnavailableReasonEnumKey];

export const AiTaskMessageStatusEnumMap = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;
export type AiTaskMessageStatusEnumKey =
  keyof typeof AiTaskMessageStatusEnumMap;
export type AiTaskMessageStatusEnumValue =
  (typeof AiTaskMessageStatusEnumMap)[AiTaskMessageStatusEnumKey];

export const AiTaskRuleEnumMap = {
  SYSTEM: "SYSTEM",
  USER: "USER",
  ASSISTANT: "ASSISTANT",
  TOOL: "TOOL",
  FUNCTION: "FUNCTION",
  INLINE: "INLINE",
} as const;
export type AiTaskRuleEnumKey = keyof typeof AiTaskRuleEnumMap;
export type AiTaskRuleEnumValue = (typeof AiTaskRuleEnumMap)[AiTaskRuleEnumKey];

export const AiTaskTypeEnumMap = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
} as const;
export type AiTaskTypeEnumKey = keyof typeof AiTaskTypeEnumMap;
export type AiTaskTypeEnumValue = (typeof AiTaskTypeEnumMap)[AiTaskTypeEnumKey];

export const ApplicationErrorCodeMap = {
  900: 900,
  901: 901,
  902: 902,
  999: 999,
  1000: 1000,
  1100: 1100,
  1103: 1103,
  1104: 1104,
  1106: 1106,
  1107: 1107,
  1108: 1108,
  1109: 1109,
  1200: 1200,
  1201: 1201,
  1202: 1202,
  1203: 1203,
  1204: 1204,
  1205: 1205,
  1206: 1206,
  1300: 1300,
  1301: 1301,
  1302: 1302,
  1303: 1303,
  1304: 1304,
  1305: 1305,
  1306: 1306,
  1307: 1307,
  1308: 1308,
  1309: 1309,
  1310: 1310,
  1400: 1400,
  1401: 1401,
  1500: 1500,
  1501: 1501,
  1502: 1502,
  1503: 1503,
  1504: 1504,
  1505: 1505,
  1506: 1506,
  1507: 1507,
  1600: 1600,
  1601: 1601,
  1602: 1602,
  1603: 1603,
  1604: 1604,
  1605: 1605,
  1700: 1700,
  1701: 1701,
  1702: 1702,
  1800: 1800,
  1801: 1801,
  1802: 1802,
  1803: 1803,
  1804: 1804,
  1805: 1805,
  1806: 1806,
  1807: 1807,
  1808: 1808,
  1810: 1810,
  1811: 1811,
  1812: 1812,
  1813: 1813,
  1814: 1814,
  1815: 1815,
  1816: 1816,
  1900: 1900,
  1901: 1901,
  1902: 1902,
  1903: 1903,
  1904: 1904,
  1906: 1906,
  1907: 1907,
} as const;
export type ApplicationErrorCodeKey = keyof typeof ApplicationErrorCodeMap;
export type ApplicationErrorCodeValue =
  (typeof ApplicationErrorCodeMap)[ApplicationErrorCodeKey];

export const CurrencyUnitEnumMap = {
  USD: "USD",
  IRR: "IRR",
  USDMICRO: "USDMICRO",
} as const;
export type CurrencyUnitEnumKey = keyof typeof CurrencyUnitEnumMap;
export type CurrencyUnitEnumValue =
  (typeof CurrencyUnitEnumMap)[CurrencyUnitEnumKey];

export const GenerationFailureActionEnumMap = {
  MODIFY_INPUT: "MODIFY_INPUT",
  RETRY_LATER: "RETRY_LATER",
  RETRY_NOW: "RETRY_NOW",
  CONTACT_SUPPORT: "CONTACT_SUPPORT",
} as const;
export type GenerationFailureActionEnumKey =
  keyof typeof GenerationFailureActionEnumMap;
export type GenerationFailureActionEnumValue =
  (typeof GenerationFailureActionEnumMap)[GenerationFailureActionEnumKey];

export const GenerationFailureReasonEnumMap = {
  CONTENT_POLICY: "CONTENT_POLICY",
  INVALID_INPUT: "INVALID_INPUT",
  RATE_LIMITED: "RATE_LIMITED",
  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
  PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT",
  PROVIDER_OUT_OF_CREDIT: "PROVIDER_OUT_OF_CREDIT",
  PROVIDER_AUTH_FAILED: "PROVIDER_AUTH_FAILED",
  PLATFORM_CONFIGURATION: "PLATFORM_CONFIGURATION",
  PROVIDER_FAILED: "PROVIDER_FAILED",
  INTERNAL: "INTERNAL",
  OPERATOR: "OPERATOR",
} as const;
export type GenerationFailureReasonEnumKey =
  keyof typeof GenerationFailureReasonEnumMap;
export type GenerationFailureReasonEnumValue =
  (typeof GenerationFailureReasonEnumMap)[GenerationFailureReasonEnumKey];

export const GenerationReviewReasonEnumMap = {
  COST_UNRESOLVED: "COST_UNRESOLVED",
  RESULT_UNREADABLE: "RESULT_UNREADABLE",
} as const;
export type GenerationReviewReasonEnumKey =
  keyof typeof GenerationReviewReasonEnumMap;
export type GenerationReviewReasonEnumValue =
  (typeof GenerationReviewReasonEnumMap)[GenerationReviewReasonEnumKey];

export const GenerationStatusEnumMap = {
  PENDING: "PENDING",
  SUBMITTING: "SUBMITTING",
  WAITING_RESULT: "WAITING_RESULT",
  PROCESSING_OUTPUT: "PROCESSING_OUTPUT",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  NEEDS_REVIEW: "NEEDS_REVIEW",
} as const;
export type GenerationStatusEnumKey = keyof typeof GenerationStatusEnumMap;
export type GenerationStatusEnumValue =
  (typeof GenerationStatusEnumMap)[GenerationStatusEnumKey];

export const PaymentFinancialStatusMap = {
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  CLOSED: "CLOSED",
} as const;
export type PaymentFinancialStatusKey = keyof typeof PaymentFinancialStatusMap;
export type PaymentFinancialStatusValue =
  (typeof PaymentFinancialStatusMap)[PaymentFinancialStatusKey];

export const PaymentFulfillmentStatusMap = {
  NOT_READY: "NOT_READY",
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  NEEDS_REVIEW: "NEEDS_REVIEW",
} as const;
export type PaymentFulfillmentStatusKey =
  keyof typeof PaymentFulfillmentStatusMap;
export type PaymentFulfillmentStatusValue =
  (typeof PaymentFulfillmentStatusMap)[PaymentFulfillmentStatusKey];

export const SupportedCurrencyMap = {
  IRR: "IRR",
} as const;
export type SupportedCurrencyKey = keyof typeof SupportedCurrencyMap;
export type SupportedCurrencyValue =
  (typeof SupportedCurrencyMap)[SupportedCurrencyKey];

export const WalletOperationSourceEnumMap = {
  admin: "admin",
  ai_gateway_request: "ai_gateway_request",
  ai_task_message: "ai_task_message",
  subscription: "subscription",
} as const;
export type WalletOperationSourceEnumKey =
  keyof typeof WalletOperationSourceEnumMap;
export type WalletOperationSourceEnumValue =
  (typeof WalletOperationSourceEnumMap)[WalletOperationSourceEnumKey];

export const WalletTransactionTypeEnumMap = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  REFUND: "REFUND",
} as const;
export type WalletTransactionTypeEnumKey =
  keyof typeof WalletTransactionTypeEnumMap;
export type WalletTransactionTypeEnumValue =
  (typeof WalletTransactionTypeEnumMap)[WalletTransactionTypeEnumKey];

export const MachineScopeMap = {
  "ai_registry:read": "ai_registry:read",
  "ai_task:read": "ai_task:read",
  "ai_task:write": "ai_task:write",
  "file_manager:read": "file_manager:read",
  "file_manager:write": "file_manager:write",
} as const;
export type MachineScopeKey = keyof typeof MachineScopeMap;
export type MachineScopeValue = (typeof MachineScopeMap)[MachineScopeKey];
