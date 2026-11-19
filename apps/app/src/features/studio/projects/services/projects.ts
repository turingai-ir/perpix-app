import { apiClient } from "@/shared/api";
import {
  emptyDocument,
  projectListSchema,
  projectSchema,
  PROJECT_SCHEMA_VERSION,
} from "../model/project";
import { isMissing } from "../model/project-error";

export const listProjects = async (
  offset: number,
  limit: number,
  signal: AbortSignal,
) => {
  const { data } = await apiClient.GET("/api/v1/studio/projects", {
    params: { query: { offset, limit } },
    signal,
  });
  return projectListSchema.parse(data);
};

export const getProject = async (uuid: string, signal?: AbortSignal) => {
  const { data } = await apiClient.GET(
    "/api/v1/studio/projects/{project_uuid}",
    {
      params: { path: { project_uuid: uuid } },
      signal,
    },
  );
  return projectSchema.parse(data);
};

export const createProject = async (title: string) => {
  const { data } = await apiClient.POST("/api/v1/studio/projects", {
    body: {
      title,
      document: emptyDocument(),
      schema_version: PROJECT_SCHEMA_VERSION,
    },
  });
  return projectSchema.parse(data);
};

/**
 * A save replaces the whole project, so a rename reads the latest first and
 * sends it back from that revision. If someone saved in between, the backend
 * refuses with a conflict and nothing is lost.
 */
export const renameProject = async (uuid: string, title: string) => {
  const current = await getProject(uuid);
  const { data } = await apiClient.PUT(
    "/api/v1/studio/projects/{project_uuid}",
    {
      params: { path: { project_uuid: uuid } },
      body: {
        title,
        document: current.document,
        schema_version: current.schema_version,
        revision: current.revision,
        // An expired file cannot be sent back; the backend only accepts live ones.
        files: current.files
          .filter((file) => file.available)
          .map(({ file_uuid, role }) => ({ file_uuid, role })),
      },
    },
  );
  return projectSchema.parse(data);
};

/** A project that is already gone is as good as deleted. */
export const deleteProject = async (uuid: string): Promise<void> => {
  try {
    await apiClient.DELETE("/api/v1/studio/projects/{project_uuid}", {
      params: { path: { project_uuid: uuid } },
    });
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
};
