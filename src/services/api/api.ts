export interface paths {
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
    readonly "/user/wallet/deposit": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Initiate Wallet Deposit */
        readonly post: operations["initiate_wallet_deposit_user_wallet_deposit_post"];
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
    readonly "/user/subscription/purchase": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Initiate Subscription Purchase */
        readonly post: operations["initiate_subscription_purchase_user_subscription_purchase_post"];
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/user/subscription/purchase/confirm": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        /** Confirm Subscription Purchase */
        readonly post: operations["confirm_subscription_purchase_user_subscription_purchase_confirm_post"];
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
    readonly "/gateway/irr-exchange-rate": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Irr Exchange Rate */
        readonly get: operations["get_irr_exchange_rate_gateway_irr_exchange_rate_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        readonly patch?: never;
        readonly trace?: never;
    };
    readonly "/gateway/payment-result": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        /** Get Payment Result */
        readonly get: operations["get_payment_result_gateway_payment_result_get"];
        readonly put?: never;
        readonly post?: never;
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
    readonly "/file-manager/files/{file_uuid}/download": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly file_uuid: string;
            };
            readonly cookie?: never;
        };
        /** Get File Download Url */
        readonly get: operations["get_file_download_url_file_manager_files__file_uuid__download_get"];
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
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
    readonly "/admin/ai-task/user/{user_uuid}/message/{task_message_uuid}": {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly user_uuid: string;
                readonly task_message_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly get?: never;
        readonly put?: never;
        readonly post?: never;
        readonly delete?: never;
        readonly options?: never;
        readonly head?: never;
        /** Patch User Task Message */
        readonly patch: operations["patch_user_task_message_admin_ai_task_user__user_uuid__message__task_message_uuid__patch"];
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
            /** User Uuid */
            readonly user_uuid: string;
            /** Plan Uuid */
            readonly plan_uuid: string;
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
            /** Config Schema */
            readonly config_schema?: {
                readonly [key: string]: unknown;
            };
            /** Config Defaults */
            readonly config_defaults?: {
                readonly [key: string]: unknown;
            };
            /** Pricing By */
            readonly pricing_by?: readonly string[];
            /** Pricing Tiers */
            readonly pricing_tiers?: readonly {
                readonly [key: string]: unknown;
            }[];
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
        readonly AiRegistryModelOwnerEnum: "OPEN_AI" | "GOOGLE" | "BLACK_FOREST_LABS" | "K_LING_AI" | "BRIA" | "BYTE_DANCE" | "IDEO_GRAM" | "IMAGINE_ART" | "LIGHT_TICKS" | "MID_JOURNEY" | "MINI_MAX" | "PIX_VERSE" | "PRUNA_AI" | "RUNWAY" | "SOURCE_FUL" | "VIDU";
        /** AiRegistryModelProviderLinkCreateRequest */
        readonly AiRegistryModelProviderLinkCreateRequest: {
            /**
             * Ai Provider Uuid
             * Format: uuid
             */
            readonly ai_provider_uuid: string;
            /** External Model Name */
            readonly external_model_name: string;
            /** External Model Api Url */
            readonly external_model_api_url?: string | null;
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
        };
        /** AiRegistryModelProviderLinkDetail */
        readonly AiRegistryModelProviderLinkDetail: {
            /** Ai Provider Id */
            readonly ai_provider_id: number | null;
            /** Ai Model Id */
            readonly ai_model_id: number | null;
            /** External Model Name */
            readonly external_model_name: string;
            /** External Model Api Url */
            readonly external_model_api_url: string | null;
            /** Priority */
            readonly priority: number;
            /** Is Active */
            readonly is_active: boolean;
        };
        /** AiRegistryModelProviderLinkUpdateRequest */
        readonly AiRegistryModelProviderLinkUpdateRequest: {
            /** External Model Name */
            readonly external_model_name?: string | null;
            /** External Model Api Url */
            readonly external_model_api_url?: string | null;
            /** Priority */
            readonly priority?: number | null;
            /** Is Active */
            readonly is_active?: boolean | null;
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
            /** Config Schema */
            readonly config_schema?: {
                readonly [key: string]: unknown;
            } | null;
            /** Config Defaults */
            readonly config_defaults?: {
                readonly [key: string]: unknown;
            } | null;
            /** Pricing By */
            readonly pricing_by?: readonly string[] | null;
            /** Pricing Tiers */
            readonly pricing_tiers?: readonly {
                readonly [key: string]: unknown;
            }[] | null;
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
            /** Api Key */
            readonly api_key: string | null;
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
        /** AiTaskAdminPatchMessageRequest */
        readonly AiTaskAdminPatchMessageRequest: {
            readonly task_status?: components["schemas"]["AiTaskMessageStatusEnum"] | null;
            /** Message */
            readonly message?: string | null;
            /** Ai Model Config */
            readonly ai_model_config?: {
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
            /** Created At */
            readonly created_at: unknown;
            /** Updated At */
            readonly updated_at: unknown;
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
        /** Body_simple_upload_file_manager_simple_upload_post */
        readonly Body_simple_upload_file_manager_simple_upload_post: {
            /** File */
            readonly file?: string | null;
        };
        /** CompleteSubscriptionPurchaseRequest */
        readonly CompleteSubscriptionPurchaseRequest: {
            /** Session Id */
            readonly session_id: string;
        };
        /**
         * CreateSubscriptionPlanRequest
         * @description Request payload for creating a subscription plan.
         */
        readonly CreateSubscriptionPlanRequest: {
            readonly name: components["schemas"]["SubscriptionPlansEnum"];
            /** Display Name */
            readonly display_name?: string | null;
            /** Description */
            readonly description?: string | null;
            /** Scopes */
            readonly scopes?: readonly string[];
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
             * Is Popular
             * @default false
             */
            readonly is_popular: boolean;
            /**
             * Is Recommended
             * @default false
             */
            readonly is_recommended: boolean;
        };
        /**
         * CurrencyUnitEnum
         * @enum {string}
         */
        readonly CurrencyUnitEnum: "USD" | "IRR" | "USDMICRO";
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
        /** FileManagerPresignedGetResponse */
        readonly FileManagerPresignedGetResponse: {
            /** Presigned Url */
            readonly presigned_url: string;
            /**
             * Expire At
             * Format: date-time
             */
            readonly expire_at: string;
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
        /** GetAdminCurrencyExchangeRateRefreshResponseBody */
        readonly GetAdminCurrencyExchangeRateRefreshResponseBody: {
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
        /** GetIrrExchangeRateResponseBody */
        readonly GetIrrExchangeRateResponseBody: {
            /** Amount Usdmicro */
            readonly amount_usdmicro: number | null;
            readonly gateway_provider: components["schemas"]["PaymentGateWayProviderEnum"];
            /** Vat Percent */
            readonly vat_percent: number | null;
            /** Vat Amount */
            readonly vat_amount: number | null;
            /** Subtotal Transaction Amount */
            readonly subtotal_transaction_amount: number | null;
            /** Total Transaction Amount */
            readonly total_transaction_amount: number | null;
            readonly transaction_amount_currency: components["schemas"]["CurrencyUnitEnum"] | null;
        };
        /** GetPaymentResultResponseBody */
        readonly GetPaymentResultResponseBody: {
            /** Amount Usdmicro */
            readonly amount_usdmicro: number | null;
            readonly gateway_provider: components["schemas"]["PaymentGateWayProviderEnum"];
            /** Vat Percent */
            readonly vat_percent: number | null;
            /** Vat Amount */
            readonly vat_amount: number | null;
            /** Subtotal Transaction Amount */
            readonly subtotal_transaction_amount: number | null;
            /** Total Transaction Amount */
            readonly total_transaction_amount: number | null;
            readonly transaction_amount_currency: components["schemas"]["CurrencyUnitEnum"] | null;
            /** Balance After */
            readonly balance_after: number | null;
            readonly transaction_status: components["schemas"]["PaymentInvoiceStatusEnum"] | null;
        };
        /** HTTPValidationError */
        readonly HTTPValidationError: {
            /** Detail */
            readonly detail?: readonly components["schemas"]["ValidationError"][];
        };
        /**
         * PaymentGateWayProviderEnum
         * @enum {string}
         */
        readonly PaymentGateWayProviderEnum: "PAYPING_IRR";
        /**
         * PaymentInvoiceStatusEnum
         * @enum {string}
         */
        readonly PaymentInvoiceStatusEnum: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
        /** SubscriptionPlanListResponse */
        readonly SubscriptionPlanListResponse: {
            /** Items */
            readonly items: readonly components["schemas"]["SubscriptionPlanResponse"][];
            /** Total Count */
            readonly total_count: number;
        };
        /** SubscriptionPlanResponse */
        readonly SubscriptionPlanResponse: {
            /** Uuid */
            readonly uuid: string;
            /** Name */
            readonly name: string;
            /** Display Name */
            readonly display_name: string | null;
            /** Description */
            readonly description: string | null;
            /** Scopes */
            readonly scopes: readonly string[];
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
            /** Is Popular */
            readonly is_popular: boolean;
            /** Is Recommended */
            readonly is_recommended: boolean;
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
         * SubscriptionPlansEnum
         * @enum {string}
         */
        readonly SubscriptionPlansEnum: "ECONOMIC" | "BASIC" | "PRO";
        /** SubscriptionPurchaseRequest */
        readonly SubscriptionPurchaseRequest: {
            /** Plan Uuid */
            readonly plan_uuid: string;
            readonly gateway: components["schemas"]["PaymentGateWayProviderEnum"];
        };
        /** SubscriptionPurchaseResponse */
        readonly SubscriptionPurchaseResponse: {
            /** Session Id */
            readonly session_id: string;
            /** Gateway Url */
            readonly gateway_url: string;
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
            readonly gateway_provider: components["schemas"]["PaymentGateWayProviderEnum"];
            readonly plan: components["schemas"]["SubscriptionPlanResponse"];
        };
        /** UpdateSubscriptionPlanRequest */
        readonly UpdateSubscriptionPlanRequest: {
            readonly name?: components["schemas"]["SubscriptionPlansEnum"] | null;
            /** Display Name */
            readonly display_name?: string | null;
            /** Description */
            readonly description?: string | null;
            /** Scopes */
            readonly scopes?: readonly string[] | null;
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
            /** Is Popular */
            readonly is_popular?: boolean | null;
            /** Is Recommended */
            readonly is_recommended?: boolean | null;
        };
        /** UserGetInfoResponse */
        readonly UserGetInfoResponse: {
            /** User Uuid */
            readonly user_uuid: string;
            /** Email */
            readonly email: string | null;
            /** Name */
            readonly name: string | null;
            /** Phone Number */
            readonly phone_number: string | null;
            /** Scopes */
            readonly scopes: readonly string[] | null;
            readonly default_wallet: components["schemas"]["UserGetInfoResponseDefaultWallet"] | null;
            readonly active_subscription: components["schemas"]["UserSubscriptionResponse"] | null;
        };
        /** UserGetInfoResponseDefaultWallet */
        readonly UserGetInfoResponseDefaultWallet: {
            /** Wallet Id */
            readonly wallet_id: string;
            /** Name */
            readonly name: string;
            /** Is Owner */
            readonly is_owner: boolean;
            /** Balance Usdmicro */
            readonly balance_usdmicro: number;
            /** Soft Limit Usdmicro */
            readonly soft_limit_usdmicro: number | null;
            readonly wallet_type: components["schemas"]["WalletTypeEnum"];
            /** Is Active */
            readonly is_active: boolean;
            /** Is Locked */
            readonly is_locked: boolean;
            /** Extra Metadata */
            readonly extra_metadata: {
                readonly [key: string]: unknown;
            } | null;
            readonly user_role: components["schemas"]["WalletMemberRoleEnum"];
        };
        /** UserLoginBody */
        readonly UserLoginBody: {
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
            /** User Uuid */
            readonly user_uuid: string;
        };
        /** UserPatchEditInfoRequest */
        readonly UserPatchEditInfoRequest: {
            /**
             * Email
             * @example info@prepixai.com
             */
            readonly email?: string | null;
            /**
             * Name
             * @example Joan hanson
             */
            readonly name?: string | null;
        };
        /** UserPatchEditInfoResponse */
        readonly UserPatchEditInfoResponse: {
            /** User Uuid */
            readonly user_uuid: string;
            /** Email */
            readonly email: string | null;
            /** Name */
            readonly name: string | null;
            /** Phone Number */
            readonly phone_number: string | null;
            /** Scopes */
            readonly scopes: readonly string[] | null;
            readonly default_wallet: components["schemas"]["UserGetInfoResponseDefaultWallet"] | null;
        };
        /** UserResendOtpResponse */
        readonly UserResendOtpResponse: {
            /** Is Verified */
            readonly is_verified: boolean;
            /** Next Otp At */
            readonly next_otp_at: string | null;
        };
        /** UserResetPasswordBody */
        readonly UserResetPasswordBody: {
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
            /** Next Otp At */
            readonly next_otp_at: string | null;
        };
        /** UserSetPasswordBody */
        readonly UserSetPasswordBody: {
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
        /** UserStartBody */
        readonly UserStartBody: {
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
            /** Uuid */
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
            /** Is Active */
            readonly is_active: boolean;
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
        /** WalletDepositRequestBody */
        readonly WalletDepositRequestBody: {
            /** Amount Usdmicro */
            readonly amount_usdmicro: number;
            readonly gateway: components["schemas"]["PaymentGateWayProviderEnum"];
        };
        /** WalletDepositResponseBody */
        readonly WalletDepositResponseBody: {
            /** Session Id */
            readonly session_id: string;
            /** Gateway Url */
            readonly gateway_url: string;
            readonly gateway_provider: components["schemas"]["PaymentGateWayProviderEnum"];
        };
        /**
         * WalletMemberRoleEnum
         * @enum {string}
         */
        readonly WalletMemberRoleEnum: "MEMBER" | "ADMIN";
        /**
         * WalletTypeEnum
         * @enum {string}
         */
        readonly WalletTypeEnum: "PERSONAL" | "GROUP";
        /** AiRegistryModelDetail */
        readonly turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail: {
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
            /** Config Defaults */
            readonly config_defaults: {
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
        /** AiRegistryModelDetail */
        readonly turing_python_api__api__v1__ai_registry__user_schema__AiRegistryModelDetail: {
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
            /** Config Defaults */
            readonly config_defaults: {
                readonly [key: string]: unknown;
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type SchemaActivateUserSubscriptionRequest = components['schemas']['ActivateUserSubscriptionRequest'];
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
export type SchemaAiTaskAdminPatchMessageRequest = components['schemas']['AiTaskAdminPatchMessageRequest'];
export type SchemaAiTaskListResponse = components['schemas']['AiTaskListResponse'];
export type SchemaAiTaskMessageResponse = components['schemas']['AiTaskMessageResponse'];
export type SchemaAiTaskMessageStatusEnum = components['schemas']['AiTaskMessageStatusEnum'];
export type SchemaAiTaskResponse = components['schemas']['AiTaskResponse'];
export type SchemaAiTaskRuleEnum = components['schemas']['AiTaskRuleEnum'];
export type SchemaAiTaskTypeEnum = components['schemas']['AiTaskTypeEnum'];
export type SchemaBodySimpleUploadFileManagerSimpleUploadPost = components['schemas']['Body_simple_upload_file_manager_simple_upload_post'];
export type SchemaCompleteSubscriptionPurchaseRequest = components['schemas']['CompleteSubscriptionPurchaseRequest'];
export type SchemaCreateSubscriptionPlanRequest = components['schemas']['CreateSubscriptionPlanRequest'];
export type SchemaCurrencyUnitEnum = components['schemas']['CurrencyUnitEnum'];
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
export type SchemaFileManagerPresignedGetResponse = components['schemas']['FileManagerPresignedGetResponse'];
export type SchemaFileManagerUploadFileResponse = components['schemas']['FileManagerUploadFileResponse'];
export type SchemaFileManagerUserFilesResponse = components['schemas']['FileManagerUserFilesResponse'];
export type SchemaGenerateTaskRequest = components['schemas']['GenerateTaskRequest'];
export type SchemaGetAdminCurrencyExchangeRateRefreshResponseBody = components['schemas']['GetAdminCurrencyExchangeRateRefreshResponseBody'];
export type SchemaGetIrrExchangeRateResponseBody = components['schemas']['GetIrrExchangeRateResponseBody'];
export type SchemaGetPaymentResultResponseBody = components['schemas']['GetPaymentResultResponseBody'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaPaymentGateWayProviderEnum = components['schemas']['PaymentGateWayProviderEnum'];
export type SchemaPaymentInvoiceStatusEnum = components['schemas']['PaymentInvoiceStatusEnum'];
export type SchemaSubscriptionPlanListResponse = components['schemas']['SubscriptionPlanListResponse'];
export type SchemaSubscriptionPlanResponse = components['schemas']['SubscriptionPlanResponse'];
export type SchemaSubscriptionPlansEnum = components['schemas']['SubscriptionPlansEnum'];
export type SchemaSubscriptionPurchaseRequest = components['schemas']['SubscriptionPurchaseRequest'];
export type SchemaSubscriptionPurchaseResponse = components['schemas']['SubscriptionPurchaseResponse'];
export type SchemaUpdateSubscriptionPlanRequest = components['schemas']['UpdateSubscriptionPlanRequest'];
export type SchemaUserGetInfoResponse = components['schemas']['UserGetInfoResponse'];
export type SchemaUserGetInfoResponseDefaultWallet = components['schemas']['UserGetInfoResponseDefaultWallet'];
export type SchemaUserLoginBody = components['schemas']['UserLoginBody'];
export type SchemaUserLoginResponse = components['schemas']['UserLoginResponse'];
export type SchemaUserPatchEditInfoRequest = components['schemas']['UserPatchEditInfoRequest'];
export type SchemaUserPatchEditInfoResponse = components['schemas']['UserPatchEditInfoResponse'];
export type SchemaUserResendOtpResponse = components['schemas']['UserResendOtpResponse'];
export type SchemaUserResetPasswordBody = components['schemas']['UserResetPasswordBody'];
export type SchemaUserResetPasswordResponse = components['schemas']['UserResetPasswordResponse'];
export type SchemaUserSetPasswordBody = components['schemas']['UserSetPasswordBody'];
export type SchemaUserStartBody = components['schemas']['UserStartBody'];
export type SchemaUserStartResponse = components['schemas']['UserStartResponse'];
export type SchemaUserSubscriptionResponse = components['schemas']['UserSubscriptionResponse'];
export type SchemaValidationError = components['schemas']['ValidationError'];
export type SchemaWalletDepositRequestBody = components['schemas']['WalletDepositRequestBody'];
export type SchemaWalletDepositResponseBody = components['schemas']['WalletDepositResponseBody'];
export type SchemaWalletMemberRoleEnum = components['schemas']['WalletMemberRoleEnum'];
export type SchemaWalletTypeEnum = components['schemas']['WalletTypeEnum'];
export type SchemaTuringPythonApiApiV1AiRegistryAdminSchemaAiRegistryModelDetail = components['schemas']['turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail'];
export type SchemaTuringPythonApiApiV1AiRegistryUserSchemaAiRegistryModelDetail = components['schemas']['turing_python_api__api__v1__ai_registry__user_schema__AiRegistryModelDetail'];
export type $defs = Record<string, never>;
export interface operations {
    readonly start_user_start_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserStartBody"];
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
    readonly login_user_login_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserLoginBody"];
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
    readonly reset_password_user_reset_password_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["UserResetPasswordBody"];
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
                readonly "application/json": components["schemas"]["UserSetPasswordBody"];
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
                readonly "application/json": components["schemas"]["UserPatchEditInfoRequest"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["UserPatchEditInfoResponse"];
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
    readonly initiate_wallet_deposit_user_wallet_deposit_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["WalletDepositRequestBody"];
            };
        };
        readonly responses: {
            /** @description Successful Response */
            readonly 200: {
                headers: {
                    readonly [name: string]: unknown;
                };
                content: {
                    readonly "application/json": components["schemas"]["WalletDepositResponseBody"];
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
        };
    };
    readonly initiate_subscription_purchase_user_subscription_purchase_post: {
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
            readonly 200: {
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
        };
    };
    readonly confirm_subscription_purchase_user_subscription_purchase_confirm_post: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path?: never;
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["CompleteSubscriptionPurchaseRequest"];
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
                    readonly "application/json": components["schemas"]["GetAdminCurrencyExchangeRateRefreshResponseBody"];
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
        };
    };
    readonly list_subscription_plans_admin_subscription_plans_get: {
        readonly parameters: {
            readonly query?: {
                readonly include_inactive?: boolean;
                readonly include_deleted?: boolean;
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
        };
    };
    readonly get_irr_exchange_rate_gateway_irr_exchange_rate_get: {
        readonly parameters: {
            readonly query: {
                readonly amount_usdmicro: number;
                readonly provider: components["schemas"]["PaymentGateWayProviderEnum"];
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
                    readonly "application/json": components["schemas"]["GetIrrExchangeRateResponseBody"];
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
    readonly get_payment_result_gateway_payment_result_get: {
        readonly parameters: {
            readonly query: {
                readonly session_id: string;
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
                    readonly "application/json": components["schemas"]["GetPaymentResultResponseBody"];
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
        };
    };
    readonly get_file_download_url_file_manager_files__file_uuid__download_get: {
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
                    readonly "application/json": components["schemas"]["FileManagerPresignedGetResponse"];
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
        };
    };
    readonly patch_user_task_message_admin_ai_task_user__user_uuid__message__task_message_uuid__patch: {
        readonly parameters: {
            readonly query?: never;
            readonly header?: never;
            readonly path: {
                readonly user_uuid: string;
                readonly task_message_uuid: string;
            };
            readonly cookie?: never;
        };
        readonly requestBody: {
            readonly content: {
                readonly "application/json": components["schemas"]["AiTaskAdminPatchMessageRequest"];
            };
        };
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__user_schema__AiRegistryModelDetail"];
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"];
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"];
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"];
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
                    readonly "application/json": readonly components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"][];
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"];
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
                    readonly "application/json": components["schemas"]["turing_python_api__api__v1__ai_registry__admin_schema__AiRegistryModelDetail"];
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
export const aiRegistryModelOwnerEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelOwnerEnum"]> = ["OPEN_AI", "GOOGLE", "BLACK_FOREST_LABS", "K_LING_AI", "BRIA", "BYTE_DANCE", "IDEO_GRAM", "IMAGINE_ART", "LIGHT_TICKS", "MID_JOURNEY", "MINI_MAX", "PIX_VERSE", "PRUNA_AI", "RUNWAY", "SOURCE_FUL", "VIDU"];
export const aiRegistryModelSupportedTypesEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryModelSupportedTypesEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const aiRegistryProviderNameEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiRegistryProviderNameEnum"]> = ["RUNWARE", "AIMLAPI"];
export const aiTaskMessageStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskMessageStatusEnum"]> = ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED"];
export const aiTaskRuleEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskRuleEnum"]> = ["SYSTEM", "USER", "ASSISTANT", "TOOL", "FUNCTION", "INLINE"];
export const aiTaskTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["AiTaskTypeEnum"]> = ["TEXT", "IMAGE", "AUDIO", "VIDEO"];
export const currencyUnitEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["CurrencyUnitEnum"]> = ["USD", "IRR", "USDMICRO"];
export const paymentGateWayProviderEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentGateWayProviderEnum"]> = ["PAYPING_IRR"];
export const paymentInvoiceStatusEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["PaymentInvoiceStatusEnum"]> = ["PENDING", "PAID", "FAILED", "CANCELLED"];
export const subscriptionPlansEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["SubscriptionPlansEnum"]> = ["ECONOMIC", "BASIC", "PRO"];
export const walletMemberRoleEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletMemberRoleEnum"]> = ["MEMBER", "ADMIN"];
export const walletTypeEnumValues: ReadonlyArray<FlattenedDeepRequired<components>["schemas"]["WalletTypeEnum"]> = ["PERSONAL", "GROUP"];


export const AiRegistryModelOwnerEnumMap = {
  "OPEN_AI": "OPEN_AI",
  "GOOGLE": "GOOGLE",
  "BLACK_FOREST_LABS": "BLACK_FOREST_LABS",
  "K_LING_AI": "K_LING_AI",
  "BRIA": "BRIA",
  "BYTE_DANCE": "BYTE_DANCE",
  "IDEO_GRAM": "IDEO_GRAM",
  "IMAGINE_ART": "IMAGINE_ART",
  "LIGHT_TICKS": "LIGHT_TICKS",
  "MID_JOURNEY": "MID_JOURNEY",
  "MINI_MAX": "MINI_MAX",
  "PIX_VERSE": "PIX_VERSE",
  "PRUNA_AI": "PRUNA_AI",
  "RUNWAY": "RUNWAY",
  "SOURCE_FUL": "SOURCE_FUL",
  "VIDU": "VIDU",
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

export const PaymentGateWayProviderEnumMap = {
  "PAYPING_IRR": "PAYPING_IRR",
} as const;
export type PaymentGateWayProviderEnumKey = keyof typeof PaymentGateWayProviderEnumMap;
export type PaymentGateWayProviderEnumValue = (typeof PaymentGateWayProviderEnumMap)[PaymentGateWayProviderEnumKey];

export const PaymentInvoiceStatusEnumMap = {
  "PENDING": "PENDING",
  "PAID": "PAID",
  "FAILED": "FAILED",
  "CANCELLED": "CANCELLED",
} as const;
export type PaymentInvoiceStatusEnumKey = keyof typeof PaymentInvoiceStatusEnumMap;
export type PaymentInvoiceStatusEnumValue = (typeof PaymentInvoiceStatusEnumMap)[PaymentInvoiceStatusEnumKey];

export const SubscriptionPlansEnumMap = {
  "ECONOMIC": "ECONOMIC",
  "BASIC": "BASIC",
  "PRO": "PRO",
} as const;
export type SubscriptionPlansEnumKey = keyof typeof SubscriptionPlansEnumMap;
export type SubscriptionPlansEnumValue = (typeof SubscriptionPlansEnumMap)[SubscriptionPlansEnumKey];

export const WalletMemberRoleEnumMap = {
  "MEMBER": "MEMBER",
  "ADMIN": "ADMIN",
} as const;
export type WalletMemberRoleEnumKey = keyof typeof WalletMemberRoleEnumMap;
export type WalletMemberRoleEnumValue = (typeof WalletMemberRoleEnumMap)[WalletMemberRoleEnumKey];

export const WalletTypeEnumMap = {
  "PERSONAL": "PERSONAL",
  "GROUP": "GROUP",
} as const;
export type WalletTypeEnumKey = keyof typeof WalletTypeEnumMap;
export type WalletTypeEnumValue = (typeof WalletTypeEnumMap)[WalletTypeEnumKey];