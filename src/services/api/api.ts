export interface paths {
    readonly "/user/get-info": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Info */
        readonly get: operations["get_info_user_get_info_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/edit-info": {
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
        readonly patch: operations["edit_user_info_user_edit_info_patch"];
        readonly trace?: never;
    };
    readonly "/user/start": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Start */
        readonly post: operations["start_user_start_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/login": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Login */
        readonly post: operations["login_user_login_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/reset-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Reset Password */
        readonly post: operations["reset_password_user_reset_password_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/resend-otp": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Resend Otp */
        readonly post: operations["resend_otp_user_resend_otp_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/set-password": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Set Password */
        readonly post: operations["set_password_user_set_password_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/user/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Users */
        readonly get: operations["list_users_admin_user_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/user/{user_uuid}/get-info": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly user_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get User Info */
        readonly get: operations["get_user_info_admin_user__user_uuid__get_info_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/subscription/plans": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Subscription Plans */
        readonly get: operations["get_subscription_plans_user_subscription_plans_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/subscription/active": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Active Subscription */
        readonly get: operations["get_active_subscription_user_subscription_active_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/subscription/purchase": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Purchase Subscription */
        readonly post: operations["purchase_subscription_user_subscription_purchase_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/subscription-plan": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Create Subscription Plan */
        readonly post: operations["create_subscription_plan_admin_subscription_plan_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/subscription-plan/{plan_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly plan_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        /** Update Subscription Plan */
        readonly patch: operations["update_subscription_plan_admin_subscription_plan__plan_uuid__patch"];
        readonly trace?: never;
    };
    readonly "/admin/subscription-plans": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Subscription Plans */
        readonly get: operations["list_subscription_plans_admin_subscription_plans_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/subscription/activate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Activate User Subscription */
        readonly post: operations["activate_user_subscription_admin_subscription_activate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/subscription/deactivate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Deactivate User Subscription */
        readonly post: operations["deactivate_user_subscription_admin_subscription_deactivate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/wallet/charge": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Charge Wallet */
        readonly post: operations["charge_wallet_wallet_charge_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/wallet/wallet": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Current User Wallet */
        readonly get: operations["get_current_user_wallet_wallet_wallet_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/wallet/transactions": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Wallet Transactions */
        readonly get: operations["get_wallet_transactions_wallet_transactions_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/wallet/{wallet_uuid}/transactions": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly wallet_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Wallet Transactions */
        readonly get: operations["get_wallet_transactions_admin_wallet__wallet_uuid__transactions_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/wallet/{wallet_uuid}/charge": {
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
        readonly post: operations["charge_wallet_admin_wallet__wallet_uuid__charge_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/currency-exchange-rate/refresh": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Refresh Currency Exchange Rate */
        readonly get: operations["refresh_currency_exchange_rate_admin_currency_exchange_rate_refresh_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/payment/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Payments */
        readonly get: operations["list_payments_payment_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/payment/{payment_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly payment_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Payment Status */
        readonly get: operations["get_payment_status_payment__payment_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/payment": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Create Payment */
        readonly post: operations["create_payment_payment_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/payment/verify": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Verify Payment */
        readonly post: operations["verify_payment_payment_verify_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/simple-upload": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Simple Upload */
        readonly post: operations["simple_upload_file_manager_simple_upload_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/user-files": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List User Files */
        readonly get: operations["list_user_files_file_manager_user_files_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/files/presigned-urls": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Get File Presigned Urls */
        readonly post: operations["get_file_presigned_urls_file_manager_files_presigned_urls_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/files/{file_uuid}": {
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
        readonly put: operations["replace_file_file_manager_files__file_uuid__put"];
        readonly post?: never;
        /** Delete File */
        readonly delete: operations["delete_file_file_manager_files__file_uuid__delete"];
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/multipart/initiate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Initiate Multipart Upload */
        readonly post: operations["initiate_multipart_upload_file_manager_multipart_initiate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/multipart/presign-part": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Presign Multipart Part */
        readonly post: operations["presign_multipart_part_file_manager_multipart_presign_part_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/file-manager/multipart/complete": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Complete Multipart Upload */
        readonly post: operations["complete_multipart_upload_file_manager_multipart_complete_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/file-manager/files/{file_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly file_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get File */
        readonly get: operations["get_file_admin_file_manager_files__file_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        /** Delete File */
        readonly delete: operations["delete_file_admin_file_manager_files__file_uuid__delete"];
        readonly options?: never;
        readonly head?: never;
        /** Update File */
        readonly patch: operations["update_file_admin_file_manager_files__file_uuid__patch"];
        readonly trace?: never;
    };
    readonly "/admin/file-manager/files/delete-bulk": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Delete Bulk Files */
        readonly post: operations["delete_bulk_files_admin_file_manager_files_delete_bulk_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-task/events": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Stream Task Events */
        readonly get: operations["stream_task_events_ai_task_events_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-task/generate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Generate Task */
        readonly post: operations["generate_task_ai_task_generate_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-task/result/{task_message_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly task_message_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Task Result */
        readonly get: operations["get_task_result_ai_task_result__task_message_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-task/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Tasks List */
        readonly get: operations["get_tasks_list_ai_task_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-task/{task_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly task_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Task */
        readonly get: operations["get_task_ai_task__task_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-task/user/{user_uuid}/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly user_uuid: string;
            };
            readonly cookie?: never;
        };
        /** List User Tasks */
        readonly get: operations["list_user_tasks_admin_ai_task_user__user_uuid__list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-task/user/{user_uuid}/result/{task_message_uuid}": {
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
        readonly get: operations["check_user_task_result_admin_ai_task_user__user_uuid__result__task_message_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-registry/models": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Models */
        readonly get: operations["list_models_ai_registry_models_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-registry/models/{ai_model_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly ai_model_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Model */
        readonly get: operations["get_model_ai_registry_models__ai_model_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/ai-registry/webhooks/runware": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Runware Webhook */
        readonly post: operations["runware_webhook_ai_registry_webhooks_runware_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/provider": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Create Provider */
        readonly post: operations["create_provider_admin_ai_registry_provider_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/provider/{ai_provider_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly ai_provider_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Provider */
        readonly get: operations["get_provider_admin_ai_registry_provider__ai_provider_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        /** Update Provider */
        readonly patch: operations["update_provider_admin_ai_registry_provider__ai_provider_uuid__patch"];
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/provider/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Providers */
        readonly get: operations["list_providers_admin_ai_registry_provider_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/model": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Create Model */
        readonly post: operations["create_model_admin_ai_registry_model_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/model/{ai_model_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly ai_model_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get Model */
        readonly get: operations["get_model_admin_ai_registry_model__ai_model_uuid__get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        /** Update Model */
        readonly patch: operations["update_model_admin_ai_registry_model__ai_model_uuid__patch"];
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/model/list": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** List Models */
        readonly get: operations["list_models_admin_ai_registry_model_list_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/model/{ai_model_uuid}/provider": {
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
        readonly post: operations["add_provider_to_model_admin_ai_registry_model__ai_model_uuid__provider_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/admin/ai-registry/model/{ai_model_uuid}/provider/{ai_provider_uuid}": {
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
        readonly patch: operations["update_provider_link_admin_ai_registry_model__ai_model_uuid__provider__ai_provider_uuid__patch"];
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
        /** AdminUserGetInfoResponse */
        readonly AdminUserGetInfoResponse: {
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
            /**
             * User Uuid
             * Format: uuid
             */
            readonly user_uuid: string;
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
        /**
         * AiRegistryModelOwnerEnum
         * @enum {string}
         */
        readonly AiRegistryModelOwnerEnum: "OPEN_AI" | "GOOGLE" | "BLACK_FOREST_LABS" | "K_LING_AI" | "BRIA" | "BYTE_DANCE" | "IMAGINE_ART" | "LIGHT_TICKS" | "MID_JOURNEY" | "MINI_MAX" | "PIX_VERSE" | "PRUNA_AI" | "RUNWAY" | "SOURCE_FUL" | "VIDU" | "IDEOGRAM";
        /** AiRegistryModelProviderLinkCreateRequest */
        readonly AiRegistryModelProviderLinkCreateRequest: {
            /**
             * Ai Provider Uuid
             * Format: uuid
             */
            readonly ai_provider_uuid: string;
            /** External Model Name */
            readonly external_model_name: {
                readonly [key: string]: string;
            };
            /** External Model Api Url */
            readonly external_model_api_url?: {
                readonly [key: string]: string | null;
            };
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
            /** Config Schema */
            readonly config_schema?: {
                readonly [key: string]: unknown;
            };
            /** Field Mapping */
            readonly field_mapping?: {
                readonly [key: string]: unknown;
            };
            /** Pricing By */
            readonly pricing_by?: readonly string[];
            /** Pricing Tiers */
            readonly pricing_tiers?: readonly {
                readonly [key: string]: unknown;
            }[];
        };
        /** AiRegistryModelProviderLinkDetail */
        readonly AiRegistryModelProviderLinkDetail: {
            /** Ai Provider Id */
            readonly ai_provider_id: number | null;
            /** Ai Model Id */
            readonly ai_model_id: number | null;
            /** External Model Name */
            readonly external_model_name: {
                readonly [key: string]: string;
            };
            /** External Model Api Url */
            readonly external_model_api_url: {
                readonly [key: string]: string | null;
            };
            /** Priority */
            readonly priority: number;
            /** Is Active */
            readonly is_active: boolean;
            /** Config Schema */
            readonly config_schema: {
                readonly [key: string]: unknown;
            };
            /** Field Mapping */
            readonly field_mapping: {
                readonly [key: string]: unknown;
            };
            /** Pricing By */
            readonly pricing_by: readonly string[];
            /** Pricing Tiers */
            readonly pricing_tiers: readonly {
                readonly [key: string]: unknown;
            }[];
        };
        /** AiRegistryModelProviderLinkUpdateRequest */
        readonly AiRegistryModelProviderLinkUpdateRequest: {
            /** External Model Name */
            readonly external_model_name?: {
                readonly [key: string]: string;
            } | null;
            /** External Model Api Url */
            readonly external_model_api_url?: {
                readonly [key: string]: string | null;
            } | null;
            /** Priority */
            readonly priority?: number | null;
            /** Is Active */
            readonly is_active?: boolean | null;
            /** Config Schema */
            readonly config_schema?: {
                readonly [key: string]: unknown;
            } | null;
            /** Field Mapping */
            readonly field_mapping?: {
                readonly [key: string]: unknown;
            } | null;
            /** Pricing By */
            readonly pricing_by?: readonly string[] | null;
            /** Pricing Tiers */
            readonly pricing_tiers?: readonly {
                readonly [key: string]: unknown;
            }[] | null;
        };
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
            /** Pricing Tiers */
            readonly pricing_tiers: readonly {
                readonly [key: string]: unknown;
            }[];
        };
        /**
         * AiRegistryModelSupportedTypesEnum
         * @enum {string}
         */
        readonly AiRegistryModelSupportedTypesEnum: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
        /** AiRegistryModelUpdateRequest */
        readonly AiRegistryModelUpdateRequest: {
            readonly model_owner?: components["schemas"]["AiRegistryModelOwnerEnum"] | null;
            /** Name */
            readonly name?: string | null;
            /** Display Name */
            readonly display_name?: string | null;
            /** Description */
            readonly description?: string | null;
            /** Icon Url */
            readonly icon_url?: string | null;
            /** Tags */
            readonly tags?: readonly string[] | null;
            /** Supported Inputs */
            readonly supported_inputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][] | null;
            /** Supported Outputs */
            readonly supported_outputs?: readonly components["schemas"]["AiRegistryModelSupportedTypesEnum"][] | null;
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
            /** Api Key */
            readonly api_key?: string | null;
            /** Rate Limit Per Min */
            readonly rate_limit_per_min?: number | null;
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
         * AiRegistryProviderNameEnum
         * @enum {string}
         */
        readonly AiRegistryProviderNameEnum: "RUNWARE" | "AIMLAPI";
        /** AiRegistryProviderUpdateRequest */
        readonly AiRegistryProviderUpdateRequest: {
            /** Display Name */
            readonly display_name?: string | null;
            /** Base Api Url */
            readonly base_api_url?: string | null;
            /** Api Key */
            readonly api_key?: string | null;
            /** Rate Limit Per Min */
            readonly rate_limit_per_min?: number | null;
            /** Meta */
            readonly meta?: {
                readonly [key: string]: unknown;
            } | null;
        };
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
            /**
             * Ai Provider Uuid
             * Format: uuid
             */
            readonly ai_provider_uuid: string;
            /** Ai Generation Request Uuid */
            readonly ai_generation_request_uuid: string | null;
            /** Ai External Provider Task Id */
            readonly ai_external_provider_task_id: string | null;
            readonly task_status: components["schemas"]["AiTaskMessageStatusEnum"] | null;
            /** Cost Usdmicro */
            readonly cost_usdmicro: number | null;
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
             * Expire Date
             * Format: date-time
             */
            readonly expire_date: string;
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
        /** Body_replace_file_file_manager_files__file_uuid__put */
        readonly Body_replace_file_file_manager_files__file_uuid__put: {
            /** File */
            readonly file?: string | null;
        };
        /** Body_simple_upload_file_manager_simple_upload_post */
        readonly Body_simple_upload_file_manager_simple_upload_post: {
            /** File */
            readonly file?: string | null;
        };
        /** Body_verify_payment_payment_verify_post */
        readonly Body_verify_payment_payment_verify_post: {
            /** Status */
            readonly status: number;
            /** Data */
            readonly data: string;
            /** Errorcode */
            readonly errorCode?: string | null;
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
        /** ChargeWalletResponse */
        readonly ChargeWalletResponse: {
            /**
             * Payment Uuid
             * Format: uuid
             */
            readonly payment_uuid: string;
            /** Payment Url */
            readonly payment_url: string;
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
            /** Amount Irr Without Tax */
            readonly amount_irr_without_tax: number;
            /** Tax Percent */
            readonly tax_percent: number;
            /** Tax Amount Irr */
            readonly tax_amount_irr: number;
            /** Total Amount Irr */
            readonly total_amount_irr: number;
            /**
             * Wallet Uuid
             * Format: uuid
             */
            readonly wallet_uuid: string;
        };
        /** CreatePaymentRequest */
        readonly CreatePaymentRequest: {
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
            /**
             * Include Profit Percentage
             * @default false
             */
            readonly include_profit_percentage: boolean;
        };
        /** CreatePaymentResponse */
        readonly CreatePaymentResponse: {
            /**
             * Payment Uuid
             * Format: uuid
             */
            readonly payment_uuid: string;
            /** Amount Irr Without Tax */
            readonly amount_irr_without_tax: number;
            /** Tax Percent */
            readonly tax_percent: number;
            /** Tax Amount Irr */
            readonly tax_amount_irr: number;
            /** Total Amount Irr */
            readonly total_amount_irr: number;
            /** Payment Url */
            readonly payment_url: string;
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
            /** Price Usdmicro */
            readonly price_usdmicro: number;
            /**
             * Duration Days
             * @default 30
             */
            readonly duration_days: number;
            /** Balance Gift Amount Usdmicro */
            readonly balance_gift_amount_usdmicro?: number | null;
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
            /**
             * Idempotency Key
             * Format: uuid
             */
            readonly idempotency_key: string;
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
        /** PaymentListItemResponse */
        readonly PaymentListItemResponse: {
            /**
             * Payment Uuid
             * Format: uuid
             */
            readonly payment_uuid: string;
            /** Amount Irr Without Tax */
            readonly amount_irr_without_tax: number;
            /** Tax Percent */
            readonly tax_percent: number;
            /** Tax Amount Irr */
            readonly tax_amount_irr: number;
            /** Total Amount Irr */
            readonly total_amount_irr: number;
            readonly status: components["schemas"]["PaymentStatusEnum"];
            /** Payment Url */
            readonly payment_url: string | null;
            readonly target_type: components["schemas"]["PaymentTargetTypeEnum"] | null;
            /** Target Uuid */
            readonly target_uuid: string | null;
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
        /** PaymentListResponse */
        readonly PaymentListResponse: {
            /** Items */
            readonly items: readonly components["schemas"]["PaymentListItemResponse"][];
            /** Has Next */
            readonly has_next: boolean;
        };
        /**
         * PaymentStatusEnum
         * @enum {string}
         */
        readonly PaymentStatusEnum: "PENDING" | "PAID" | "FAILED";
        /** PaymentStatusResponse */
        readonly PaymentStatusResponse: {
            /**
             * Payment Uuid
             * Format: uuid
             */
            readonly payment_uuid: string;
            readonly status: components["schemas"]["PaymentStatusEnum"];
        };
        /**
         * PaymentTargetTypeEnum
         * @enum {string}
         */
        readonly PaymentTargetTypeEnum: "subscription" | "wallet";
        /** RunwareWebhookItem */
        readonly RunwareWebhookItem: {
            /** Taskuuid */
            readonly taskUUID: string;
            /** Status */
            readonly status?: string | null;
            /** Cost */
            readonly cost?: number | null;
            /** Imageurl */
            readonly imageURL?: string | null;
            /** Videourl */
            readonly videoURL?: string | null;
            /** Text */
            readonly text?: string | null;
        } & {
            readonly [key: string]: unknown;
        };
        /** RunwareWebhookRequest */
        readonly RunwareWebhookRequest: {
            /** Taskuuid */
            readonly taskUUID?: string | null;
            /** Status */
            readonly status?: string | null;
            /** Cost */
            readonly cost?: number | null;
            /** Imageurl */
            readonly imageURL?: string | null;
            /** Videourl */
            readonly videoURL?: string | null;
            /** Text */
            readonly text?: string | null;
            /** Data */
            readonly data?: readonly components["schemas"]["RunwareWebhookItem"][] | null;
            /** Errors */
            readonly errors?: readonly components["schemas"]["RunwareWebhookItem"][] | null;
        } & {
            readonly [key: string]: unknown;
        };
        /** RunwareWebhookResponse */
        readonly RunwareWebhookResponse: {
            /** Processed */
            readonly processed: number;
            /**
             * Failed
             * @default 0
             */
            readonly failed: number;
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
            /** Price Usdmicro */
            readonly price_usdmicro: number;
            /** Price Irr */
            readonly price_irr?: number | null;
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
        /** SubscriptionPurchaseResponse */
        readonly SubscriptionPurchaseResponse: {
            /**
             * Payment Uuid
             * Format: uuid
             */
            readonly payment_uuid: string;
            /** Payment Url */
            readonly payment_url: string;
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
            /** Amount Irr Without Tax */
            readonly amount_irr_without_tax: number;
            /** Tax Percent */
            readonly tax_percent: number;
            /** Tax Amount Irr */
            readonly tax_amount_irr: number;
            /** Total Amount Irr */
            readonly total_amount_irr: number;
            readonly plan: components["schemas"]["SubscriptionPlanResponse"];
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
            /** Price Usdmicro */
            readonly price_usdmicro?: number | null;
            /** Duration Days */
            readonly duration_days?: number | null;
            /** Balance Gift Amount Usdmicro */
            readonly balance_gift_amount_usdmicro?: number | null;
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
        readonly WalletOperationSourceEnum: "admin" | "ai_registry_generation" | "ai_task_message" | "payment" | "subscription";
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
        /** AiRegistryModelDetail */
        readonly perpix_core_api__modules__ai_registry__presentation__schemas__AiRegistryModelDetail: {
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
            /** Pricing Tiers */
            readonly pricing_tiers: readonly {
                readonly [key: string]: unknown;
            }[];
            /** Config Schema */
            readonly config_schema: {
                readonly [key: string]: unknown;
            };
            /** Meta */
            readonly meta: {
                readonly [key: string]: unknown;
            };
        };
        /** AiRegistryModelDetail */
        readonly perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail: {
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
            /** Config Schema */
            readonly config_schema: {
                readonly [key: string]: unknown;
            };
            /** Pricing By */
            readonly pricing_by: readonly string[];
            /** Pricing Tiers */
            readonly pricing_tiers: readonly {
                readonly [key: string]: unknown;
            }[];
            /** Is Active */
            readonly is_active: boolean;
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
        /**
         * ApplicationErrorCode
         * @enum {integer}
         */
        readonly ApplicationErrorCode: 900 | 901 | 902 | 999 | 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1100 | 1101 | 1102 | 1103 | 1104 | 1105 | 1106 | 1200 | 1201 | 1202 | 1203 | 1204 | 1205 | 1300 | 1301 | 1302 | 1303 | 1304 | 1400 | 1401 | 1402 | 1404 | 1405 | 1406 | 1500 | 1501 | 1502 | 1503 | 1504 | 1505 | 1506 | 1507 | 1508 | 1600 | 1601 | 1602 | 1700 | 1701 | 1702;
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
             * @default null
             */
            readonly request_id: string | null;
            /**
             * Retry After
             * @description Seconds until a rate-limited request can retry.
             * @default null
             */
            readonly retry_after: number | null;
            /**
             * Required Scopes
             * @description Subscription scopes required to perform the operation.
             * @default null
             */
            readonly required_scopes: readonly string[] | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type SchemaActivateUserSubscriptionRequest = components['schemas']['ActivateUserSubscriptionRequest'];
export type SchemaAdminUserGetInfoResponse = components['schemas']['AdminUserGetInfoResponse'];
export type SchemaAiRegistryModelCreateRequest = components['schemas']['AiRegistryModelCreateRequest'];
export type SchemaAiRegistryModelOwnerEnum = components['schemas']['AiRegistryModelOwnerEnum'];
export type SchemaAiRegistryModelProviderLinkCreateRequest = components['schemas']['AiRegistryModelProviderLinkCreateRequest'];
export type SchemaAiRegistryModelProviderLinkDetail = components['schemas']['AiRegistryModelProviderLinkDetail'];
export type SchemaAiRegistryModelProviderLinkUpdateRequest = components['schemas']['AiRegistryModelProviderLinkUpdateRequest'];
export type SchemaAiRegistryModelSummary = components['schemas']['AiRegistryModelSummary'];
export type SchemaAiRegistryModelSupportedTypesEnum = components['schemas']['AiRegistryModelSupportedTypesEnum'];
export type SchemaAiRegistryModelUpdateRequest = components['schemas']['AiRegistryModelUpdateRequest'];
export type SchemaAiRegistryProviderCreateRequest = components['schemas']['AiRegistryProviderCreateRequest'];
export type SchemaAiRegistryProviderDetail = components['schemas']['AiRegistryProviderDetail'];
export type SchemaAiRegistryProviderNameEnum = components['schemas']['AiRegistryProviderNameEnum'];
export type SchemaAiRegistryProviderUpdateRequest = components['schemas']['AiRegistryProviderUpdateRequest'];
export type SchemaAiTaskListResponse = components['schemas']['AiTaskListResponse'];
export type SchemaAiTaskMessageResponse = components['schemas']['AiTaskMessageResponse'];
export type SchemaAiTaskMessageStatusEnum = components['schemas']['AiTaskMessageStatusEnum'];
export type SchemaAiTaskResponse = components['schemas']['AiTaskResponse'];
export type SchemaAiTaskRuleEnum = components['schemas']['AiTaskRuleEnum'];
export type SchemaAiTaskTypeEnum = components['schemas']['AiTaskTypeEnum'];
export type SchemaBodyReplaceFileFileManagerFilesFileUuidPut = components['schemas']['Body_replace_file_file_manager_files__file_uuid__put'];
export type SchemaBodySimpleUploadFileManagerSimpleUploadPost = components['schemas']['Body_simple_upload_file_manager_simple_upload_post'];
export type SchemaBodyVerifyPaymentPaymentVerifyPost = components['schemas']['Body_verify_payment_payment_verify_post'];
export type SchemaChargeWalletRequest = components['schemas']['ChargeWalletRequest'];
export type SchemaChargeWalletResponse = components['schemas']['ChargeWalletResponse'];
export type SchemaCreatePaymentRequest = components['schemas']['CreatePaymentRequest'];
export type SchemaCreatePaymentResponse = components['schemas']['CreatePaymentResponse'];
export type SchemaCreateSubscriptionPlanRequest = components['schemas']['CreateSubscriptionPlanRequest'];
export type SchemaCreateWalletTransactionResponse = components['schemas']['CreateWalletTransactionResponse'];
export type SchemaCurrencyExchangeRateRefreshResponse = components['schemas']['CurrencyExchangeRateRefreshResponse'];
export type SchemaCurrencyUnitEnum = components['schemas']['CurrencyUnitEnum'];
export type SchemaDeactivateUserSubscriptionRequest = components['schemas']['DeactivateUserSubscriptionRequest'];
export type SchemaFileManagerAdminDeleteBulkRequest = components['schemas']['FileManagerAdminDeleteBulkRequest'];
export type SchemaFileManagerAdminDeleteBulkResponse = components['schemas']['FileManagerAdminDeleteBulkResponse'];
export type SchemaFileManagerAdminFileResponse = components['schemas']['FileManagerAdminFileResponse'];
export type SchemaFileManagerAdminUpdateFileRequest = components['schemas']['FileManagerAdminUpdateFileRequest'];
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
export type SchemaPaymentListItemResponse = components['schemas']['PaymentListItemResponse'];
export type SchemaPaymentListResponse = components['schemas']['PaymentListResponse'];
export type SchemaPaymentStatusEnum = components['schemas']['PaymentStatusEnum'];
export type SchemaPaymentStatusResponse = components['schemas']['PaymentStatusResponse'];
export type SchemaPaymentTargetTypeEnum = components['schemas']['PaymentTargetTypeEnum'];
export type SchemaRunwareWebhookItem = components['schemas']['RunwareWebhookItem'];
export type SchemaRunwareWebhookRequest = components['schemas']['RunwareWebhookRequest'];
export type SchemaRunwareWebhookResponse = components['schemas']['RunwareWebhookResponse'];
export type SchemaSubscriptionPlanListResponse = components['schemas']['SubscriptionPlanListResponse'];
export type SchemaSubscriptionPlanResponse = components['schemas']['SubscriptionPlanResponse'];
export type SchemaSubscriptionPurchaseRequest = components['schemas']['SubscriptionPurchaseRequest'];
export type SchemaSubscriptionPurchaseResponse = components['schemas']['SubscriptionPurchaseResponse'];
export type SchemaUpdateSubscriptionPlanRequest = components['schemas']['UpdateSubscriptionPlanRequest'];
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
export type SchemaPerpixCoreApiModulesAiRegistryPresentationSchemasAiRegistryModelDetail = components['schemas']['perpix_core_api__modules__ai_registry__presentation__schemas__AiRegistryModelDetail'];
export type SchemaPerpixCoreApiModulesAiRegistryPresentationSchemasAdminAiRegistryModelDetail = components['schemas']['perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail'];
export type SchemaApplicationErrorCode = components['schemas']['ApplicationErrorCode'];
export type SchemaApplicationErrorResponse = components['schemas']['ApplicationErrorResponse'];
export type $defs = Record<string, never>;
export interface operations {
    readonly get_info_user_get_info_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly edit_user_info_user_edit_info_patch: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly start_user_start_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly login_user_login_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly reset_password_user_reset_password_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly resend_otp_user_resend_otp_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly set_password_user_set_password_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_users_admin_user_list_get: {
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
                    readonly "application/json": readonly components["schemas"]["AdminUserGetInfoResponse"][];
                };
            };
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_user_info_admin_user__user_uuid__get_info_get: {
        readonly parameters: {
            readonly query?: never;
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
                    readonly "application/json": components["schemas"]["AdminUserGetInfoResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_subscription_plans_user_subscription_plans_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_active_subscription_user_subscription_active_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly purchase_subscription_user_subscription_purchase_post: {
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
                    readonly "application/json": components["schemas"]["SubscriptionPurchaseResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly create_subscription_plan_admin_subscription_plan_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly update_subscription_plan_admin_subscription_plan__plan_uuid__patch: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_subscription_plans_admin_subscription_plans_get: {
        readonly parameters: {
            readonly query?: {
                readonly include_inactive?: boolean;
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
                    readonly "application/json": components["schemas"]["SubscriptionPlanListResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly activate_user_subscription_admin_subscription_activate_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly deactivate_user_subscription_admin_subscription_deactivate_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly charge_wallet_wallet_charge_post: {
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
                    readonly "application/json": components["schemas"]["ChargeWalletResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_current_user_wallet_wallet_wallet_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_wallet_transactions_wallet_transactions_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_wallet_transactions_admin_wallet__wallet_uuid__transactions_get: {
        readonly parameters: {
            readonly query: {
                readonly user_uuid: string;
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly charge_wallet_admin_wallet__wallet_uuid__charge_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly refresh_currency_exchange_rate_admin_currency_exchange_rate_refresh_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_payments_payment_list_get: {
        readonly parameters: {
            readonly query?: {
                readonly status?: components["schemas"]["PaymentStatusEnum"] | null;
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_payment_status_payment__payment_uuid__get: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly payment_uuid: string;
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
                    readonly "application/json": components["schemas"]["PaymentStatusResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly create_payment_payment_post: {
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
            /** @description Successful Response */
            readonly 201: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["CreatePaymentResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly verify_payment_payment_verify_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/x-www-form-urlencoded": components["schemas"]["Body_verify_payment_payment_verify_post"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 303: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly simple_upload_file_manager_simple_upload_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody?: {
            readonly content: {
                readonly "multipart/form-data": components["schemas"]["Body_simple_upload_file_manager_simple_upload_post"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_user_files_file_manager_user_files_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_file_presigned_urls_file_manager_files_presigned_urls_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly replace_file_file_manager_files__file_uuid__put: {
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
                readonly "multipart/form-data": components["schemas"]["Body_replace_file_file_manager_files__file_uuid__put"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly delete_file_file_manager_files__file_uuid__delete: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly initiate_multipart_upload_file_manager_multipart_initiate_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly presign_multipart_part_file_manager_multipart_presign_part_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly complete_multipart_upload_file_manager_multipart_complete_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_file_admin_file_manager_files__file_uuid__get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly delete_file_admin_file_manager_files__file_uuid__delete: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly update_file_admin_file_manager_files__file_uuid__patch: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly delete_bulk_files_admin_file_manager_files_delete_bulk_post: {
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
            /** @description Validation Error */
            readonly 422: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly stream_task_events_ai_task_events_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly generate_task_ai_task_generate_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_task_result_ai_task_result__task_message_uuid__get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_tasks_list_ai_task_list_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_task_ai_task__task_uuid__get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_user_tasks_admin_ai_task_user__user_uuid__list_get: {
        readonly parameters: {
            readonly query?: {
                readonly offset?: number;
                readonly limit?: number;
                readonly task_type?: components["schemas"]["AiTaskTypeEnum"] | null;
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly check_user_task_result_admin_ai_task_user__user_uuid__result__task_message_uuid__get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_models_ai_registry_models_get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_model_ai_registry_models__ai_model_uuid__get: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly runware_webhook_ai_registry_webhooks_runware_post: {
        readonly parameters: {
            readonly query: {
                readonly token: string;
                readonly external_request_uuid: string;
            };
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["RunwareWebhookRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["RunwareWebhookResponse"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly create_provider_admin_ai_registry_provider_post: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_provider_admin_ai_registry_provider__ai_provider_uuid__get: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly update_provider_admin_ai_registry_provider__ai_provider_uuid__patch: {
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_providers_admin_ai_registry_provider_list_get: {
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
                    readonly "application/json": readonly components["schemas"]["AiRegistryProviderDetail"][];
                };
            };
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly create_model_admin_ai_registry_model_post: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly get_model_admin_ai_registry_model__ai_model_uuid__get: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly update_model_admin_ai_registry_model__ai_model_uuid__patch: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly list_models_admin_ai_registry_model_list_get: {
        readonly parameters: {
            readonly query?: {
                readonly only_active?: boolean;
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
                    readonly "application/json": readonly components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"][];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly add_provider_to_model_admin_ai_registry_model__ai_model_uuid__provider_post: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
                };
            };
        };
    };
    readonly update_provider_link_admin_ai_registry_model__ai_model_uuid__provider__ai_provider_uuid__patch: {
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
                    readonly "application/json": components["schemas"]["perpix_core_api__modules__ai_registry__presentation__schemas_admin__AiRegistryModelDetail"];
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
            /** @description Application error */
            readonly default: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["ApplicationErrorResponse"];
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
export const aiRegistryModelOwnerEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelOwnerEnum"]> = ["OPEN_AI", "GOOGLE", "BLACK_FOREST_LABS", "K_LING_AI", "BRIA", "BYTE_DANCE", "IMAGINE_ART", "LIGHT_TICKS", "MID_JOURNEY", "MINI_MAX", "PIX_VERSE", "PRUNA_AI", "RUNWAY", "SOURCE_FUL", "VIDU", "IDEOGRAM"];
export const aiRegistryModelSupportedTypesEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelSupportedTypesEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const aiRegistryProviderNameEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryProviderNameEnum"]> = ["RUNWARE", "AIMLAPI"];
export const aiTaskMessageStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskMessageStatusEnum"]> = ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED"];
export const aiTaskRuleEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskRuleEnum"]> = ["SYSTEM", "USER", "ASSISTANT", "TOOL", "FUNCTION", "INLINE"];
export const aiTaskTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskTypeEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const currencyUnitEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["CurrencyUnitEnum"]> = ["USD", "IRR", "USDMICRO"];
export const paymentStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentStatusEnum"]> = ["PENDING", "PAID", "FAILED"];
export const paymentTargetTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentTargetTypeEnum"]> = ["subscription", "wallet"];
export const walletOperationSourceEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletOperationSourceEnum"]> = ["admin", "ai_registry_generation", "ai_task_message", "payment", "subscription"];
export const walletTransactionTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletTransactionTypeEnum"]> = ["DEPOSIT", "WITHDRAW", "REFUND"];
export const applicationErrorCodeValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["ApplicationErrorCode"]> = [900, 901, 902, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1200, 1201, 1202, 1203, 1204, 1205, 1300, 1301, 1302, 1303, 1304, 1400, 1401, 1402, 1404, 1405, 1406, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1600, 1601, 1602, 1700, 1701, 1702];


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

export const AiRegistryProviderNameEnumMap = {
  "RUNWARE": "RUNWARE",
  "AIMLAPI": "AIMLAPI",
} as const;
export type AiRegistryProviderNameEnumKey = keyof typeof AiRegistryProviderNameEnumMap;
export type AiRegistryProviderNameEnumValue = (typeof AiRegistryProviderNameEnumMap)[AiRegistryProviderNameEnumKey];

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

export const CurrencyUnitEnumMap = {
  "USD": "USD",
  "IRR": "IRR",
  "USDMICRO": "USDMICRO",
} as const;
export type CurrencyUnitEnumKey = keyof typeof CurrencyUnitEnumMap;
export type CurrencyUnitEnumValue = (typeof CurrencyUnitEnumMap)[CurrencyUnitEnumKey];

export const PaymentStatusEnumMap = {
  "PENDING": "PENDING",
  "PAID": "PAID",
  "FAILED": "FAILED",
} as const;
export type PaymentStatusEnumKey = keyof typeof PaymentStatusEnumMap;
export type PaymentStatusEnumValue = (typeof PaymentStatusEnumMap)[PaymentStatusEnumKey];

export const PaymentTargetTypeEnumMap = {
  "subscription": "subscription",
  "wallet": "wallet",
} as const;
export type PaymentTargetTypeEnumKey = keyof typeof PaymentTargetTypeEnumMap;
export type PaymentTargetTypeEnumValue = (typeof PaymentTargetTypeEnumMap)[PaymentTargetTypeEnumKey];

export const WalletOperationSourceEnumMap = {
  "admin": "admin",
  "ai_registry_generation": "ai_registry_generation",
  "ai_task_message": "ai_task_message",
  "payment": "payment",
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

export const ApplicationErrorCodeMap = {
  900: 900,
  901: 901,
  902: 902,
  999: 999,
  1000: 1000,
  1001: 1001,
  1002: 1002,
  1003: 1003,
  1004: 1004,
  1005: 1005,
  1100: 1100,
  1101: 1101,
  1102: 1102,
  1103: 1103,
  1104: 1104,
  1105: 1105,
  1106: 1106,
  1200: 1200,
  1201: 1201,
  1202: 1202,
  1203: 1203,
  1204: 1204,
  1205: 1205,
  1300: 1300,
  1301: 1301,
  1302: 1302,
  1303: 1303,
  1304: 1304,
  1400: 1400,
  1401: 1401,
  1402: 1402,
  1404: 1404,
  1405: 1405,
  1406: 1406,
  1500: 1500,
  1501: 1501,
  1502: 1502,
  1503: 1503,
  1504: 1504,
  1505: 1505,
  1506: 1506,
  1507: 1507,
  1508: 1508,
  1600: 1600,
  1601: 1601,
  1602: 1602,
  1700: 1700,
  1701: 1701,
  1702: 1702,
} as const;
export type ApplicationErrorCodeKey = keyof typeof ApplicationErrorCodeMap;
export type ApplicationErrorCodeValue = (typeof ApplicationErrorCodeMap)[ApplicationErrorCodeKey];