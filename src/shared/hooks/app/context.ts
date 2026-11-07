import createClient, { type OpenapiQueryClient } from "openapi-react-query";
import { createContext } from "react";

import { apiClient, type paths } from "@/shared/api";

interface Context {
  apiHook: OpenapiQueryClient<paths, `${string}/${string}`>;
}
export const appContext = createContext<Context>({
  apiHook: createClient(apiClient),
});
