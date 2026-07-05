export type AiTaskMessageEvent = {
  event: "ai_task_message";
  task_uuid: string;
  task_message_uuid: string;
  task_status: "SUCCESS" | "FAILED";
  message: string | null;
  ai_model_config: Record<string, unknown>;
  ai_model_uuid: string | null;
  ai_provider_uuid: string;
  ai_external_provider_task_id: string | null;
  cost_usdmicro: number | null;
  role: "ASSISTANT";
  created_at: string;
  updated_at: string;
};
