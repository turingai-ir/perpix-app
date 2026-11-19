import { z } from "zod";

export const projectSummarySchema = z.object({
  uuid: z.string(),
  title: z.string(),
  schema_version: z.number(),
  revision: z.number(),
  expire_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ProjectSummary = z.infer<typeof projectSummarySchema>;

export const projectListSchema = z.object({
  items: z.array(projectSummarySchema),
  has_next: z.boolean(),
});

export const projectFileSchema = z.object({
  file_uuid: z.string(),
  role: z.enum(["SOURCE", "EXPORT", "THUMBNAIL"]),
  available: z.boolean(),
  content_type: z.string().nullable(),
  expire_at: z.string().nullable(),
});

export const projectSchema = projectSummarySchema.extend({
  document: z.record(z.string(), z.unknown()),
  files: z.array(projectFileSchema),
});
export type Project = z.infer<typeof projectSchema>;

/** The backend refuses more; the form stops it first. */
export const PROJECT_TITLE_MAX_LENGTH = 120;
export const PROJECTS_PAGE_SIZE = 20;

/** Which version of the studio's own document format a project is saved in. */
export const PROJECT_SCHEMA_VERSION = 1;

/**
 * The studio's document, which the backend only keeps. Clips and words are
 * filled in by later phases; a new project starts with none.
 */
export type ProjectDocument = {
  canvas: { width: number; height: number; fps: number };
  tracks: Array<
    { kind: "video"; clips: unknown[] } | { kind: "caption"; words: unknown[] }
  >;
};

export const emptyDocument = (): ProjectDocument => ({
  canvas: { width: 1080, height: 1920, fps: 30 },
  tracks: [
    { kind: "video", clips: [] },
    { kind: "caption", words: [] },
  ],
});

export const normalizeTitle = (text: string): string | null => {
  const title = text.trim();
  return title.length > 0 && title.length <= PROJECT_TITLE_MAX_LENGTH
    ? title
    : null;
};
