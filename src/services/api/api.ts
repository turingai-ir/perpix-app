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
    readonly "/api/v1/user/start": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Start */
        readonly post: operations["start_api_v1_user_start_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/login": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Login */
        readonly post: operations["login_api_v1_user_login_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/reset-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Reset Password */
        readonly post: operations["reset_password_api_v1_user_reset_password_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/resend-otp": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Resend Otp */
        readonly post: operations["resend_otp_api_v1_user_resend_otp_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/api/v1/user/set-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Set Password */
        readonly post: operations["set_password_api_v1_user_set_password_post"];
        readonly delete?: never;
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
        /**
         * Create payment checkout intent
         * @description Initiates a new checkout intent, quotes verified catalog prices, and dispatches execution to the gateway.
         */
        readonly post: operations["create_payment_api_v1_payment_intents_post"];
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
         * @description Initiates a retry execution for a failed or expired payment intent using an idempotent key.
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
    readonly "/api/v1/payment-executions/{execution_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly execution_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get payment status from browser return execution */
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
         * @description Synchronizes the payment through the recovery path, then returns to the frontend.
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
        /** Simple Upload */
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
        /** Replace File */
        readonly put: operations["replace_file_api_v1_file_manager_files__file_uuid__put"];
        readonly post?: never;
        /** Delete File */
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
        /** Initiate Multipart Upload */
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
        /** Complete Multipart Upload */
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
        /** Stream Task Events */
        readonly get: operations["stream_task_events_api_v1_ai_task_events_get"];
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
        readonly AiRegistryModelOwnerEnum: "OPEN_AI" | "GOOGLE" | "BLACK_FOREST_LABS" | "K_LING_AI" | "BRIA" | "BYTE_DANCE" | "IMAGINE_ART" | "LIGHT_TICKS" | "MID_JOURNEY" | "MINI_MAX" | "PIX_VERSE" | "PRUNA_AI" | "RUNWAY" | "SOURCE_FUL" | "VIDU" | "IDEOGRAM" | "X_AI";
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
        /** CreatePaymentRequest */
        readonly CreatePaymentRequest: {
            /**
             * Intent Uuid
             * Format: uuid
             */
            readonly intent_uuid?: string;
            /**
             * Target Type
             * @enum {string}
             */
            readonly target_type: "wallet_topup" | "subscription";
            /**
             * Target Uuid
             * Format: uuid
             */
            readonly target_uuid: string;
            /** Amount Usdmicro */
            readonly amount_usdmicro?: number | null;
        };
        /**
         * DispatchStatus
         * @enum {string}
         */
        readonly DispatchStatus: "UNCONFIRMED" | "CONFIRMED";
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
         * PaymentExecutionStatus
         * @enum {string}
         */
        readonly PaymentExecutionStatus: "CREATING" | "PENDING" | "UNKNOWN" | "SUCCEEDED" | "FAILED" | "EXPIRED";
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
            readonly dispatch_status: components["schemas"]["DispatchStatus"];
            /**
             * Outcome
             * @enum {string}
             */
            readonly outcome: "ready" | "pending" | "succeeded" | "failed" | "expired" | "review";
            /** Currency */
            readonly currency: string;
            /** Amount */
            readonly amount: string;
            /** Expires At */
            readonly expires_at: string | null;
            /** Payment Url */
            readonly payment_url: string | null;
        };
        /** RetryPaymentRequest */
        readonly RetryPaymentRequest: Record<string, never>;
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
             * Intent Uuid
             * Format: uuid
             */
            readonly intent_uuid?: string;
            /**
             * Plan Uuid
             * Format: uuid
             */
            readonly plan_uuid: string;
        };
        /** UserChargeWalletRequest */
        readonly UserChargeWalletRequest: {
            /**
             * Intent Uuid
             * Format: uuid
             */
            readonly intent_uuid?: string;
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
        /** UserLoginRequest */
        readonly UserLoginRequest: {
            /**
             * Password
             * @example qwerQWER1234!!!!
             */
            readonly password: string;
        };
        /** UserLoginResponse */
        readonly UserLoginResponse: {
            /** Token */
            readonly token: string;
            /** Phone Number */
            readonly phone_number: string;
            /** Email */
            readonly email: string | null;
            /** Name */
            readonly name: string | null;
            /**
             * User Uuid
             * Format: uuid
             */
            readonly user_uuid: string;
        };
        /** UserResendOtpResponse */
        readonly UserResendOtpResponse: {
            /** Is Verified */
            readonly is_verified: boolean;
            /**
             * Next Otp At
             * Format: date-time
             */
            readonly next_otp_at: string;
        };
        /** UserResetPasswordRequest */
        readonly UserResetPasswordRequest: {
            /**
             * Phone Number
             * @example 09123456789
             */
            readonly phone_number: string;
        };
        /** UserResetPasswordResponse */
        readonly UserResetPasswordResponse: {
            /** Token */
            readonly token: string;
            /** Is Verified */
            readonly is_verified: boolean;
            /**
             * Next Otp At
             * Format: date-time
             */
            readonly next_otp_at: string;
        };
        /** UserSetPasswordRequest */
        readonly UserSetPasswordRequest: {
            /**
             * Password
             * @example qwerQWER1234!!!!
             */
            readonly password: string;
            /**
             * Otp Code
             * @example 123456
             */
            readonly otp_code: string;
        };
        /** UserStartRequest */
        readonly UserStartRequest: {
            /**
             * Phone Number
             * @example 09123456789
             */
            readonly phone_number: string;
        };
        /** UserStartResponse */
        readonly UserStartResponse: {
            /** Token */
            readonly token: string;
            /** Is Verified */
            readonly is_verified: boolean;
            /** Is Registering */
            readonly is_registering: boolean;
            /** Next Otp At */
            readonly next_otp_at: string | null;
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
export type SchemaBodyReplaceFileApiV1FileManagerFilesFileUuidPut = components['schemas']['Body_replace_file_api_v1_file_manager_files__file_uuid__put'];
export type SchemaBodySimpleUploadApiV1FileManagerSimpleUploadPost = components['schemas']['Body_simple_upload_api_v1_file_manager_simple_upload_post'];
export type SchemaCreatePaymentRequest = components['schemas']['CreatePaymentRequest'];
export type SchemaDispatchStatus = components['schemas']['DispatchStatus'];
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
export type SchemaPaymentExecutionStatus = components['schemas']['PaymentExecutionStatus'];
export type SchemaPaymentFinancialStatus = components['schemas']['PaymentFinancialStatus'];
export type SchemaPaymentFulfillmentStatus = components['schemas']['PaymentFulfillmentStatus'];
export type SchemaPaymentHistoryItemResponse = components['schemas']['PaymentHistoryItemResponse'];
export type SchemaPaymentListResponse = components['schemas']['PaymentListResponse'];
export type SchemaPaymentResponse = components['schemas']['PaymentResponse'];
export type SchemaRetryPaymentRequest = components['schemas']['RetryPaymentRequest'];
export type SchemaSubscriptionPlanListResponse = components['schemas']['SubscriptionPlanListResponse'];
export type SchemaSubscriptionPlanResponse = components['schemas']['SubscriptionPlanResponse'];
export type SchemaSubscriptionPurchaseRequest = components['schemas']['SubscriptionPurchaseRequest'];
export type SchemaUserChargeWalletRequest = components['schemas']['UserChargeWalletRequest'];
export type SchemaUserEditInfoRequest = components['schemas']['UserEditInfoRequest'];
export type SchemaUserEditInfoResponse = components['schemas']['UserEditInfoResponse'];
export type SchemaUserGetInfoResponse = components['schemas']['UserGetInfoResponse'];
export type SchemaUserLoginRequest = components['schemas']['UserLoginRequest'];
export type SchemaUserLoginResponse = components['schemas']['UserLoginResponse'];
export type SchemaUserResendOtpResponse = components['schemas']['UserResendOtpResponse'];
export type SchemaUserResetPasswordRequest = components['schemas']['UserResetPasswordRequest'];
export type SchemaUserResetPasswordResponse = components['schemas']['UserResetPasswordResponse'];
export type SchemaUserSetPasswordRequest = components['schemas']['UserSetPasswordRequest'];
export type SchemaUserStartRequest = components['schemas']['UserStartRequest'];
export type SchemaUserStartResponse = components['schemas']['UserStartResponse'];
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
    readonly start_api_v1_user_start_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserStartRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserStartResponse"];
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
    readonly login_api_v1_user_login_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserLoginRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserLoginResponse"];
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
    readonly reset_password_api_v1_user_reset_password_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserResetPasswordRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserResetPasswordResponse"];
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
    readonly resend_otp_api_v1_user_resend_otp_post: {
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
                    readonly "application/json": components["schemas"]["UserResendOtpResponse"];
                };
            };
        };
    };
    readonly set_password_api_v1_user_set_password_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserSetPasswordRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserLoginResponse"];
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
    readonly create_payment_api_v1_payment_intents_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["CreatePaymentRequest"];
            };
        };
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
            /** @description Accepted */
            readonly 202: {
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
    readonly retry_payment_api_v1_payment_intents__intent_uuid__executions_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header: {
                readonly "Idempotency-Key": string;
            };
            readonly path: {
                readonly intent_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody?: {
            readonly content: {
                readonly "application/json": components["schemas"]["RetryPaymentRequest"] | null;
            };
        };
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
            /** @description Accepted */
            readonly 202: {
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
    readonly initiate_multipart_upload_api_v1_file_manager_multipart_initiate_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
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
    readonly stream_task_events_api_v1_ai_task_events_get: {
        readonly parameters: {
            readonly query?: {
                readonly token?: string | null;
            };
            readonly header?: {
                readonly authorization?: string | null;
            };
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
                    readonly "application/json": unknown;
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
export const aiRegistryModelOwnerEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelOwnerEnum"]> = ["OPEN_AI", "GOOGLE", "BLACK_FOREST_LABS", "K_LING_AI", "BRIA", "BYTE_DANCE", "IMAGINE_ART", "LIGHT_TICKS", "MID_JOURNEY", "MINI_MAX", "PIX_VERSE", "PRUNA_AI", "RUNWAY", "SOURCE_FUL", "VIDU", "IDEOGRAM", "X_AI"];
export const aiRegistryModelSupportedTypesEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelSupportedTypesEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const aiTaskMessageStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskMessageStatusEnum"]> = ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED"];
export const aiTaskRuleEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskRuleEnum"]> = ["SYSTEM", "USER", "ASSISTANT", "TOOL", "FUNCTION", "INLINE"];
export const aiTaskTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskTypeEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const createPaymentRequestTarget_typeValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["CreatePaymentRequest"]["target_type"]> = ["wallet_topup", "subscription"];
export const dispatchStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["DispatchStatus"]> = ["UNCONFIRMED", "CONFIRMED"];
export const paymentExecutionStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentExecutionStatus"]> = ["CREATING", "PENDING", "UNKNOWN", "SUCCEEDED", "FAILED", "EXPIRED"];
export const paymentFinancialStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentFinancialStatus"]> = ["PENDING", "SUCCEEDED", "CLOSED"];
export const paymentFulfillmentStatusValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentFulfillmentStatus"]> = ["NOT_READY", "PENDING", "SUCCEEDED", "NEEDS_REVIEW"];
export const paymentResponseOutcomeValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentResponse"]["outcome"]> = ["ready", "pending", "succeeded", "failed", "expired", "review"];
export const walletOperationSourceEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletOperationSourceEnum"]> = ["admin", "ai_gateway_request", "ai_task_message", "subscription"];
export const walletTransactionTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletTransactionTypeEnum"]> = ["DEPOSIT", "WITHDRAW", "REFUND"];


export const AiRegistryModelOwnerEnumMap = {
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

export const DispatchStatusMap = {
  "UNCONFIRMED": "UNCONFIRMED",
  "CONFIRMED": "CONFIRMED",
} as const;
export type DispatchStatusKey = keyof typeof DispatchStatusMap;
export type DispatchStatusValue = (typeof DispatchStatusMap)[DispatchStatusKey];

export const PaymentExecutionStatusMap = {
  "CREATING": "CREATING",
  "PENDING": "PENDING",
  "UNKNOWN": "UNKNOWN",
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