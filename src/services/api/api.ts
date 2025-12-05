export interface paths {
  readonly '/user/start': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Start */
    readonly post: operations['start_user_start_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/login': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Login */
    readonly post: operations['login_user_login_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/reset-password': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Reset Password */
    readonly post: operations['reset_password_user_reset_password_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/resend-otp': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Resend Otp */
    readonly post: operations['resend_otp_user_resend_otp_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/set-password': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Set Password */
    readonly post: operations['set_password_user_set_password_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/get-info': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Info */
    readonly get: operations['get_info_user_get_info_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/edit-info': {
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
    readonly patch: operations['edit_user_info_user_edit_info_patch'];
    readonly trace?: never;
  };
  readonly '/user/wallet/deposit': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Initiate Wallet Deposit */
    readonly post: operations['initiate_wallet_deposit_user_wallet_deposit_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/subscription/plans': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Subscription Plans */
    readonly get: operations['get_subscription_plans_user_subscription_plans_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/subscription/purchase': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Initiate Subscription Purchase */
    readonly post: operations['initiate_subscription_purchase_user_subscription_purchase_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/subscription/purchase/confirm': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Confirm Subscription Purchase */
    readonly post: operations['confirm_subscription_purchase_user_subscription_purchase_confirm_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-provider': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Ai Provider */
    readonly post: operations['add_ai_provider_admin_ai_provider_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-provider/{uuid}': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Ai Provider */
    readonly get: operations['get_ai_provider_admin_ai_provider__uuid__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-providers': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Ai Providers */
    readonly get: operations['get_ai_providers_admin_ai_providers_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-model': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Ai Model */
    readonly post: operations['add_ai_model_admin_ai_model_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-model/{uuid}': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Ai Model */
    readonly get: operations['get_ai_model_admin_ai_model__uuid__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-model/{uuid}/providers': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
      };
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Provider To Ai Model */
    readonly post: operations['add_provider_to_ai_model_admin_ai_model__uuid__providers_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-models': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Ai Models */
    readonly get: operations['get_ai_models_admin_ai_models_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/currency-exchange-rate/refresh': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Refresh Currency Exchange Rate */
    readonly get: operations['refresh_currency_exchange_rate_admin_currency_exchange_rate_refresh_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/subscription-plan': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Create Subscription Plan */
    readonly post: operations['create_subscription_plan_admin_subscription_plan_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/subscription-plan/{plan_uuid}': {
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
    readonly patch: operations['update_subscription_plan_admin_subscription_plan__plan_uuid__patch'];
    readonly trace?: never;
  };
  readonly '/admin/subscription-plans': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Subscription Plans */
    readonly get: operations['list_subscription_plans_admin_subscription_plans_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/subscription/activate': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Activate User Subscription */
    readonly post: operations['activate_user_subscription_admin_subscription_activate_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/session-history': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * Get Session History
     * @description Get paginated AI chat session history with first user prompt for each session.
     */
    readonly get: operations['get_session_history_ai_session_history_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/session-history/{session_uuid}': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly session_uuid: string;
      };
      readonly cookie?: never;
    };
    /**
     * Get Session Detail
     * @description Get detailed information about a specific AI chat session including all messages.
     */
    readonly get: operations['get_session_detail_ai_session_history__session_uuid__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/models/list': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** List Ai Models */
    readonly get: operations['list_ai_models_ai_models_list_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/models/{uuid}': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
      };
      readonly cookie?: never;
    };
    /** Get Ai Model */
    readonly get: operations['get_ai_model_ai_models__uuid__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/generate/image/generation': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Image Generation */
    readonly post: operations['image_generation_ai_generate_image_generation_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/generate/video/generation': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Video Generation */
    readonly post: operations['video_generation_ai_generate_video_generation_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/ai/generate/video/generation/check-result': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Check Video Generation Result */
    readonly post: operations['check_video_generation_result_ai_generate_video_generation_check_result_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/gateway/irr-exchange-rate': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Irr Exchange Rate */
    readonly get: operations['get_irr_exchange_rate_gateway_irr_exchange_rate_get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/gateway/payment-result': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Payment Result */
    readonly get: operations['get_payment_result_gateway_payment_result_get'];
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
    /** ActivateUserSubscriptionRequest */
    readonly ActivateUserSubscriptionRequest: {
      /** User Uuid */
      readonly user_uuid: string;
      /** Plan Uuid */
      readonly plan_uuid: string;
    };
    /**
     * AiChatRoleEnum
     * @enum {string}
     */
    readonly AiChatRoleEnum: AiChatRoleEnum;
    /** AiChatSessionDetail */
    readonly AiChatSessionDetail: {
      /** Uuid */
      readonly uuid: string;
      readonly task_type: components['schemas']['AiModelSupportedTaskTypeEnum'];
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
      /** Expire Date */
      readonly expire_date: string | null;
      /** User Prompt */
      readonly user_prompt?: string | null;
      /** Messages */
      readonly messages?: readonly components['schemas']['AiChatSessionMessageSummary'][];
    };
    /** AiChatSessionHistoryResponse */
    readonly AiChatSessionHistoryResponse: {
      /** Sessions */
      readonly sessions: readonly components['schemas']['AiChatSessionSummary'][];
      /** Hasnextpage */
      readonly hasNextPage: boolean;
    };
    /** AiChatSessionMessageSummary */
    readonly AiChatSessionMessageSummary: {
      /** Uuid */
      readonly uuid: string;
      readonly role: components['schemas']['AiChatRoleEnum'];
      /** Message */
      readonly message: string | null;
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
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
      /** Ai Model Uuid */
      readonly ai_model_uuid: string | null;
      readonly task_status: components['schemas']['AiModelTaskStatusEnum'] | null;
      /** Cost Usdmicro */
      readonly cost_usdmicro: number | null;
      /**
       * Files
       * @default []
       */
      readonly files: readonly components['schemas']['UploadedFileItem'][] | null;
    };
    /** AiChatSessionSummary */
    readonly AiChatSessionSummary: {
      /** Uuid */
      readonly uuid: string;
      readonly task_type: components['schemas']['AiModelSupportedTaskTypeEnum'];
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
      /** Expire Date */
      readonly expire_date: string | null;
      /** User Prompt */
      readonly user_prompt?: string | null;
    };
    /** AiModelCreate */
    readonly AiModelCreate: {
      /** Providers */
      readonly providers: readonly components['schemas']['AiModelProviderConfig'][];
      readonly name: components['schemas']['AiModelsEnum'];
      /** Display Name */
      readonly display_name?: string | null;
      /** Fa Display Name */
      readonly fa_display_name?: string | null;
      /** Description */
      readonly description?: string | null;
      /** Version */
      readonly version?: string | null;
      /** Icon Url */
      readonly icon_url?: string | null;
      /** Tags */
      readonly tags?: readonly string[] | null;
      /** Supported Inputs */
      readonly supported_inputs?: readonly components['schemas']['AiModelSupportedTaskTypeEnum'][];
      /** Supported Outputs */
      readonly supported_outputs?: readonly components['schemas']['AiModelSupportedTaskTypeEnum'][];
      /** Config Schema */
      readonly config_schema: {
        readonly [key: string]: unknown;
      };
      /** Config Defaults */
      readonly config_defaults?: {
        readonly [key: string]: unknown;
      };
      /** @default ACTIVE */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      readonly model_owner: components['schemas']['AiModelOwnerEnum'];
      /** Pricing By */
      readonly pricing_by: readonly string[];
      /** Pricing Tiers */
      readonly pricing_tiers: readonly {
        readonly [key: string]: unknown;
      }[];
    };
    /** AiModelDetail */
    readonly AiModelDetail: {
      /** Uuid */
      readonly uuid: string;
      /** Model Name */
      readonly model_name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Fa Display Name */
      readonly fa_display_name: string | null;
      /** Description */
      readonly description: string | null;
      /** Version */
      readonly version: string | null;
      /** Icon Url */
      readonly icon_url: string | null;
      /** Tags */
      readonly tags: readonly string[] | null;
      /** Supported Inputs */
      readonly supported_inputs?: readonly components['schemas']['AiModelSupportedTaskTypeEnum'][];
      /** Supported Outputs */
      readonly supported_outputs?: readonly components['schemas']['AiModelSupportedTaskTypeEnum'][];
      /** Config Schema */
      readonly config_schema: {
        readonly [key: string]: unknown;
      };
      /** Config Defaults */
      readonly config_defaults: {
        readonly [key: string]: unknown;
      };
      /** @default ACTIVE */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      readonly model_owner: components['schemas']['AiModelOwnerEnum'];
      /** Pricing By */
      readonly pricing_by: readonly string[];
      /** Pricing Tiers */
      readonly pricing_tiers: readonly {
        readonly [key: string]: unknown;
      }[];
    };
    /**
     * AiModelOwnerEnum
     * @enum {string}
     */
    readonly AiModelOwnerEnum: AiModelOwnerEnum;
    /** AiModelPage */
    readonly AiModelPage: {
      /** Data */
      readonly data: readonly components['schemas']['AiModelSummary'][];
      /** Page */
      readonly page: number;
      /**
       * Page Size
       * @default 10
       */
      readonly page_size: number;
      /** Total Count */
      readonly total_count: number;
    };
    /** AiModelProviderConfig */
    readonly AiModelProviderConfig: {
      /** Provider Uuid */
      readonly provider_uuid: string;
      /** Model Api Url */
      readonly model_api_url?: string | null;
      /** Model Name */
      readonly model_name?: string | null;
    };
    /**
     * AiModelProvidersEnum
     * @enum {string}
     */
    readonly AiModelProvidersEnum: AiModelProvidersEnum;
    /** AiModelSummary */
    readonly AiModelSummary: {
      /** Uuid */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** @default ACTIVE */
      readonly status: components['schemas']['AiStatusEnum'] | null;
    };
    /**
     * AiModelSupportedTaskTypeEnum
     * @enum {string}
     */
    readonly AiModelSupportedTaskTypeEnum: AiModelSupportedTaskTypeEnum;
    /**
     * AiModelTaskStatusEnum
     * @enum {string}
     */
    readonly AiModelTaskStatusEnum: AiModelTaskStatusEnum;
    /**
     * AiModelsEnum
     * @enum {string}
     */
    readonly AiModelsEnum: AiModelsEnum;
    /** AiProviderCreate */
    readonly AiProviderCreate: {
      readonly name: components['schemas']['AiModelProvidersEnum'];
      /** Display Name */
      readonly display_name?: string | null;
      /** Base Api Url */
      readonly base_api_url?: string | null;
      /** Api Key */
      readonly api_key: string;
      /** @default ACTIVE */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      /** Rate Limit Per Min */
      readonly rate_limit_per_min?: number | null;
      /** Docs Url */
      readonly docs_url?: string | null;
      /** Contact Info */
      readonly contact_info?: string | null;
      /** Extra Data */
      readonly extra_data?: {
        readonly [key: string]: unknown;
      } | null;
    };
    /** AiProviderDetail */
    readonly AiProviderDetail: {
      /** Uuid */
      readonly uuid: string;
      readonly name: components['schemas']['AiModelProvidersEnum'];
      /** Display Name */
      readonly display_name: string | null;
      /** Base Api Url */
      readonly base_api_url: string | null;
      readonly status: components['schemas']['AiStatusEnum'];
      /** Rate Limit Per Min */
      readonly rate_limit_per_min: number | null;
      /** Docs Url */
      readonly docs_url: string | null;
      /** Contact Info */
      readonly contact_info: string | null;
      /** Extra Data */
      readonly extra_data: {
        readonly [key: string]: unknown;
      } | null;
    };
    /** AiProviderPage */
    readonly AiProviderPage: {
      /** Data */
      readonly data: readonly components['schemas']['AiProviderSummary'][];
      /** Page */
      readonly page: number;
      /**
       * Page Size
       * @default 10
       */
      readonly page_size: number;
      /** Total Count */
      readonly total_count: number;
    };
    /** AiProviderSummary */
    readonly AiProviderSummary: {
      /** Uuid */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      readonly status: components['schemas']['AiStatusEnum'];
    };
    /**
     * AiStatusEnum
     * @enum {string}
     */
    readonly AiStatusEnum: AiStatusEnum;
    /** Body_image_generation_ai_generate_image_generation_post */
    readonly Body_image_generation_ai_generate_image_generation_post: {
      /**
       * Images Reference
       * @description Multiple binary files
       */
      readonly images_reference?: File[] | null;
      /** Image Mask */
      readonly image_mask?: File | null;
      /** Image Seed */
      readonly image_seed?: File | null;
      /** Prompt */
      readonly prompt: string;
      /** Ai Model Uuid */
      readonly ai_model_uuid: string;
      /** Ai Model Config */
      readonly ai_model_config: string;
    };
    /** Body_video_generation_ai_generate_video_generation_post */
    readonly Body_video_generation_ai_generate_video_generation_post: {
      /**
       * Images Frame
       * @description Multiple binary files
       */
      readonly images_frame?: File[] | null;
      /** Prompt */
      readonly prompt: string;
      /** Ai Model Uuid */
      readonly ai_model_uuid: string;
      /** Ai Model Config */
      readonly ai_model_config: string;
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
      readonly name: components['schemas']['SubscriptionPlansEnum'];
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
    readonly CurrencyUnitEnum: CurrencyUnitEnum;
    /** GenerationResponseBody */
    readonly GenerationResponseBody: {
      /** Ai Model Uuid */
      readonly ai_model_uuid: string;
      /** Wallet Balance Usdmicro */
      readonly wallet_balance_usdmicro: number;
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
      /** Messages */
      readonly messages: readonly components['schemas']['GenerationResponseBodyMessage'][] | null;
      /** Uuid */
      readonly uuid: string;
    };
    /** GenerationResponseBodyMessage */
    readonly GenerationResponseBodyMessage: {
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
      /** Message */
      readonly message: string | null;
      /**
       * Files
       * @default []
       */
      readonly files: readonly components['schemas']['UploadedFileItem'][] | null;
      readonly role: components['schemas']['AiChatRoleEnum'];
      /** Uuid */
      readonly uuid: string;
      readonly task_status: components['schemas']['AiModelTaskStatusEnum'] | null;
    };
    /** GetAdminCurrencyExchangeRateRefreshResponseBody */
    readonly GetAdminCurrencyExchangeRateRefreshResponseBody: {
      readonly from_currency: components['schemas']['CurrencyUnitEnum'];
      readonly to_currency: components['schemas']['CurrencyUnitEnum'];
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
      readonly gateway_provider: components['schemas']['PaymentGateWayProviderEnum'];
      /** Vat Percent */
      readonly vat_percent: number | null;
      /** Vat Amount */
      readonly vat_amount: number | null;
      /** Subtotal Transaction Amount */
      readonly subtotal_transaction_amount: number | null;
      /** Total Transaction Amount */
      readonly total_transaction_amount: number | null;
      readonly transaction_amount_currency: components['schemas']['CurrencyUnitEnum'] | null;
    };
    /** GetPaymentResultResponseBody */
    readonly GetPaymentResultResponseBody: {
      /** Amount Usdmicro */
      readonly amount_usdmicro: number | null;
      readonly gateway_provider: components['schemas']['PaymentGateWayProviderEnum'];
      /** Vat Percent */
      readonly vat_percent: number | null;
      /** Vat Amount */
      readonly vat_amount: number | null;
      /** Subtotal Transaction Amount */
      readonly subtotal_transaction_amount: number | null;
      /** Total Transaction Amount */
      readonly total_transaction_amount: number | null;
      readonly transaction_amount_currency: components['schemas']['CurrencyUnitEnum'] | null;
      /** Balance After */
      readonly balance_after: number | null;
      readonly transaction_status: components['schemas']['PaymentInvoiceStatusEnum'] | null;
    };
    /** HTTPValidationError */
    readonly HTTPValidationError: {
      /** Detail */
      readonly detail?: readonly components['schemas']['ValidationError'][];
    };
    /**
     * PaymentGateWayProviderEnum
     * @enum {string}
     */
    readonly PaymentGateWayProviderEnum: PaymentGateWayProviderEnum;
    /**
     * PaymentInvoiceStatusEnum
     * @enum {string}
     */
    readonly PaymentInvoiceStatusEnum: PaymentInvoiceStatusEnum;
    /** SubscriptionPlanListResponse */
    readonly SubscriptionPlanListResponse: {
      /** Items */
      readonly items: readonly components['schemas']['SubscriptionPlanResponse'][];
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
    readonly SubscriptionPlansEnum: SubscriptionPlansEnum;
    /** SubscriptionPurchaseRequest */
    readonly SubscriptionPurchaseRequest: {
      /** Plan Uuid */
      readonly plan_uuid: string;
      readonly gateway: components['schemas']['PaymentGateWayProviderEnum'];
    };
    /** SubscriptionPurchaseResponse */
    readonly SubscriptionPurchaseResponse: {
      /** Session Id */
      readonly session_id: string;
      /** Gateway Url */
      readonly gateway_url: string;
      /** Amount Usdmicro */
      readonly amount_usdmicro: number;
      readonly gateway_provider: components['schemas']['PaymentGateWayProviderEnum'];
      readonly plan: components['schemas']['SubscriptionPlanResponse'];
    };
    /** UpdateSubscriptionPlanRequest */
    readonly UpdateSubscriptionPlanRequest: {
      readonly name?: components['schemas']['SubscriptionPlansEnum'] | null;
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
    /** UploadedFileItem */
    readonly UploadedFileItem: {
      readonly type: components['schemas']['UploadedFileTypeEnum'];
      /** Url */
      readonly url: string;
    };
    /**
     * UploadedFileTypeEnum
     * @enum {string}
     */
    readonly UploadedFileTypeEnum: UploadedFileTypeEnum;
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
      readonly default_wallet: components['schemas']['UserGetInfoResponseDefaultWallet'] | null;
      readonly active_subscription: components['schemas']['UserSubscriptionResponse'] | null;
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
      readonly wallet_type: components['schemas']['WalletTypeEnum'];
      /** Is Active */
      readonly is_active: boolean;
      /** Is Locked */
      readonly is_locked: boolean;
      /** Extra Metadata */
      readonly extra_metadata: {
        readonly [key: string]: unknown;
      } | null;
      readonly user_role: components['schemas']['WalletMemberRoleEnum'];
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
      readonly default_wallet: components['schemas']['UserGetInfoResponseDefaultWallet'] | null;
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
      readonly plan: components['schemas']['SubscriptionPlanResponse'];
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
    };
    /** WalletDepositRequestBody */
    readonly WalletDepositRequestBody: {
      /** Amount Usdmicro */
      readonly amount_usdmicro: number;
      readonly gateway: components['schemas']['PaymentGateWayProviderEnum'];
    };
    /** WalletDepositResponseBody */
    readonly WalletDepositResponseBody: {
      /** Session Id */
      readonly session_id: string;
      /** Gateway Url */
      readonly gateway_url: string;
      readonly gateway_provider: components['schemas']['PaymentGateWayProviderEnum'];
    };
    /**
     * WalletMemberRoleEnum
     * @enum {string}
     */
    readonly WalletMemberRoleEnum: WalletMemberRoleEnum;
    /**
     * WalletTypeEnum
     * @enum {string}
     */
    readonly WalletTypeEnum: WalletTypeEnum;
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type SchemaActivateUserSubscriptionRequest =
  components['schemas']['ActivateUserSubscriptionRequest'];
export type SchemaAiChatSessionDetail = components['schemas']['AiChatSessionDetail'];
export type SchemaAiChatSessionHistoryResponse =
  components['schemas']['AiChatSessionHistoryResponse'];
export type SchemaAiChatSessionMessageSummary =
  components['schemas']['AiChatSessionMessageSummary'];
export type SchemaAiChatSessionSummary = components['schemas']['AiChatSessionSummary'];
export type SchemaAiModelCreate = components['schemas']['AiModelCreate'];
export type SchemaAiModelDetail = components['schemas']['AiModelDetail'];
export type SchemaAiModelPage = components['schemas']['AiModelPage'];
export type SchemaAiModelProviderConfig = components['schemas']['AiModelProviderConfig'];
export type SchemaAiModelSummary = components['schemas']['AiModelSummary'];
export type SchemaAiProviderCreate = components['schemas']['AiProviderCreate'];
export type SchemaAiProviderDetail = components['schemas']['AiProviderDetail'];
export type SchemaAiProviderPage = components['schemas']['AiProviderPage'];
export type SchemaAiProviderSummary = components['schemas']['AiProviderSummary'];
export type SchemaBodyImageGenerationAiGenerateImageGenerationPost =
  components['schemas']['Body_image_generation_ai_generate_image_generation_post'];
export type SchemaBodyVideoGenerationAiGenerateVideoGenerationPost =
  components['schemas']['Body_video_generation_ai_generate_video_generation_post'];
export type SchemaCompleteSubscriptionPurchaseRequest =
  components['schemas']['CompleteSubscriptionPurchaseRequest'];
export type SchemaCreateSubscriptionPlanRequest =
  components['schemas']['CreateSubscriptionPlanRequest'];
export type SchemaGenerationResponseBody = components['schemas']['GenerationResponseBody'];
export type SchemaGenerationResponseBodyMessage =
  components['schemas']['GenerationResponseBodyMessage'];
export type SchemaGetAdminCurrencyExchangeRateRefreshResponseBody =
  components['schemas']['GetAdminCurrencyExchangeRateRefreshResponseBody'];
export type SchemaGetIrrExchangeRateResponseBody =
  components['schemas']['GetIrrExchangeRateResponseBody'];
export type SchemaGetPaymentResultResponseBody =
  components['schemas']['GetPaymentResultResponseBody'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaSubscriptionPlanListResponse =
  components['schemas']['SubscriptionPlanListResponse'];
export type SchemaSubscriptionPlanResponse = components['schemas']['SubscriptionPlanResponse'];
export type SchemaSubscriptionPurchaseRequest =
  components['schemas']['SubscriptionPurchaseRequest'];
export type SchemaSubscriptionPurchaseResponse =
  components['schemas']['SubscriptionPurchaseResponse'];
export type SchemaUpdateSubscriptionPlanRequest =
  components['schemas']['UpdateSubscriptionPlanRequest'];
export type SchemaUploadedFileItem = components['schemas']['UploadedFileItem'];
export type SchemaUserGetInfoResponse = components['schemas']['UserGetInfoResponse'];
export type SchemaUserGetInfoResponseDefaultWallet =
  components['schemas']['UserGetInfoResponseDefaultWallet'];
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
        readonly 'application/json': components['schemas']['UserStartBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserStartResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['UserLoginBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserLoginResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['UserResetPasswordBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserResetPasswordResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['UserResendOtpResponse'];
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
        readonly 'application/json': components['schemas']['UserSetPasswordBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserLoginResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['UserGetInfoResponse'];
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
        readonly 'application/json': components['schemas']['UserPatchEditInfoRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserPatchEditInfoResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['WalletDepositRequestBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['WalletDepositResponseBody'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['SubscriptionPlanListResponse'];
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
        readonly 'application/json': components['schemas']['SubscriptionPurchaseRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['SubscriptionPurchaseResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['CompleteSubscriptionPurchaseRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserSubscriptionResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly add_ai_provider_admin_ai_provider_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['AiProviderCreate'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['AiProviderDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_ai_provider_admin_ai_provider__uuid__get: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
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
          readonly 'application/json': components['schemas']['AiProviderDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_ai_providers_admin_ai_providers_get: {
    readonly parameters: {
      readonly query?: {
        readonly page?: number;
        readonly page_size?: number;
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
          readonly 'application/json': components['schemas']['AiProviderPage'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly add_ai_model_admin_ai_model_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['AiModelCreate'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['AiModelDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_ai_model_admin_ai_model__uuid__get: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
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
          readonly 'application/json': components['schemas']['AiModelDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly add_provider_to_ai_model_admin_ai_model__uuid__providers_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
      };
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['AiModelProviderConfig'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['AiModelDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_ai_models_admin_ai_models_get: {
    readonly parameters: {
      readonly query?: {
        readonly page?: number;
        readonly page_size?: number;
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
          readonly 'application/json': components['schemas']['AiModelPage'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['GetAdminCurrencyExchangeRateRefreshResponseBody'];
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
        readonly 'application/json': components['schemas']['CreateSubscriptionPlanRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['SubscriptionPlanResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['UpdateSubscriptionPlanRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['SubscriptionPlanResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['SubscriptionPlanListResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
        readonly 'application/json': components['schemas']['ActivateUserSubscriptionRequest'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['UserSubscriptionResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_session_history_ai_session_history_get: {
    readonly parameters: {
      readonly query?: {
        /** @description Task type filter (optional) */
        readonly task_type?: components['schemas']['AiModelSupportedTaskTypeEnum'] | null;
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
          readonly 'application/json': components['schemas']['AiChatSessionHistoryResponse'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_session_detail_ai_session_history__session_uuid__get: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly session_uuid: string;
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
          readonly 'application/json': components['schemas']['AiChatSessionDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly list_ai_models_ai_models_list_get: {
    readonly parameters: {
      readonly query?: {
        readonly page?: number;
        readonly page_size?: number;
        /** @description Filter models by supported output task types */
        readonly supported_outputs?:
          | readonly components['schemas']['AiModelSupportedTaskTypeEnum'][]
          | null;
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
          readonly 'application/json': components['schemas']['AiModelPage'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_ai_model_ai_models__uuid__get: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly uuid: string;
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
          readonly 'application/json': components['schemas']['AiModelDetail'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly image_generation_ai_generate_image_generation_post: {
    readonly parameters: {
      readonly query?: {
        /** @description Chat ID */
        readonly chat_id?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_image_generation_ai_generate_image_generation_post'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['GenerationResponseBody'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly video_generation_ai_generate_video_generation_post: {
    readonly parameters: {
      readonly query?: {
        /** @description Chat ID */
        readonly chat_id?: string | null;
      };
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_video_generation_ai_generate_video_generation_post'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['GenerationResponseBody'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly check_video_generation_result_ai_generate_video_generation_check_result_post: {
    readonly parameters: {
      readonly query: {
        readonly chat_message_uuid: string;
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
          readonly 'application/json': components['schemas']['GenerationResponseBodyMessage'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
  readonly get_irr_exchange_rate_gateway_irr_exchange_rate_get: {
    readonly parameters: {
      readonly query: {
        readonly amount_usdmicro: number;
        readonly provider: components['schemas']['PaymentGateWayProviderEnum'];
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
          readonly 'application/json': components['schemas']['GetIrrExchangeRateResponseBody'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
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
          readonly 'application/json': components['schemas']['GetPaymentResultResponseBody'];
        };
      };
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError'];
        };
      };
    };
  };
}
export enum AiChatRoleEnum {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  TOOL = 'TOOL',
  FUNCTION = 'FUNCTION',
  INLINE = 'INLINE',
}
export enum AiModelOwnerEnum {
  OPEN_AI = 'OPEN_AI',
  GOOGLE = 'GOOGLE',
}
export enum AiModelProvidersEnum {
  RUNWARE = 'RUNWARE',
  AIMLAPI = 'AIMLAPI',
}
export enum AiModelSupportedTaskTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}
export enum AiModelTaskStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
export enum AiModelsEnum {
  OPENAI_GPT_IMAGE_1 = 'OPENAI_GPT_IMAGE_1',
  GOOGLE_GEMINI_2_5_FLASH_IMAGE = 'GOOGLE_GEMINI_2_5_FLASH_IMAGE',
  GOOGLE_VEO_3_POINT_1_FAST = 'GOOGLE_VEO_3_POINT_1_FAST',
}
export enum AiStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}
export enum CurrencyUnitEnum {
  USD = 'USD',
  IRR = 'IRR',
  USDMICRO = 'USDMICRO',
}
export enum PaymentGateWayProviderEnum {
  PAYPING_IRR = 'PAYPING_IRR',
}
export enum PaymentInvoiceStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export enum SubscriptionPlansEnum {
  ECONOMIC = 'ECONOMIC',
  BASIC = 'BASIC',
  PRO = 'PRO',
}
export enum UploadedFileTypeEnum {
  IMAGE_REFERENCE = 'IMAGE_REFERENCE',
  IMAGE_MASK = 'IMAGE_MASK',
  IMAGE_SEED = 'IMAGE_SEED',
  IMAGE_GENERATED = 'IMAGE_GENERATED',
  VIDEO_GENERATED = 'VIDEO_GENERATED',
  AUDIO_REFERENCE = 'AUDIO_REFERENCE',
  DOCUMENT_REFERENCE = 'DOCUMENT_REFERENCE',
  OTHER = 'OTHER',
}
export enum WalletMemberRoleEnum {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}
export enum WalletTypeEnum {
  PERSONAL = 'PERSONAL',
  GROUP = 'GROUP',
}
export enum ApiPaths {
  start_user_start_post = '/user/start',
  login_user_login_post = '/user/login',
  reset_password_user_reset_password_post = '/user/reset-password',
  resend_otp_user_resend_otp_post = '/user/resend-otp',
  set_password_user_set_password_post = '/user/set-password',
  get_info_user_get_info_get = '/user/get-info',
  edit_user_info_user_edit_info_patch = '/user/edit-info',
  initiate_wallet_deposit_user_wallet_deposit_post = '/user/wallet/deposit',
  get_subscription_plans_user_subscription_plans_get = '/user/subscription/plans',
  initiate_subscription_purchase_user_subscription_purchase_post = '/user/subscription/purchase',
  confirm_subscription_purchase_user_subscription_purchase_confirm_post = '/user/subscription/purchase/confirm',
  add_ai_provider_admin_ai_provider_post = '/admin/ai-provider',
  get_ai_provider_admin_ai_provider__uuid__get = '/admin/ai-provider/{uuid}',
  get_ai_providers_admin_ai_providers_get = '/admin/ai-providers',
  add_ai_model_admin_ai_model_post = '/admin/ai-model',
  get_ai_model_admin_ai_model__uuid__get = '/admin/ai-model/{uuid}',
  add_provider_to_ai_model_admin_ai_model__uuid__providers_post = '/admin/ai-model/{uuid}/providers',
  get_ai_models_admin_ai_models_get = '/admin/ai-models',
  refresh_currency_exchange_rate_admin_currency_exchange_rate_refresh_get = '/admin/currency-exchange-rate/refresh',
  create_subscription_plan_admin_subscription_plan_post = '/admin/subscription-plan',
  update_subscription_plan_admin_subscription_plan__plan_uuid__patch = '/admin/subscription-plan/{plan_uuid}',
  list_subscription_plans_admin_subscription_plans_get = '/admin/subscription-plans',
  activate_user_subscription_admin_subscription_activate_post = '/admin/subscription/activate',
  get_session_history_ai_session_history_get = '/ai/session-history',
  get_session_detail_ai_session_history__session_uuid__get = '/ai/session-history/{session_uuid}',
  list_ai_models_ai_models_list_get = '/ai/models/list',
  get_ai_model_ai_models__uuid__get = '/ai/models/{uuid}',
  image_generation_ai_generate_image_generation_post = '/ai/generate/image/generation',
  video_generation_ai_generate_video_generation_post = '/ai/generate/video/generation',
  check_video_generation_result_ai_generate_video_generation_check_result_post = '/ai/generate/video/generation/check-result',
  get_irr_exchange_rate_gateway_irr_exchange_rate_get = '/gateway/irr-exchange-rate',
  get_payment_result_gateway_payment_result_get = '/gateway/payment-result',
}
