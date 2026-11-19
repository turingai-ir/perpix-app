import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PROJECTS_PAGE_SIZE } from "../model/project";
import { getProject, listProjects } from "../services/projects";

// Two separate prefixes: the list's cached pages and one project's cached
// document have different shapes, so a list update must never touch a project.
export const projectsKey = ["studio", "projects"] as const;
export const projectRootKey = ["studio", "project"] as const;
export const projectKey = (uuid: string) => [...projectRootKey, uuid] as const;

export function useProjects() {
  return useInfiniteQuery({
    queryKey: projectsKey,
    queryFn: ({ pageParam, signal }) =>
      listProjects(pageParam, PROJECTS_PAGE_SIZE, signal),
    initialPageParam: 0,
    getNextPageParam: (page, _pages, offset) =>
      page.has_next ? offset + PROJECTS_PAGE_SIZE : undefined,
    select: (data) => data.pages.flatMap((page) => page.items),
    staleTime: 30_000,
  });
}

export function useProject(uuid: string) {
  return useQuery({
    queryKey: projectKey(uuid),
    queryFn: ({ signal }) => getProject(uuid, signal),
    retry: false,
  });
}
