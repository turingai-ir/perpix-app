import { useAiTaskNotifications } from "../hooks/use-ai-task-notifications";

export function AiTaskEventsProvider() {
  useAiTaskNotifications();
  return null;
}
