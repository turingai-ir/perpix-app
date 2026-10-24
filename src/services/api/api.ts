export interface paths {
    readonly "/api/v1/user/get-info": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Info */
        readonly get: operations["get_info_api_v1_user_get_info_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/edit-info": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        /** Edit User Info */
        readonly patch: operations["edit_user_info_api_v1_user_edit_info_patch"];
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
    readonly "/api/v1/user/subscription/plans": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Subscription Plans */
        readonly get: operations["get_subscription_plans_api_v1_user_subscription_plans_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/subscription/active": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Active Subscription */
        readonly get: operations["get_active_subscription_api_v1_user_subscription_active_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/subscription/purchase": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Purchase Subscription */
        readonly post: operations["purchase_subscription_api_v1_user_subscription_purchase_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/wallet/charge": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Charge Wallet */
        readonly post: operations["charge_wallet_api_v1_wallet_charge_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/wallet/wallet": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Current User Wallet */
        readonly get: operations["get_current_user_wallet_api_v1_wallet_wallet_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/wallet/transactions": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Wallet Transactions */
        readonly get: operations["get_wallet_transactions_api_v1_wallet_transactions_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-events": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Stream the authenticated user's payment changes */
        readonly get: operations["stream_payment_events_api_v1_payment_events_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-intents": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List authenticated user's payment intents */
        readonly get: operations["get_payment_intents_api_v1_payment_intents_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-intents/{intent_uuid}/executions": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Retry payment execution
         * @description Initiates a retry execution for a failed or expired payment intent. Core creates the execution UUID.
         */
        readonly post: operations["retry_payment_api_v1_payment_intents__intent_uuid__executions_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-intents/{intent_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
            };
            readonly cookie?: never;
        };
        /**
         * Get payment intent status
         * @description Retrieves the current status of a payment intent owned by the authenticated user.
         */
        readonly get: operations["get_payment_intent_api_v1_payment_intents__intent_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-intents/{intent_uuid}/details": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get saved payment amounts */
        readonly get: operations["get_payment_details_api_v1_payment_intents__intent_uuid__details_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-executions/{execution_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly execution_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get the requested payment attempt */
        readonly get: operations["get_payment_execution_api_v1_payment_executions__execution_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/payment-return/{execution_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly execution_uuid: string;
            };
            readonly cookie?: never;
        };
        /**
         * Handle gateway return callback
         * @description Reads remote payment evidence without creating a payment, then redirects to the frontend.
         */
        readonly get: operations["payment_return_api_v1_payment_return__execution_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/readiness": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Core readiness probe
         * @description Verifies Core database and reports payment subsystem readiness. Provider outages do not fail Core readiness.
         */
        readonly get: operations["readiness_api_v1_readiness_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/simple-upload": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Simple Upload
         * @description Private upload up to 5 MiB. With managed media validation enabled: 413 size, 415 unsupported/mismatched format, 422 invalid media, 503 temporary unavailability. Request body is limited to 5 MiB plus 64 KiB multipart overhead. Each POST creates a new upload; no automatic POST retry or idempotency guarantee.
         */
        readonly post: operations["simple_upload_api_v1_file_manager_simple_upload_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/user-files": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List User Files */
        readonly get: operations["list_user_files_api_v1_file_manager_user_files_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/files/presigned-urls": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Get File Presigned Urls */
        readonly post: operations["get_file_presigned_urls_api_v1_file_manager_files_presigned_urls_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/files/{file_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly file_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly get?: never;
        /**
         * Replace File
         * @description Replace file bytes while retaining its UUID and MIME. Managed replacement validates up to 100 MiB before storage and atomically updates object identity and media facts using CAS. Missing/foreign/expired files return 404; legacy/public managed targets or concurrent changes return 409. Invalid media returns 413/415/422, temporary failures 503. Unknown outcomes are retained for reconciliation; do not blindly retry writes.
         */
        readonly put: operations["replace_file_api_v1_file_manager_files__file_uuid__put"];
        readonly post?: never;
        /**
         * Delete File
         * @description Delete an active owned file. Managed files are logically retired in a transaction committed before success; held bytes remain until claimed cleanup. Missing, expired, deleted or foreign files return 404. Legacy files retain their existing deletion behavior. A failed or unknown commit returns an error; inspect current state before retrying.
         */
        readonly delete: operations["delete_file_api_v1_file_manager_files__file_uuid__delete"];
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/multipart/initiate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Initiate Multipart Upload
         * @description Managed uploads accept an optional UUID Idempotency-Key scoped to the current owner. Reuse the key and identical payload to recover an uncertain initiation. Without a key, every POST creates a new upload. Returned object_name is opaque and must be reused unchanged.
         */
        readonly post: operations["initiate_multipart_upload_api_v1_file_manager_multipart_initiate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/multipart/presign-part": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Presign Multipart Part */
        readonly post: operations["presign_multipart_part_api_v1_file_manager_multipart_presign_part_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/file-manager/multipart/complete": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /**
         * Complete Multipart Upload
         * @description Managed completion binds all fields and canonical parts to the initiated operation, probes the exact completed object and atomically attaches media facts. Retry the same payload after temporary failure; Complete is never reissued. Legacy uploads require the legacy route configuration.
         */
        readonly post: operations["complete_multipart_upload_api_v1_file_manager_multipart_complete_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-task/events": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /**
         * Stream Task Events
         * @description Header-only Bearer access. Live notifications have no replay or Last-Event-ID support. Connect before fetching a snapshot with GET /ai-task/list or /ai-task/{task_uuid}; refetch on notifications. The connected comment follows broker subscription readiness. Heartbeat and session checks every 15 seconds. Access expiry or revocation sends auth_error (token_expired/token_revoked), then closes the stream.
         */
        readonly get: operations["ai_task_events"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-task/generate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Generate Task */
        readonly post: operations["generate_task_api_v1_ai_task_generate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-task/result/{task_message_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly task_message_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Task Result */
        readonly get: operations["get_task_result_api_v1_ai_task_result__task_message_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-task/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Tasks List */
        readonly get: operations["get_tasks_list_api_v1_ai_task_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-task/{task_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly task_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Task */
        readonly get: operations["get_task_api_v1_ai_task__task_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-registry/models": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Models */
        readonly get: operations["list_models_api_v1_ai_registry_models_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/ai-registry/models/{ai_model_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly ai_model_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Model */
        readonly get: operations["get_model_api_v1_ai_registry_models__ai_model_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
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
            /** Modes */
            readonly modes: {
                readonly [key: string]: unknown;
            };
            /** Canonical Ui Schema */
            readonly canonical_ui_schema: {
                readonly [key: string]: unknown;
            };
        };
        /**
         * AiRegistryModelOwnerEnum
         * @enum {string}
         */
        readonly AiRegistryModelOwnerEnum: "ALIBABA" | "OPEN_AI" | "GOOGLE" | "BLACK_FOREST_LABS" | "K_LING_AI" | "BRIA" | "BYTE_DANCE" | "IMAGINE_ART" | "LIGHT_TICKS" | "MID_JOURNEY" | "MINI_MAX" | "PIX_VERSE" | "PRUNA_AI" | "RUNWAY" | "SOURCE_FUL" | "VIDU" | "IDEOGRAM" | "X_AI";
        /** AiRegistryModelSummary */
        readonly AiRegistryModelSummary: {
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
        };
        /**
         * AiRegistryModelSupportedTypesEnum
         * @enum {string}
         */
        readonly AiRegistryModelSupportedTypesEnum: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
        /** AiTaskListResponse */
        readonly AiTaskListResponse: {
            /** Items */
            readonly items: readonly components["schemas"]["AiTaskResponse"][];
            /** Has Next */
            readonly has_next: boolean;
        };
        /** AiTaskMessageResponse */
        readonly AiTaskMessageResponse: {
            /** Ai Model Config */
            readonly ai_model_config: {
                readonly [key: string]: unknown;
            };
            /** Ai Model Uuid */
            readonly ai_model_uuid: string | null;
            readonly task_status: components["schemas"]["AiTaskMessageStatusEnum"] | null;
            /** Message */
            readonly message: string | null;
            readonly role: components["schemas"]["AiTaskRuleEnum"];
            /**
             * Uuid
             * Format: uuid
             */
            readonly uuid: string;
        };
        /**
         * AiTaskMessageStatusEnum
         * @enum {string}
         */
        readonly AiTaskMessageStatusEnum: "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED";
        /** AiTaskResponse */
        readonly AiTaskResponse: {
            /**
             * Uuid
             * Format: uuid
             */
            readonly uuid: string;
            readonly task_type: components["schemas"]["AiRegistryModelSupportedTypesEnum"];
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
            /** Messages */
            readonly messages: readonly components["schemas"]["AiTaskMessageResponse"][];
        };
        /**
         * AiTaskRuleEnum
         * @enum {string}
         */
        readonly AiTaskRuleEnum: "SYSTEM" | "USER" | "ASSISTANT" | "TOOL" | "FUNCTION" | "INLINE";
        /**
         * AiTaskTypeEnum
         * @enum {string}
         */
        readonly AiTaskTypeEnum: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
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
        /**
         * ApplicationErrorCode
         * @enum {integer}
         */
        readonly ApplicationErrorCode: 900 | 901 | 902 | 999 | 1000 | 1100 | 1103 | 1104 | 1106 | 1107 | 1108 | 1200 | 1201 | 1202 | 1203 | 1204 | 1205 | 1206 | 1300 | 1301 | 1302 | 1303 | 1304 | 1305 | 1306 | 1307 | 1308 | 1400 | 1401 | 1500 | 1501 | 1502 | 1503 | 1600 | 1601 | 1602 | 1603 | 1604 | 1605 | 1700 | 1701 | 1702 | 1800 | 1801 | 1802 | 1803 | 1804 | 1805 | 1806 | 1807;
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
        /** AuthStartRequest */
        readonly AuthStartRequest: {
            /**
             * Phone Number
             * @example +989123456789
             */
            readonly phone_number: string;
        };
        readonly AuthStartResponse: components["schemas"]["PasswordStepResponse"] | components["schemas"]["RegistrationStepResponse"];
        /** Body_replace_file_api_v1_file_manager_files__file_uuid__put */
        readonly Body_replace_file_api_v1_file_manager_files__file_uuid__put: {
            /** File */
            readonly file?: string | null;
        };
        /** Body_simple_upload_api_v1_file_manager_simple_upload_post */
        readonly Body_simple_upload_api_v1_file_manager_simple_upload_post: {
            /** File */
            readonly file?: string | null;
        };
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
        /** FileManagerMediaMetadataResponse */
        readonly FileManagerMediaMetadataResponse: {
            /**
             * Kind
             * @enum {string}
             */
            readonly kind: "image" | "video" | "audio";
            /** Width */
            readonly width?: number | null;
            /** Height */
            readonly height?: number | null;
            /** Duration Seconds */
            readonly duration_seconds?: number | null;
        };
        /** FileManagerMultipartCompleteRequest */
        readonly FileManagerMultipartCompleteRequest: {
            /** Upload Id */
            readonly upload_id: string;
            /** Object Name */
            readonly object_name: string;
            /**
             * File Uuid
             * Format: uuid
             */
            readonly file_uuid: string;
            /** File Name */
            readonly file_name: string;
            /** File Size */
            readonly file_size: number;
            /** Content Type */
            readonly content_type: string;
            /** Meta */
            readonly meta?: {
                readonly [key: string]: unknown;
            };
            /** Parts */
            readonly parts: readonly components["schemas"]["FileManagerMultipartCompletedPart"][];
        };
        /** FileManagerMultipartCompletedPart */
        readonly FileManagerMultipartCompletedPart: {
            /** Part Number */
            readonly part_number: number;
            /** Etag */
            readonly etag: string;
        };
        /** FileManagerMultipartInitiateRequest */
        readonly FileManagerMultipartInitiateRequest: {
            /** File Name */
            readonly file_name: string;
            /** File Size */
            readonly file_size: number;
            /** Content Type */
            readonly content_type: string;
            /** Meta */
            readonly meta?: {
                readonly [key: string]: unknown;
            };
        };
        /** FileManagerMultipartInitiateResponse */
        readonly FileManagerMultipartInitiateResponse: {
            /** Upload Id */
            readonly upload_id: string;
            /** Object Name */
            readonly object_name: string;
            /**
             * Uuid
             * Format: uuid
             */
            readonly uuid: string;
            /** Chunk Size */
            readonly chunk_size: number;
            /** Parts Count */
            readonly parts_count: number;
        };
        /** FileManagerMultipartPresignPartRequest */
        readonly FileManagerMultipartPresignPartRequest: {
            /** Upload Id */
            readonly upload_id: string;
            /** Object Name */
            readonly object_name: string;
            /** Part Number */
            readonly part_number: number;
        };
        /** FileManagerMultipartPresignPartResponse */
        readonly FileManagerMultipartPresignPartResponse: {
            /** Presigned Url */
            readonly presigned_url: string;
            /** Part Number */
            readonly part_number: number;
            /**
             * Expire At
             * Format: date-time
             */
            readonly expire_at: string;
        };
        /** FileManagerPresignedUrlsListResponse */
        readonly FileManagerPresignedUrlsListResponse: {
            /** Files */
            readonly files: readonly components["schemas"]["FileManagerPresignedUrlsResponse"][];
        };
        /** FileManagerPresignedUrlsRequest */
        readonly FileManagerPresignedUrlsRequest: {
            /** File Uuids */
            readonly file_uuids: readonly string[];
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
        /** FileManagerUploadFileResponse */
        readonly FileManagerUploadFileResponse: {
            /** File Name */
            readonly file_name: string;
            /** File Size */
            readonly file_size: number;
            /** Content Type */
            readonly content_type: string;
            readonly media_metadata?: components["schemas"]["FileManagerMediaMetadataResponse"] | null;
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
            /** Uuid */
            readonly uuid?: string | null;
        };
        /** FileManagerUserFilesResponse */
        readonly FileManagerUserFilesResponse: {
            /** Files */
            readonly files: readonly components["schemas"]["FileManagerUploadFileResponse"][];
            /** Has Next */
            readonly has_next: boolean;
        };
        /** GenerateTaskRequest */
        readonly GenerateTaskRequest: {
            /**
             * Ai Model Uuid
             * Format: uuid
             */
            readonly ai_model_uuid: string;
            readonly task_type: components["schemas"]["AiRegistryModelSupportedTypesEnum"];
            /** Ai Model Config */
            readonly ai_model_config: {
                readonly [key: string]: unknown;
            };
            /** Task Uuid */
            readonly task_uuid?: string | null;
        };
        /** GetWalletResponse */
        readonly GetWalletResponse: {
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
            /** Name */
            readonly name: string;
            /** Balance Usdmicro */
            readonly balance_usdmicro: number;
            /** Is Active */
            readonly is_active: boolean;
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
        readonly MachineScope: "ai_registry:read" | "ai_task:read" | "ai_task:write" | "file_manager:read" | "file_manager:write";
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
        /** PaymentDetailsResponse */
        readonly PaymentDetailsResponse: {
            /**
             * Id
             * Format: uuid
             */
            readonly id: string;
            readonly currency: components["schemas"]["SupportedCurrency"];
            /** Base Amount Usdmicro */
            readonly base_amount_usdmicro: string;
            /** Tax Amount Usdmicro */
            readonly tax_amount_usdmicro: string;
            /** Total Amount Usdmicro */
            readonly total_amount_usdmicro: string;
            /** Base Amount */
            readonly base_amount: string;
            /** Tax Amount */
            readonly tax_amount: string;
            /** Total Amount */
            readonly total_amount: string;
        };
        /**
         * PaymentExecutionStatus
         * @enum {string}
         */
        readonly PaymentExecutionStatus: "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED";
        /**
         * PaymentFinancialStatus
         * @enum {string}
         */
        readonly PaymentFinancialStatus: "PENDING" | "SUCCEEDED" | "CLOSED";
        /**
         * PaymentFulfillmentStatus
         * @enum {string}
         */
        readonly PaymentFulfillmentStatus: "NOT_READY" | "PENDING" | "SUCCEEDED" | "NEEDS_REVIEW";
        /** PaymentHistoryItemResponse */
        readonly PaymentHistoryItemResponse: {
            readonly payment: components["schemas"]["PaymentResponse"];
            /** Target Type */
            readonly target_type: string;
            /**
             * Created At
             * Format: date-time
             */
            readonly created_at: string;
        };
        /** PaymentListResponse */
        readonly PaymentListResponse: {
            /** Items */
            readonly items: readonly components["schemas"]["PaymentHistoryItemResponse"][];
            /** Has Next */
            readonly has_next: boolean;
        };
        /** PaymentResponse */
        readonly PaymentResponse: {
            /**
             * Id
             * Format: uuid
             */
            readonly id: string;
            /**
             * Execution Uuid
             * Format: uuid
             */
            readonly execution_uuid: string;
            readonly status: components["schemas"]["PaymentExecutionStatus"];
            readonly financial_status: components["schemas"]["PaymentFinancialStatus"];
            readonly fulfillment_status: components["schemas"]["PaymentFulfillmentStatus"];
            readonly currency: components["schemas"]["SupportedCurrency"];
            /** Amount */
            readonly amount: string;
            /** Payment Url */
            readonly payment_url: string | null;
            /** Requires Review */
            readonly requires_review: boolean;
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
        /** SubscriptionPlanListResponse */
        readonly SubscriptionPlanListResponse: {
            /** Items */
            readonly items: readonly components["schemas"]["SubscriptionPlanResponse"][];
            /** Total Count */
            readonly total_count: number;
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
        /** SubscriptionPurchaseRequest */
        readonly SubscriptionPurchaseRequest: {
            /**
             * Plan Uuid
             * Format: uuid
             */
            readonly plan_uuid: string;
        };
        /**
         * SupportedCurrency
         * @enum {string}
         */
        readonly SupportedCurrency: "IRR";
        /** UserChargeWalletRequest */
        readonly UserChargeWalletRequest: {
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
        };
        /** UserEditInfoRequest */
        readonly UserEditInfoRequest: {
            /**
             * Email
             * @example info@PERPIXai.com
             */
            readonly email?: string | null;
            /**
             * Name
             * @example Joan hanson
             */
            readonly name?: string | null;
        };
        /** UserEditInfoResponse */
        readonly UserEditInfoResponse: {
            /** Email */
            readonly email: string | null;
            /** Phone Number */
            readonly phone_number: string;
            /** Name */
            readonly name: string | null;
            /**
             * Is Verified
             * @default false
             */
            readonly is_verified: boolean;
            /** Scopes */
            readonly scopes: readonly string[];
            /** Default Wallet Uuid */
            readonly default_wallet_uuid: string | null;
            /**
             * Is Active
             * @default true
             */
            readonly is_active: boolean;
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
        /** UserGetInfoResponse */
        readonly UserGetInfoResponse: {
            /** Email */
            readonly email: string | null;
            /** Phone Number */
            readonly phone_number: string;
            /** Name */
            readonly name: string | null;
            /**
             * Is Verified
             * @default false
             */
            readonly is_verified: boolean;
            /** Scopes */
            readonly scopes: readonly string[];
            /** Default Wallet Uuid */
            readonly default_wallet_uuid: string | null;
            /**
             * Is Active
             * @default true
             */
            readonly is_active: boolean;
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
        readonly WalletOperationSourceEnum: "admin" | "ai_gateway_request" | "ai_task_message" | "subscription";
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
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type SchemaAccessTokenResponse = components['schemas']['AccessTokenResponse'];
export type SchemaAiRegistryModelDetail = components['schemas']['AiRegistryModelDetail'];
export type SchemaAiRegistryModelOwnerEnum = components['schemas']['AiRegistryModelOwnerEnum'];
export type SchemaAiRegistryModelSummary = components['schemas']['AiRegistryModelSummary'];
export type SchemaAiRegistryModelSupportedTypesEnum = components['schemas']['AiRegistryModelSupportedTypesEnum'];
export type SchemaAiTaskListResponse = components['schemas']['AiTaskListResponse'];
export type SchemaAiTaskMessageResponse = components['schemas']['AiTaskMessageResponse'];
export type SchemaAiTaskMessageStatusEnum = components['schemas']['AiTaskMessageStatusEnum'];
export type SchemaAiTaskResponse = components['schemas']['AiTaskResponse'];
export type SchemaAiTaskRuleEnum = components['schemas']['AiTaskRuleEnum'];
export type SchemaAiTaskTypeEnum = components['schemas']['AiTaskTypeEnum'];
export type SchemaApiTokenListResponse = components['schemas']['ApiTokenListResponse'];
export type SchemaApiTokenResponse = components['schemas']['ApiTokenResponse'];
export type SchemaApplicationErrorCode = components['schemas']['ApplicationErrorCode'];
export type SchemaApplicationErrorResponse = components['schemas']['ApplicationErrorResponse'];
export type SchemaAuthStartRequest = components['schemas']['AuthStartRequest'];
export type SchemaAuthStartResponse = components['schemas']['AuthStartResponse'];
export type SchemaBodyReplaceFileApiV1FileManagerFilesFileUuidPut = components['schemas']['Body_replace_file_api_v1_file_manager_files__file_uuid__put'];
export type SchemaBodySimpleUploadApiV1FileManagerSimpleUploadPost = components['schemas']['Body_simple_upload_api_v1_file_manager_simple_upload_post'];
export type SchemaChallengeResponse = components['schemas']['ChallengeResponse'];
export type SchemaCreateApiTokenRequest = components['schemas']['CreateApiTokenRequest'];
export type SchemaCreatedApiTokenResponse = components['schemas']['CreatedApiTokenResponse'];
export type SchemaCsrfResponse = components['schemas']['CsrfResponse'];
export type SchemaFileManagerMediaMetadataResponse = components['schemas']['FileManagerMediaMetadataResponse'];
export type SchemaFileManagerMultipartCompleteRequest = components['schemas']['FileManagerMultipartCompleteRequest'];
export type SchemaFileManagerMultipartCompletedPart = components['schemas']['FileManagerMultipartCompletedPart'];
export type SchemaFileManagerMultipartInitiateRequest = components['schemas']['FileManagerMultipartInitiateRequest'];
export type SchemaFileManagerMultipartInitiateResponse = components['schemas']['FileManagerMultipartInitiateResponse'];
export type SchemaFileManagerMultipartPresignPartRequest = components['schemas']['FileManagerMultipartPresignPartRequest'];
export type SchemaFileManagerMultipartPresignPartResponse = components['schemas']['FileManagerMultipartPresignPartResponse'];
export type SchemaFileManagerPresignedUrlsListResponse = components['schemas']['FileManagerPresignedUrlsListResponse'];
export type SchemaFileManagerPresignedUrlsRequest = components['schemas']['FileManagerPresignedUrlsRequest'];
export type SchemaFileManagerPresignedUrlsResponse = components['schemas']['FileManagerPresignedUrlsResponse'];
export type SchemaFileManagerUploadFileResponse = components['schemas']['FileManagerUploadFileResponse'];
export type SchemaFileManagerUserFilesResponse = components['schemas']['FileManagerUserFilesResponse'];
export type SchemaGenerateTaskRequest = components['schemas']['GenerateTaskRequest'];
export type SchemaGetWalletResponse = components['schemas']['GetWalletResponse'];
export type SchemaGetWalletTransactionsResponse = components['schemas']['GetWalletTransactionsResponse'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaLoginRequest = components['schemas']['LoginRequest'];
export type SchemaMachineScope = components['schemas']['MachineScope'];
export type SchemaPasswordChangeRequest = components['schemas']['PasswordChangeRequest'];
export type SchemaPasswordResetChallengeRequest = components['schemas']['PasswordResetChallengeRequest'];
export type SchemaPasswordResetRequest = components['schemas']['PasswordResetRequest'];
export type SchemaPasswordStepResponse = components['schemas']['PasswordStepResponse'];
export type SchemaPaymentDetailsResponse = components['schemas']['PaymentDetailsResponse'];
export type SchemaPaymentExecutionStatus = components['schemas']['PaymentExecutionStatus'];
export type SchemaPaymentFinancialStatus = components['schemas']['PaymentFinancialStatus'];
export type SchemaPaymentFulfillmentStatus = components['schemas']['PaymentFulfillmentStatus'];
export type SchemaPaymentHistoryItemResponse = components['schemas']['PaymentHistoryItemResponse'];
export type SchemaPaymentListResponse = components['schemas']['PaymentListResponse'];
export type SchemaPaymentResponse = components['schemas']['PaymentResponse'];
export type SchemaRegistrationChallengeRequest = components['schemas']['RegistrationChallengeRequest'];
export type SchemaRegistrationRequest = components['schemas']['RegistrationRequest'];
export type SchemaRegistrationStepResponse = components['schemas']['RegistrationStepResponse'];
export type SchemaSubscriptionPlanListResponse = components['schemas']['SubscriptionPlanListResponse'];
export type SchemaSubscriptionPlanResponse = components['schemas']['SubscriptionPlanResponse'];
export type SchemaSubscriptionPurchaseRequest = components['schemas']['SubscriptionPurchaseRequest'];
export type SchemaSupportedCurrency = components['schemas']['SupportedCurrency'];
export type SchemaUserChargeWalletRequest = components['schemas']['UserChargeWalletRequest'];
export type SchemaUserEditInfoRequest = components['schemas']['UserEditInfoRequest'];
export type SchemaUserEditInfoResponse = components['schemas']['UserEditInfoResponse'];
export type SchemaUserGetInfoResponse = components['schemas']['UserGetInfoResponse'];
export type SchemaUserSubscriptionResponse = components['schemas']['UserSubscriptionResponse'];
export type SchemaValidationError = components['schemas']['ValidationError'];
export type SchemaWalletOperationSourceEnum = components['schemas']['WalletOperationSourceEnum'];
export type SchemaWalletTransactionResponse = components['schemas']['WalletTransactionResponse'];
export type SchemaWalletTransactionTypeEnum = components['schemas']['WalletTransactionTypeEnum'];
export type $defs = Record<string, never>;
export interface operations {
    readonly get_info_api_v1_user_get_info_get: {
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
                    readonly "application/json": components["schemas"]["UserGetInfoResponse"];
                };
            };
        };
    };
    readonly edit_user_info_api_v1_user_edit_info_patch: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserEditInfoRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserEditInfoResponse"];
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
    readonly get_subscription_plans_api_v1_user_subscription_plans_get: {
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
                    readonly "application/json": components["schemas"]["SubscriptionPlanListResponse"];
                };
            };
        };
    };
    readonly get_active_subscription_api_v1_user_subscription_active_get: {
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
                    readonly "application/json": components["schemas"]["UserSubscriptionResponse"];
                };
            };
        };
    };
    readonly purchase_subscription_api_v1_user_subscription_purchase_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["SubscriptionPurchaseRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 201: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PaymentResponse"];
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
    readonly charge_wallet_api_v1_wallet_charge_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserChargeWalletRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 201: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PaymentResponse"];
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
    readonly get_current_user_wallet_api_v1_wallet_wallet_get: {
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
                    readonly "application/json": components["schemas"]["GetWalletResponse"];
                };
            };
        };
    };
    readonly get_wallet_transactions_api_v1_wallet_transactions_get: {
        readonly parameters: {
            readonly query?: {
                readonly type?: components["schemas"]["WalletTransactionTypeEnum"] | null;
                readonly source?: components["schemas"]["WalletOperationSourceEnum"] | null;
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
    readonly stream_payment_events_api_v1_payment_events_get: {
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
                content?: never;
            };
        };
    };
    readonly get_payment_intents_api_v1_payment_intents_get: {
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
                    readonly "application/json": components["schemas"]["PaymentListResponse"];
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
    readonly retry_payment_api_v1_payment_intents__intent_uuid__executions_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description OK */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PaymentResponse"];
                };
            };
            /** @description Successful Response */
            readonly 201: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["PaymentResponse"];
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
    readonly get_payment_intent_api_v1_payment_intents__intent_uuid__get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
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
                    readonly "application/json": components["schemas"]["PaymentResponse"];
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
    readonly get_payment_details_api_v1_payment_intents__intent_uuid__details_get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly intent_uuid: string;
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
                    readonly "application/json": components["schemas"]["PaymentDetailsResponse"];
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
    readonly get_payment_execution_api_v1_payment_executions__execution_uuid__get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly execution_uuid: string;
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
                    readonly "application/json": components["schemas"]["PaymentResponse"];
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
    readonly payment_return_api_v1_payment_return__execution_uuid__get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly execution_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: never;
        readonly responses: {
            /** @description Successful Response */
            readonly 303: {
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
    readonly readiness_api_v1_readiness_get: {
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
                    readonly "application/json": {
                        readonly [key: string]: string;
                    };
                };
            };
        };
    };
    readonly simple_upload_api_v1_file_manager_simple_upload_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: {
            readonly content: {
                readonly "multipart/form-data": components["schemas"]["Body_simple_upload_api_v1_file_manager_simple_upload_post"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerUploadFileResponse"];
                };
            };
            /** @description Content Too Large */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
            /** @description Unsupported Media Type */
            readonly 415: {
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
            /** @description Service Unavailable */
            readonly 503: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_user_files_api_v1_file_manager_user_files_get: {
        readonly parameters: {
            readonly query?: {
                /** @description Filter by content types (optional) */
                readonly content_types?: readonly string[] | null;
                readonly limit?: number;
                readonly offset?: number;
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
                    readonly "application/json": components["schemas"]["FileManagerUserFilesResponse"];
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
    readonly get_file_presigned_urls_api_v1_file_manager_files_presigned_urls_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["FileManagerPresignedUrlsRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerPresignedUrlsListResponse"];
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
    readonly replace_file_api_v1_file_manager_files__file_uuid__put: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly file_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: {
            readonly content: {
                readonly "multipart/form-data": components["schemas"]["Body_replace_file_api_v1_file_manager_files__file_uuid__put"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerUploadFileResponse"];
                };
            };
            /** @description Bad Request */
            readonly 400: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
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
            /** @description Content Too Large */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
            /** @description Unsupported Media Type */
            readonly 415: {
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
            /** @description Service Unavailable */
            readonly 503: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly delete_file_api_v1_file_manager_files__file_uuid__delete: {
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
                    readonly "application/json": components["schemas"]["FileManagerUploadFileResponse"];
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
    readonly initiate_multipart_upload_api_v1_file_manager_multipart_initiate_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: {
                readonly "Idempotency-Key"?: string | null;
            };
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["FileManagerMultipartInitiateRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerMultipartInitiateResponse"];
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
            /** @description Content Too Large */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
            /** @description Unsupported Media Type */
            readonly 415: {
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
            /** @description Service Unavailable */
            readonly 503: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly presign_multipart_part_api_v1_file_manager_multipart_presign_part_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["FileManagerMultipartPresignPartRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerMultipartPresignPartResponse"];
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
            /** @description Content Too Large */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
            /** @description Unsupported Media Type */
            readonly 415: {
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
            /** @description Service Unavailable */
            readonly 503: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly complete_multipart_upload_api_v1_file_manager_multipart_complete_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["FileManagerMultipartCompleteRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["FileManagerUploadFileResponse"];
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
            /** @description Content Too Large */
            readonly 413: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
            /** @description Unsupported Media Type */
            readonly 415: {
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
            /** @description Service Unavailable */
            readonly 503: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly ai_task_events: {
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
                content?: never;
            };
            /** @description Invalid or revoked access session */
            readonly 401: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    readonly generate_task_api_v1_ai_task_generate_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["GenerateTaskRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["AiTaskResponse"];
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
    readonly get_task_result_api_v1_ai_task_result__task_message_uuid__get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
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
    readonly get_tasks_list_api_v1_ai_task_list_get: {
        readonly parameters: {
            readonly query?: {
                readonly offset?: number;
                readonly limit?: number;
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
                    readonly "application/json": components["schemas"]["AiTaskListResponse"];
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
    readonly get_task_api_v1_ai_task__task_uuid__get: {
        readonly parameters: {
            readonly query?: never;
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
                    readonly "application/json": components["schemas"]["AiTaskResponse"];
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
    readonly list_models_api_v1_ai_registry_models_get: {
        readonly parameters: {
            readonly query?: {
                readonly supported_inputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][] | null;
                readonly supported_outputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][] | null;
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
                    readonly "application/json": readonly components["schemas"]["AiRegistryModelSummary"][];
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
    readonly get_model_api_v1_ai_registry_models__ai_model_uuid__get: {
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
}
type FlattenedDeepRequired<T> = {
    [K in keyof T]-?: FlattenedDeepRequired<T[K] extends unknown[] | undefined | null ? Extract<T[K], unknown[]>[number] : T[K]>;
};
type ReadonlyArray<T> = [
    Exclude<T, undefined>
] extends [
    unknown[]
] ? Readonly<Exclude<T, undefined>> : Readonly<Exclude<T, undefined>[]>;
export const aiRegistryModelOwnerEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelOwnerEnum"]> = ["ALIBABA", "OPEN_AI", "GOOGLE", "BLACK_FOREST_LABS", "K_LING_AI", "BRIA", "BYTE_DANCE", "IMAGINE_ART", "LIGHT_TICKS", "MID_JOURNEY", "MINI_MAX", "PIX_VERSE", "PRUNA_AI", "RUNWAY", "SOURCE_FUL", "VIDU", "IDEOGRAM", "X_AI"];
export const aiRegistryModelSupportedTypesEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelSupportedTypesEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const aiTaskMessageStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskMessageStatusEnum"]> = ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED"];
export const aiTaskRuleEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskRuleEnum"]> = ["SYSTEM", "USER", "ASSISTANT", "TOOL", "FUNCTION", "INLINE"];
export const aiTaskTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskTypeEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const applicationErrorCodeValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["ApplicationErrorCode"]> = [900, 901, 902, 999, 1000, 1100, 1103, 1104, 1106, 1107, 1108, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1300, 1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1400, 1401, 1500, 1501, 1502, 1503, 1600, 1601, 1602, 1603, 1604, 1605, 1700, 1701, 1702, 1800, 1801, 1802, 1803, 1804, 1805, 1806, 1807];
export const fileManagerMediaMetadataResponseKindValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["FileManagerMediaMetadataResponse"]["kind"]> = ["image", "video", "audio"];
export const machineScopeValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["MachineScope"]> = ["ai_registry:read", "ai_task:read", "ai_task:write", "file_manager:read", "file_manager:write"];
export const passwordStepResponseNext_stepValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PasswordStepResponse"]["next_step"]> = ["password"];
export const paymentExecutionStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentExecutionStatus"]> = ["PENDING", "SUCCEEDED", "FAILED", "EXPIRED"];
export const paymentFinancialStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentFinancialStatus"]> = ["PENDING", "SUCCEEDED", "CLOSED"];
export const paymentFulfillmentStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentFulfillmentStatus"]> = ["NOT_READY", "PENDING", "SUCCEEDED", "NEEDS_REVIEW"];
export const registrationStepResponseNext_stepValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["RegistrationStepResponse"]["next_step"]> = ["registration"];
export const supportedCurrencyValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["SupportedCurrency"]> = ["IRR"];
export const walletOperationSourceEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletOperationSourceEnum"]> = ["admin", "ai_gateway_request", "ai_task_message", "subscription"];
export const walletTransactionTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletTransactionTypeEnum"]> = ["DEPOSIT", "WITHDRAW", "REFUND"];


export const AiRegistryModelOwnerEnumMap = {
  "ALIBABA": "ALIBABA",
  "OPEN_AI": "OPEN_AI",
  "GOOGLE": "GOOGLE",
  "BLACK_FOREST_LABS": "BLACK_FOREST_LABS",
  "K_LING_AI": "K_LING_AI",
  "BRIA": "BRIA",
  "BYTE_DANCE": "BYTE_DANCE",
  "IMAGINE_ART": "IMAGINE_ART",
  "LIGHT_TICKS": "LIGHT_TICKS",
  "MID_JOURNEY": "MID_JOURNEY",
  "MINI_MAX": "MINI_MAX",
  "PIX_VERSE": "PIX_VERSE",
  "PRUNA_AI": "PRUNA_AI",
  "RUNWAY": "RUNWAY",
  "SOURCE_FUL": "SOURCE_FUL",
  "VIDU": "VIDU",
  "IDEOGRAM": "IDEOGRAM",
  "X_AI": "X_AI",
} as const;
export type AiRegistryModelOwnerEnumKey = keyof typeof AiRegistryModelOwnerEnumMap;
export type AiRegistryModelOwnerEnumValue = (typeof AiRegistryModelOwnerEnumMap)[AiRegistryModelOwnerEnumKey];

export const AiRegistryModelSupportedTypesEnumMap = {
  "TEXT": "TEXT",
  "IMAGE": "IMAGE",
  "AUDIO": "AUDIO",
  "VIDEO": "VIDEO",
} as const;
export type AiRegistryModelSupportedTypesEnumKey = keyof typeof AiRegistryModelSupportedTypesEnumMap;
export type AiRegistryModelSupportedTypesEnumValue = (typeof AiRegistryModelSupportedTypesEnumMap)[AiRegistryModelSupportedTypesEnumKey];

export const AiTaskMessageStatusEnumMap = {
  "PENDING": "PENDING",
  "IN_PROGRESS": "IN_PROGRESS",
  "SUCCESS": "SUCCESS",
  "FAILED": "FAILED",
} as const;
export type AiTaskMessageStatusEnumKey = keyof typeof AiTaskMessageStatusEnumMap;
export type AiTaskMessageStatusEnumValue = (typeof AiTaskMessageStatusEnumMap)[AiTaskMessageStatusEnumKey];

export const AiTaskRuleEnumMap = {
  "SYSTEM": "SYSTEM",
  "USER": "USER",
  "ASSISTANT": "ASSISTANT",
  "TOOL": "TOOL",
  "FUNCTION": "FUNCTION",
  "INLINE": "INLINE",
} as const;
export type AiTaskRuleEnumKey = keyof typeof AiTaskRuleEnumMap;
export type AiTaskRuleEnumValue = (typeof AiTaskRuleEnumMap)[AiTaskRuleEnumKey];

export const AiTaskTypeEnumMap = {
  "TEXT": "TEXT",
  "IMAGE": "IMAGE",
  "AUDIO": "AUDIO",
  "VIDEO": "VIDEO",
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
  1400: 1400,
  1401: 1401,
  1500: 1500,
  1501: 1501,
  1502: 1502,
  1503: 1503,
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
} as const;
export type ApplicationErrorCodeKey = keyof typeof ApplicationErrorCodeMap;
export type ApplicationErrorCodeValue = (typeof ApplicationErrorCodeMap)[ApplicationErrorCodeKey];

export const MachineScopeMap = {
  "ai_registry:read": "ai_registry:read",
  "ai_task:read": "ai_task:read",
  "ai_task:write": "ai_task:write",
  "file_manager:read": "file_manager:read",
  "file_manager:write": "file_manager:write",
} as const;
export type MachineScopeKey = keyof typeof MachineScopeMap;
export type MachineScopeValue = (typeof MachineScopeMap)[MachineScopeKey];

export const PaymentExecutionStatusMap = {
  "PENDING": "PENDING",
  "SUCCEEDED": "SUCCEEDED",
  "FAILED": "FAILED",
  "EXPIRED": "EXPIRED",
} as const;
export type PaymentExecutionStatusKey = keyof typeof PaymentExecutionStatusMap;
export type PaymentExecutionStatusValue = (typeof PaymentExecutionStatusMap)[PaymentExecutionStatusKey];

export const PaymentFinancialStatusMap = {
  "PENDING": "PENDING",
  "SUCCEEDED": "SUCCEEDED",
  "CLOSED": "CLOSED",
} as const;
export type PaymentFinancialStatusKey = keyof typeof PaymentFinancialStatusMap;
export type PaymentFinancialStatusValue = (typeof PaymentFinancialStatusMap)[PaymentFinancialStatusKey];

export const PaymentFulfillmentStatusMap = {
  "NOT_READY": "NOT_READY",
  "PENDING": "PENDING",
  "SUCCEEDED": "SUCCEEDED",
  "NEEDS_REVIEW": "NEEDS_REVIEW",
} as const;
export type PaymentFulfillmentStatusKey = keyof typeof PaymentFulfillmentStatusMap;
export type PaymentFulfillmentStatusValue = (typeof PaymentFulfillmentStatusMap)[PaymentFulfillmentStatusKey];

export const SupportedCurrencyMap = {
  "IRR": "IRR",
} as const;
export type SupportedCurrencyKey = keyof typeof SupportedCurrencyMap;
export type SupportedCurrencyValue = (typeof SupportedCurrencyMap)[SupportedCurrencyKey];

export const WalletOperationSourceEnumMap = {
  "admin": "admin",
  "ai_gateway_request": "ai_gateway_request",
  "ai_task_message": "ai_task_message",
  "subscription": "subscription",
} as const;
export type WalletOperationSourceEnumKey = keyof typeof WalletOperationSourceEnumMap;
export type WalletOperationSourceEnumValue = (typeof WalletOperationSourceEnumMap)[WalletOperationSourceEnumKey];

export const WalletTransactionTypeEnumMap = {
  "DEPOSIT": "DEPOSIT",
  "WITHDRAW": "WITHDRAW",
  "REFUND": "REFUND",
} as const;
export type WalletTransactionTypeEnumKey = keyof typeof WalletTransactionTypeEnumMap;
export type WalletTransactionTypeEnumValue = (typeof WalletTransactionTypeEnumMap)[WalletTransactionTypeEnumKey];