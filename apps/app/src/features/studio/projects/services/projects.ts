import { apiClient } from "@/shared/api";
import {
  emptyDocument,
  projectListSchema,
  projectSchema,
  PROJECT_SCHEMA_VERSION,
  type Project,
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

type Edit = {
  title?: string;
  document?: Record<string, unknown>;
  /** Files to add to the live ones the project already has. */
  addFiles?: Array<{
    file_uuid: string;
    role: "SOURCE" | "EXPORT" | "THUMBNAIL";
  }>;
  /** Files to drop, by uuid. */
  dropFiles?: string[];
};

/**
 * A save replaces the whole project, so every change reads the latest first
 * and sends it back from that revision. If someone saved in between, the
 * backend refuses with a conflict and nothing is lost.
 */
export const editProject = async (uuid: string, edit: Edit) =>
  saveProjectEdit(await getProject(uuid), edit);

/** Save an editor draft against the revision it was based on. */
export const saveProjectEdit = async (current: Project, edit: Edit) => {
  const kept = current.files
    // An expired file cannot be sent back; the backend only accepts live ones.
    .filter(
      (file) => file.available && !edit.dropFiles?.includes(file.file_uuid),
    )
    .map(({ file_uuid, role }) => ({ file_uuid, role }));
  const added = (edit.addFiles ?? []).filter(
    (file) => !kept.some((item) => item.file_uuid === file.file_uuid),
  );
  const { data } = await apiClient.PUT(
    "/api/v1/studio/projects/{project_uuid}",
    {
      params: { path: { project_uuid: current.uuid } },
      body: {
        title: edit.title ?? current.title,
        document: edit.document ?? current.document,
        schema_version: current.schema_version,
        revision: current.revision,
        files: [...kept, ...added],
      },
    },
  );
  return projectSchema.parse(data);
};

export const renameProject = (uuid: string, title: string) =>
  editProject(uuid, { title });

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
