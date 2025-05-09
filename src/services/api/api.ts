export interface paths {
  readonly '/user/login': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly get?: never
    readonly put?: never
    /** Login */
    readonly post: operations['login_user_login_post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/user/verify': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly get?: never
    readonly put?: never
    /** Verify */
    readonly post: operations['verify_user_verify_post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/open-ai/chat-completion/create': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly get?: never
    readonly put?: never
    /** Chatcompletioncreatepost */
    readonly post: operations['chatCompletionCreatePost_open_ai_chat_completion_create_post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/open-ai/chat-completion/{chat_id}': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path: {
        readonly chat_id: string
      }
      readonly cookie?: never
    }
    /** Chatcompletioncontinueget */
    readonly get: operations['chatCompletionContinueGet_open_ai_chat_completion__chat_id__get']
    readonly put?: never
    /** Chatcompletioncontinuepost */
    readonly post: operations['chatCompletionContinuePost_open_ai_chat_completion__chat_id__post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/open-ai/image/create': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly get?: never
    readonly put?: never
    /** Imagecreatepost */
    readonly post: operations['imageCreatePost_open_ai_image_create_post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/open-ai/image/edit': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly get?: never
    readonly put?: never
    /** Imageeditpost */
    readonly post: operations['imageEditPost_open_ai_image_edit_post']
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
  readonly '/open-ai/image/chat/{image_chat_id}': {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path: {
        readonly image_chat_id: string
      }
      readonly cookie?: never
    }
    /** Image Chat Get */
    readonly get: operations['image_chat_get_open_ai_image_chat__image_chat_id__get']
    readonly put?: never
    readonly post?: never
    readonly delete?: never
    readonly options?: never
    readonly head?: never
    readonly patch?: never
    readonly trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    /** Body_imageEditPost_open_ai_image_edit_post */
    readonly Body_imageEditPost_open_ai_image_edit_post: {
      /** Prompt */
      readonly prompt: string
      /**
       * Image
       * Format: binary
       */
      readonly image: string
      /** Model */
      readonly model: string
    }
    /** HTTPValidationError */
    readonly HTTPValidationError: {
      /** Detail */
      readonly detail?: readonly components['schemas']['ValidationError'][]
    }
    /**
     * OPEN_AI_IMAGE_MODELS
     * @enum {string}
     */
    readonly OPEN_AI_IMAGE_MODELS: OPEN_AI_IMAGE_MODELS
    /**
     * OPEN_AI_TEXT_MODELS
     * @enum {string}
     */
    readonly OPEN_AI_TEXT_MODELS: OPEN_AI_TEXT_MODELS
    /** OpenAiChatCompletionChoice */
    readonly OpenAiChatCompletionChoice: {
      /** Role */
      readonly role: string
      /** Content */
      readonly content: string
    }
    /** OpenAiChatCompletionContinueSchema */
    readonly OpenAiChatCompletionContinueSchema: {
      /** Input */
      readonly input: string
      readonly model: components['schemas']['OPEN_AI_TEXT_MODELS']
    }
    /** OpenAiChatCompletionCreateResponse */
    readonly OpenAiChatCompletionCreateResponse: {
      /** Messages */
      readonly messages: readonly components['schemas']['OpenAiChatCompletionChoice'][]
      /** Chat Id */
      readonly chat_id: string
      /** Model */
      readonly model: string
    }
    /** OpenAiChatCompletionCreateSchema */
    readonly OpenAiChatCompletionCreateSchema: {
      /** Input */
      readonly input: string
      readonly model: components['schemas']['OPEN_AI_TEXT_MODELS']
      /** System Message */
      readonly system_message: string | null
    }
    /** OpenAiImageCreateSchema */
    readonly OpenAiImageCreateSchema: {
      /** Input */
      readonly input: string
      readonly model: components['schemas']['OPEN_AI_IMAGE_MODELS']
    }
    /** OpenAiMessageCompletionCreateMessage */
    readonly OpenAiMessageCompletionCreateMessage: {
      /** Role */
      readonly role: string
      /** Message */
      readonly message: string | null
      /** Images */
      readonly images:
        | readonly components['schemas']['OpenAiMessageCompletionCreateMessageImage'][]
        | null
    }
    /** OpenAiMessageCompletionCreateMessageImage */
    readonly OpenAiMessageCompletionCreateMessageImage: {
      /** Name */
      readonly name: string
      /** Url */
      readonly url: string
    }
    /** OpenAiMessageCompletionCreateResponse */
    readonly OpenAiMessageCompletionCreateResponse: {
      /** Image Chat Id */
      readonly image_chat_id: string
      /** Model */
      readonly model: string
      /** Messages */
      readonly messages: readonly components['schemas']['OpenAiMessageCompletionCreateMessage'][]
    }
    /** UserLoginResponse */
    readonly UserLoginResponse: {
      /** Token */
      readonly token: string
    }
    /** UserLoginSchema */
    readonly UserLoginSchema: {
      /**
       * Phonenumber
       * @description شماره تلفن معتبر نیست
       * @example 09123456789
       */
      readonly phoneNumber: string
    }
    /** UserVerifyResponse */
    readonly UserVerifyResponse: {
      /** Token */
      readonly token: string
    }
    /** UserVerifySchema */
    readonly UserVerifySchema: {
      /**
       * Code
       * @description کد تایید اشتباه است
       * @example 123456
       */
      readonly code: string
    }
    /** ValidationError */
    readonly ValidationError: {
      /** Location */
      readonly loc: readonly (string | number)[]
      /** Message */
      readonly msg: string
      /** Error Type */
      readonly type: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type SchemaBodyImageEditPostOpenAiImageEditPost =
  components['schemas']['Body_imageEditPost_open_ai_image_edit_post']
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError']
export type SchemaOpenAiImageModels = components['schemas']['OPEN_AI_IMAGE_MODELS']
export type SchemaOpenAiTextModels = components['schemas']['OPEN_AI_TEXT_MODELS']
export type SchemaOpenAiChatCompletionChoice = components['schemas']['OpenAiChatCompletionChoice']
export type SchemaOpenAiChatCompletionContinueSchema =
  components['schemas']['OpenAiChatCompletionContinueSchema']
export type SchemaOpenAiChatCompletionCreateResponse =
  components['schemas']['OpenAiChatCompletionCreateResponse']
export type SchemaOpenAiChatCompletionCreateSchema =
  components['schemas']['OpenAiChatCompletionCreateSchema']
export type SchemaOpenAiImageCreateSchema = components['schemas']['OpenAiImageCreateSchema']
export type SchemaOpenAiMessageCompletionCreateMessage =
  components['schemas']['OpenAiMessageCompletionCreateMessage']
export type SchemaOpenAiMessageCompletionCreateMessageImage =
  components['schemas']['OpenAiMessageCompletionCreateMessageImage']
export type SchemaOpenAiMessageCompletionCreateResponse =
  components['schemas']['OpenAiMessageCompletionCreateResponse']
export type SchemaUserLoginResponse = components['schemas']['UserLoginResponse']
export type SchemaUserLoginSchema = components['schemas']['UserLoginSchema']
export type SchemaUserVerifyResponse = components['schemas']['UserVerifyResponse']
export type SchemaUserVerifySchema = components['schemas']['UserVerifySchema']
export type SchemaValidationError = components['schemas']['ValidationError']
export type $defs = Record<string, never>
export interface operations {
  readonly login_user_login_post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['UserLoginSchema']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['UserLoginResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly verify_user_verify_post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['UserVerifySchema']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['UserVerifyResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly chatCompletionCreatePost_open_ai_chat_completion_create_post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['OpenAiChatCompletionCreateSchema']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiChatCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly chatCompletionContinueGet_open_ai_chat_completion__chat_id__get: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path: {
        readonly chat_id: string
      }
      readonly cookie?: never
    }
    readonly requestBody?: never
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiChatCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly chatCompletionContinuePost_open_ai_chat_completion__chat_id__post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path: {
        readonly chat_id: string
      }
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['OpenAiChatCompletionContinueSchema']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiChatCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly imageCreatePost_open_ai_image_create_post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'application/json': components['schemas']['OpenAiImageCreateSchema']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiMessageCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly imageEditPost_open_ai_image_edit_post: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path?: never
      readonly cookie?: never
    }
    readonly requestBody: {
      readonly content: {
        readonly 'multipart/form-data': components['schemas']['Body_imageEditPost_open_ai_image_edit_post']
      }
    }
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiMessageCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  readonly image_chat_get_open_ai_image_chat__image_chat_id__get: {
    readonly parameters: {
      readonly query?: never
      readonly header?: never
      readonly path: {
        readonly image_chat_id: string
      }
      readonly cookie?: never
    }
    readonly requestBody?: never
    readonly responses: {
      /** @description Successful Response */
      readonly 200: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['OpenAiMessageCompletionCreateResponse']
        }
      }
      /** @description Validation Error */
      readonly 422: {
        headers: {
          readonly [name: string]: unknown
        }
        content: {
          readonly 'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
}
export enum OPEN_AI_IMAGE_MODELS {
  dall_e_2 = 'dall-e-2',
  dall_e_3 = 'dall-e-3',
}
export enum OPEN_AI_TEXT_MODELS {
  gpt_3_5_turbo = 'gpt-3.5-turbo',
  gpt_4 = 'gpt-4',
  gpt_4_turbo = 'gpt-4-turbo',
  gpt_4o = 'gpt-4o',
  gpt_4o_mini = 'gpt-4o-mini',
  gpt_4o_search_preview = 'gpt-4o-search-preview',
  o1_mini = 'o1-mini',
  o1 = 'o1',
  o3_mini = 'o3-mini',
  o1_preview = 'o1-preview',
}
export enum ApiPaths {
  login_user_login_post = '/user/login',
  verify_user_verify_post = '/user/verify',
  chatCompletionCreatePost_open_ai_chat_completion_create_post = '/open-ai/chat-completion/create',
  chatCompletionContinuePost_open_ai_chat_completion__chat_id__post = '/open-ai/chat-completion/{chat_id}',
  chatCompletionContinueGet_open_ai_chat_completion__chat_id__get = '/open-ai/chat-completion/{chat_id}',
  imageCreatePost_open_ai_image_create_post = '/open-ai/image/create',
  imageEditPost_open_ai_image_edit_post = '/open-ai/image/edit',
  image_chat_get_open_ai_image_chat__image_chat_id__get = '/open-ai/image/chat/{image_chat_id}',
}
