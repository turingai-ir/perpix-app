export interface paths {
  readonly '/user/start/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Start */
    readonly post: operations['start_user_start__post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/login/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Login */
    readonly post: operations['login_user_login__post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/reset-password/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Reset Password */
    readonly post: operations['reset_password_user_reset_password__post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/user/set-password/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Set Password */
    readonly post: operations['set_password_user_set_password__post'];
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
  readonly '/admin/ai-provider/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Ai Router */
    readonly post: operations['add_ai_router_admin_ai_provider__post'];
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
  readonly '/admin/ai-providers/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Ai Providers */
    readonly get: operations['get_ai_providers_admin_ai_providers__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/ai-model/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Add Ai Model */
    readonly post: operations['add_ai_model_admin_ai_model__post'];
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
  readonly '/admin/ai-models/': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    /** Get Ai Models */
    readonly get: operations['get_ai_models_admin_ai_models__get'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/update-wallet-balance': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Update Wallet Balance */
    readonly post: operations['update_wallet_balance_admin_update_wallet_balance_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/admin/upload-to-statics': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Upload To Statics */
    readonly post: operations['upload_to_statics_admin_upload_to_statics_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/models/open-ai/images/generations': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Images Generation */
    readonly post: operations['images_generation_models_open_ai_images_generations_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/models/open-ai/images/edits': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Images Edits */
    readonly post: operations['images_edits_models_open_ai_images_edits_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/models/google/video/generations': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly get?: never;
    readonly put?: never;
    /** Video Generation */
    readonly post: operations['video_generation_models_google_video_generations_post'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/models/google/video/generations/result/{id}': {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly id: string;
      };
      readonly cookie?: never;
    };
    /** Video Generation Result */
    readonly get: operations['video_generation_result_models_google_video_generations_result__id__get'];
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
    /**
     * AiChatRole
     * @enum {integer}
     */
    readonly AiChatRole: AiChatRole;
    /**
     * AiModelGenerationTypeEnum
     * @enum {string}
     */
    readonly AiModelGenerationTypeEnum: AiModelGenerationTypeEnum;
    /** AiModelInList */
    readonly AiModelInList: {
      /** Uuid */
      readonly uuid: string;
      /** Model Name */
      readonly model_name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** @default 0 */
      readonly status: components['schemas']['AiStatusEnum'] | null;
    };
    /**
     * AiModelOwnerEnum
     * @enum {integer}
     */
    readonly AiModelOwnerEnum: AiModelOwnerEnum;
    /**
     * AiModelSupportedTypeEnum
     * @enum {integer}
     */
    readonly AiModelSupportedTypeEnum: AiModelSupportedTypeEnum;
    /** AiProviderInList */
    readonly AiProviderInList: {
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
     * @enum {integer}
     */
    readonly AiStatusEnum: AiStatusEnum;
    /**
     * AiVideoGenerationStatus
     * @enum {integer}
     */
    readonly AiVideoGenerationStatus: AiVideoGenerationStatus;
    /** Body_images_edits_models_open_ai_images_edits_post */
    readonly Body_images_edits_models_open_ai_images_edits_post: {
      /** Image */
      readonly image: readonly string[];
      /** Mask */
      readonly mask?: string | null;
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Ai Model Config */
      readonly ai_model_config: string;
    };
    /** Body_upload_to_statics_admin_upload_to_statics_post */
    readonly Body_upload_to_statics_admin_upload_to_statics_post: {
      /**
       * File
       * Format: binary
       */
      readonly file: string;
    };
    /** Body_video_generation_models_google_video_generations_post */
    readonly Body_video_generation_models_google_video_generations_post: {
      /** Reference Images */
      readonly reference_images?: readonly string[] | null;
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Ai Model Config */
      readonly ai_model_config: string;
    };
    /** GetAdminAddProviderResponseBody */
    readonly GetAdminAddProviderResponseBody: {
      /** Uuid */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Api Url */
      readonly api_url: string | null;
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
    /** GetAdminAddProvidersResponseBody */
    readonly GetAdminAddProvidersResponseBody: {
      /** Data */
      readonly data: readonly components['schemas']['AiProviderInList'][];
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
    /** GetAdminAiModelResponseBody */
    readonly GetAdminAiModelResponseBody: {
      /** Uuid */
      readonly uuid: string;
      /** Provider Id */
      readonly provider_id: number;
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
      /** Priority */
      readonly priority: number | null;
      /** Supported Inputs */
      readonly supported_inputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Supported Outputs */
      readonly supported_outputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Config Schema */
      readonly config_schema: {
        readonly [key: string]: unknown;
      };
      /** Config Defaults */
      readonly config_defaults: {
        readonly [key: string]: unknown;
      };
      /** @default 0 */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      readonly model_owner: components['schemas']['AiModelOwnerEnum'];
      /** Model Api Urls */
      readonly model_api_urls: {
        readonly [key: string]: string;
      };
      /** Pricing By */
      readonly pricing_by: readonly string[];
      /** Pricing Tiers */
      readonly pricing_tiers: readonly {
        readonly [key: string]: unknown;
      }[];
    };
    /** GetAdminAiModelsResponseBody */
    readonly GetAdminAiModelsResponseBody: {
      /** Data */
      readonly data: readonly components['schemas']['AiModelInList'][];
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
    /** HTTPValidationError */
    readonly HTTPValidationError: {
      /** Detail */
      readonly detail?: readonly components['schemas']['ValidationError'][];
    };
    /** PostAdminAddAiModelRequestBody */
    readonly PostAdminAddAiModelRequestBody: {
      /** Provider Uuid */
      readonly provider_uuid: string;
      /** Model Name */
      readonly model_name: string;
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
      /** Priority */
      readonly priority?: number | null;
      /** Supported Inputs */
      readonly supported_inputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Supported Outputs */
      readonly supported_outputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Config Schema */
      readonly config_schema: {
        readonly [key: string]: unknown;
      };
      /**
       * Config Defaults
       * @default {}
       */
      readonly config_defaults: {
        readonly [key: string]: unknown;
      } | null;
      /** @default 0 */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      readonly model_owner: components['schemas']['AiModelOwnerEnum'];
      /** Model Api Urls */
      readonly model_api_urls: {
        readonly [key: string]: string;
      };
      /** Pricing By */
      readonly pricing_by: readonly string[];
      /** Pricing Tiers */
      readonly pricing_tiers: readonly {
        readonly [key: string]: unknown;
      }[];
    };
    /** PostAdminAddAiModelResponseBody */
    readonly PostAdminAddAiModelResponseBody: {
      /** Uuid */
      readonly uuid: string;
      /** Provider Id */
      readonly provider_id: number;
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
      /** Priority */
      readonly priority: number | null;
      /** Supported Inputs */
      readonly supported_inputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Supported Outputs */
      readonly supported_outputs: readonly components['schemas']['AiModelSupportedTypeEnum'][];
      /** Config Schema */
      readonly config_schema: {
        readonly [key: string]: unknown;
      };
      /** Config Defaults */
      readonly config_defaults: {
        readonly [key: string]: unknown;
      };
      /** @default 0 */
      readonly status: components['schemas']['AiStatusEnum'] | null;
      readonly model_owner: components['schemas']['AiModelOwnerEnum'];
      /** Model Api Urls */
      readonly model_api_urls: {
        readonly [key: string]: string;
      };
      /** Pricing By */
      readonly pricing_by: readonly string[];
      /** Pricing Tiers */
      readonly pricing_tiers: readonly {
        readonly [key: string]: unknown;
      }[];
    };
    /** PostAdminAddProviderRequestBody */
    readonly PostAdminAddProviderRequestBody: {
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name?: string | null;
      /** Api Url */
      readonly api_url?: string | null;
      /** Api Key */
      readonly api_key: string;
      /** @default 0 */
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
    /** PostAdminAddProviderResponseBody */
    readonly PostAdminAddProviderResponseBody: {
      /** Uuid */
      readonly uuid: string;
      /** Name */
      readonly name: string;
      /** Display Name */
      readonly display_name: string | null;
      /** Api Url */
      readonly api_url: string | null;
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
    /** PostAdminUpdateWalletBalanceRequestBody */
    readonly PostAdminUpdateWalletBalanceRequestBody: {
      /** Wallet Uuid */
      readonly wallet_uuid: string;
      /** User Id */
      readonly user_id: string;
      /** Amount */
      readonly amount: number;
    };
    /** PostAdminUpdateWalletBalanceResponseBody */
    readonly PostAdminUpdateWalletBalanceResponseBody: {
      /** Old Balance Usdmicro */
      readonly old_balance_usdmicro: number;
      /** Balance Usdmicro */
      readonly balance_usdmicro: number;
      /** Wallet Uuid */
      readonly wallet_uuid: string;
    };
    /** PostAdminUploadResponseBody */
    readonly PostAdminUploadResponseBody: {
      /** Url */
      readonly url: string;
    };
    /** PostModlesGoogleVideosGenerationsResponseBody */
    readonly PostModlesGoogleVideosGenerationsResponseBody: {
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Wallet Blanace Usdmicro */
      readonly wallet_blanace_usdmicro: number;
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
      /** Messages */
      readonly messages:
        | readonly components['schemas']['PostModlesGoogleVideosGenerationsResponseBodyMessage'][]
        | null;
      /** Id */
      readonly id: string;
    };
    /** PostModlesGoogleVideosGenerationsResponseBodyMessage */
    readonly PostModlesGoogleVideosGenerationsResponseBodyMessage: {
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
      /** Files Url */
      readonly files_url:
        | readonly {
            readonly [key: string]: string;
          }[]
        | null;
      readonly video_generation_status: components['schemas']['AiVideoGenerationStatus'] | null;
      readonly role: components['schemas']['AiChatRole'];
      /** Id */
      readonly id: string;
    };
    /** PostModlesGoogleVideosGenerationsResultResponseBody */
    readonly PostModlesGoogleVideosGenerationsResultResponseBody: {
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
      /** Files Url */
      readonly files_url:
        | readonly {
            readonly [key: string]: string;
          }[]
        | null;
      readonly video_generation_status: components['schemas']['AiVideoGenerationStatus'] | null;
      readonly role: components['schemas']['AiChatRole'];
      /** Id */
      readonly id: string;
    };
    /** PostModlesOpenAiImagesEditsResponseBody */
    readonly PostModlesOpenAiImagesEditsResponseBody: {
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Wallet Blanace Usdmicro */
      readonly wallet_blanace_usdmicro: number;
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
      /** Messages */
      readonly messages:
        | readonly components['schemas']['PostModlesOpenAiImagesEditsResponseBodyMessage'][]
        | null;
      /** Id */
      readonly id: string;
    };
    /** PostModlesOpenAiImagesEditsResponseBodyMessage */
    readonly PostModlesOpenAiImagesEditsResponseBodyMessage: {
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
      /** Files Url */
      readonly files_url:
        | readonly {
            readonly [key: string]: string;
          }[]
        | null;
      readonly role: components['schemas']['AiChatRole'];
      /** Id */
      readonly id: string;
    };
    /** PostModlesOpenAiImagesGenerationsRequestBody */
    readonly PostModlesOpenAiImagesGenerationsRequestBody: {
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
    };
    /** PostModlesOpenAiImagesGenerationsResponseBody */
    readonly PostModlesOpenAiImagesGenerationsResponseBody: {
      /** Ai Model Id */
      readonly ai_model_id: string;
      /** Wallet Blanace Usdmicro */
      readonly wallet_blanace_usdmicro: number;
      /** Ai Model Config */
      readonly ai_model_config: {
        readonly [key: string]: unknown;
      };
      /** Messages */
      readonly messages:
        | readonly components['schemas']['PostModlesOpenAiImagesGenerationsResponseBodyMessage'][]
        | null;
      /** Id */
      readonly id: string;
    };
    /** PostModlesOpenAiImagesGenerationsResponseBodyMessage */
    readonly PostModlesOpenAiImagesGenerationsResponseBodyMessage: {
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
      /** Files Url */
      readonly files_url:
        | readonly {
            readonly [key: string]: string;
          }[]
        | null;
      readonly role: components['schemas']['AiChatRole'];
      /** Id */
      readonly id: string;
    };
    /**
     * UploadedFileTypeEnum
     * @enum {string}
     */
    readonly UploadedFileTypeEnum: UploadedFileTypeEnum;
    /** UserGetInfoReponseDefaultWallet */
    readonly UserGetInfoReponseDefaultWallet: {
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
      readonly wallet_type: components['schemas']['WalletType'];
      /** Is Active */
      readonly is_active: boolean;
      /** Is Locked */
      readonly is_locked: boolean;
      /** Extra Metadata */
      readonly extra_metadata: {
        readonly [key: string]: unknown;
      } | null;
      readonly user_role: components['schemas']['WalletMemberRole'];
    };
    /** UserGetInfoResponse */
    readonly UserGetInfoResponse: {
      /** User Id */
      readonly user_id: string;
      /** Email */
      readonly email: string | null;
      /** Name */
      readonly name: string | null;
      /** Phone Number */
      readonly phone_number: string | null;
      /** Scopes */
      readonly scopes: readonly string[] | null;
      readonly default_wallet: components['schemas']['UserGetInfoReponseDefaultWallet'] | null;
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
      /** User Id */
      readonly user_id: string;
    };
    /** UserPatchEditInfoRequest */
    readonly UserPatchEditInfoRequest: {
      /** Email */
      readonly email: string | null;
      /** Name */
      readonly name: string | null;
    };
    /** UserPatchEditInfoResponse */
    readonly UserPatchEditInfoResponse: {
      /** User Id */
      readonly user_id: string;
      /** Email */
      readonly email: string | null;
      /** Name */
      readonly name: string | null;
      /** Phone Number */
      readonly phone_number: string | null;
      /** Scopes */
      readonly scopes: readonly string[] | null;
      readonly default_wallet: components['schemas']['UserGetInfoReponseDefaultWallet'] | null;
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
    /** ValidationError */
    readonly ValidationError: {
      /** Location */
      readonly loc: readonly (string | number)[];
      /** Message */
      readonly msg: string;
      /** Error Type */
      readonly type: string;
    };
    /**
     * WalletMemberRole
     * @enum {integer}
     */
    readonly WalletMemberRole: WalletMemberRole;
    /**
     * WalletType
     * @enum {integer}
     */
    readonly WalletType: WalletType;
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type SchemaAiModelInList = components['schemas']['AiModelInList'];
export type SchemaAiProviderInList = components['schemas']['AiProviderInList'];
export type SchemaBodyImagesEditsModelsOpenAiImagesEditsPost =
  components['schemas']['Body_images_edits_models_open_ai_images_edits_post'];
export type SchemaBodyUploadToStaticsAdminUploadToStaticsPost =
  components['schemas']['Body_upload_to_statics_admin_upload_to_statics_post'];
export type SchemaBodyVideoGenerationModelsGoogleVideoGenerationsPost =
  components['schemas']['Body_video_generation_models_google_video_generations_post'];
export type SchemaGetAdminAddProviderResponseBody =
  components['schemas']['GetAdminAddProviderResponseBody'];
export type SchemaGetAdminAddProvidersResponseBody =
  components['schemas']['GetAdminAddProvidersResponseBody'];
export type SchemaGetAdminAiModelResponseBody =
  components['schemas']['GetAdminAiModelResponseBody'];
export type SchemaGetAdminAiModelsResponseBody =
  components['schemas']['GetAdminAiModelsResponseBody'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaPostAdminAddAiModelRequestBody =
  components['schemas']['PostAdminAddAiModelRequestBody'];
export type SchemaPostAdminAddAiModelResponseBody =
  components['schemas']['PostAdminAddAiModelResponseBody'];
export type SchemaPostAdminAddProviderRequestBody =
  components['schemas']['PostAdminAddProviderRequestBody'];
export type SchemaPostAdminAddProviderResponseBody =
  components['schemas']['PostAdminAddProviderResponseBody'];
export type SchemaPostAdminUpdateWalletBalanceRequestBody =
  components['schemas']['PostAdminUpdateWalletBalanceRequestBody'];
export type SchemaPostAdminUpdateWalletBalanceResponseBody =
  components['schemas']['PostAdminUpdateWalletBalanceResponseBody'];
export type SchemaPostAdminUploadResponseBody =
  components['schemas']['PostAdminUploadResponseBody'];
export type SchemaPostModlesGoogleVideosGenerationsResponseBody =
  components['schemas']['PostModlesGoogleVideosGenerationsResponseBody'];
export type SchemaPostModlesGoogleVideosGenerationsResponseBodyMessage =
  components['schemas']['PostModlesGoogleVideosGenerationsResponseBodyMessage'];
export type SchemaPostModlesGoogleVideosGenerationsResultResponseBody =
  components['schemas']['PostModlesGoogleVideosGenerationsResultResponseBody'];
export type SchemaPostModlesOpenAiImagesEditsResponseBody =
  components['schemas']['PostModlesOpenAiImagesEditsResponseBody'];
export type SchemaPostModlesOpenAiImagesEditsResponseBodyMessage =
  components['schemas']['PostModlesOpenAiImagesEditsResponseBodyMessage'];
export type SchemaPostModlesOpenAiImagesGenerationsRequestBody =
  components['schemas']['PostModlesOpenAiImagesGenerationsRequestBody'];
export type SchemaPostModlesOpenAiImagesGenerationsResponseBody =
  components['schemas']['PostModlesOpenAiImagesGenerationsResponseBody'];
export type SchemaPostModlesOpenAiImagesGenerationsResponseBodyMessage =
  components['schemas']['PostModlesOpenAiImagesGenerationsResponseBodyMessage'];
export type SchemaUserGetInfoReponseDefaultWallet =
  components['schemas']['UserGetInfoReponseDefaultWallet'];
export type SchemaUserGetInfoResponse = components['schemas']['UserGetInfoResponse'];
export type SchemaUserLoginBody = components['schemas']['UserLoginBody'];
export type SchemaUserLoginResponse = components['schemas']['UserLoginResponse'];
export type SchemaUserPatchEditInfoRequest = components['schemas']['UserPatchEditInfoRequest'];
export type SchemaUserPatchEditInfoResponse = components['schemas']['UserPatchEditInfoResponse'];
export type SchemaUserResetPasswordBody = components['schemas']['UserResetPasswordBody'];
export type SchemaUserResetPasswordResponse = components['schemas']['UserResetPasswordResponse'];
export type SchemaUserSetPasswordBody = components['schemas']['UserSetPasswordBody'];
export type SchemaUserStartBody = components['schemas']['UserStartBody'];
export type SchemaUserStartResponse = components['schemas']['UserStartResponse'];
export type SchemaValidationError = components['schemas']['ValidationError'];
export type $defs = Record<string, never>;
export interface operations {
  readonly start_user_start__post: {
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
  readonly login_user_login__post: {
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
  readonly reset_password_user_reset_password__post: {
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
  readonly set_password_user_set_password__post: {
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
  readonly add_ai_router_admin_ai_provider__post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['PostAdminAddProviderRequestBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostAdminAddProviderResponseBody'];
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
          readonly 'application/json': components['schemas']['GetAdminAddProviderResponseBody'];
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
  readonly get_ai_providers_admin_ai_providers__get: {
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
          readonly 'application/json': components['schemas']['GetAdminAddProvidersResponseBody'];
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
  readonly add_ai_model_admin_ai_model__post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['PostAdminAddAiModelRequestBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostAdminAddAiModelResponseBody'];
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
          readonly 'application/json': components['schemas']['GetAdminAiModelResponseBody'];
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
  readonly get_ai_models_admin_ai_models__get: {
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
          readonly 'application/json': components['schemas']['GetAdminAiModelsResponseBody'];
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
  readonly update_wallet_balance_admin_update_wallet_balance_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['PostAdminUpdateWalletBalanceRequestBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostAdminUpdateWalletBalanceResponseBody'];
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
  readonly upload_to_statics_admin_upload_to_statics_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_upload_to_statics_admin_upload_to_statics_post'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostAdminUploadResponseBody'];
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
  readonly images_generation_models_open_ai_images_generations_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['PostModlesOpenAiImagesGenerationsRequestBody'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostModlesOpenAiImagesGenerationsResponseBody'];
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
  readonly images_edits_models_open_ai_images_edits_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_images_edits_models_open_ai_images_edits_post'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostModlesOpenAiImagesEditsResponseBody'];
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
  readonly video_generation_models_google_video_generations_post: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_video_generation_models_google_video_generations_post'];
      };
    };
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown;
        };
        content: {
          readonly 'application/json': components['schemas']['PostModlesGoogleVideosGenerationsResponseBody'];
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
  readonly video_generation_result_models_google_video_generations_result__id__get: {
    readonly parameters: {
      readonly query?: never;
      readonly header?: never;
      readonly path: {
        readonly id: string;
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
          readonly 'application/json': components['schemas']['PostModlesGoogleVideosGenerationsResultResponseBody'];
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
export enum AiChatRole {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
}
export enum AiModelGenerationTypeEnum {
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  IMAGE_TO_IMAGE = 'IMAGE_TO_IMAGE',
  TEXT_TO_VIDEO = 'TEXT_TO_VIDEO',
  IMAGE_TO_VIDEO = 'IMAGE_TO_VIDEO',
}
export enum AiModelOwnerEnum {
  Value0 = 0,
  Value1 = 1,
}
export enum AiModelSupportedTypeEnum {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}
export enum AiStatusEnum {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}
export enum AiVideoGenerationStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}
export enum UploadedFileTypeEnum {
  IMAGE_REFRENCE = 'IMAGE_REFRENCE',
  IMAGE_MASK = 'IMAGE_MASK',
  IMAGE_GENERATED = 'IMAGE_GENERATED',
  VIDEO_GENERATED = 'VIDEO_GENERATED',
  AUDIO_REFRENCE = 'AUDIO_REFRENCE',
  DOCUMENT_REFRENCE = 'DOCUMENT_REFRENCE',
  OTHER = 'OTHER',
}
export enum WalletMemberRole {
  Value0 = 0,
  Value1 = 1,
}
export enum WalletType {
  Value0 = 0,
  Value1 = 1,
}
export enum ApiPaths {
  start_user_start__post = '/user/start/',
  login_user_login__post = '/user/login/',
  reset_password_user_reset_password__post = '/user/reset-password/',
  set_password_user_set_password__post = '/user/set-password/',
  get_info_user_get_info_get = '/user/get-info',
  edit_user_info_user_edit_info_patch = '/user/edit-info',
  add_ai_router_admin_ai_provider__post = '/admin/ai-provider/',
  get_ai_provider_admin_ai_provider__uuid__get = '/admin/ai-provider/{uuid}',
  get_ai_providers_admin_ai_providers__get = '/admin/ai-providers/',
  add_ai_model_admin_ai_model__post = '/admin/ai-model/',
  get_ai_model_admin_ai_model__uuid__get = '/admin/ai-model/{uuid}',
  get_ai_models_admin_ai_models__get = '/admin/ai-models/',
  update_wallet_balance_admin_update_wallet_balance_post = '/admin/update-wallet-balance',
  upload_to_statics_admin_upload_to_statics_post = '/admin/upload-to-statics',
  images_generation_models_open_ai_images_generations_post = '/models/open-ai/images/generations',
  images_edits_models_open_ai_images_edits_post = '/models/open-ai/images/edits',
  video_generation_models_google_video_generations_post = '/models/google/video/generations',
  video_generation_result_models_google_video_generations_result__id__get = '/models/google/video/generations/result/{id}',
}
