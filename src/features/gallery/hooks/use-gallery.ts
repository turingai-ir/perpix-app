import { useMemo, useState } from "react";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useGalleryFiles } from "./use-gallery-files";

export function useGallery() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { activeFilter, files, setActiveFilter, userFilesState, loadMoreRef } =
    useGalleryFiles();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("original");
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);

  const visible = useMemo(() => {
    const query = search.trim().normalize("NFKC").toLocaleLowerCase();
    const result = files.filter((file) =>
      (file.file_name || "")
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(query),
    );

    if (sort === "name") {
      result.sort((a, b) =>
        (a.file_name || "").localeCompare(b.file_name || "", "fa", {
          numeric: true,
        }),
      );
    }

    if (sort === "size") {
      result.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
    }

    return result;
  }, [files, search, sort]);

  const isEmpty =
    !userFilesState.isPending && !userFilesState.isError && files.length === 0;

  const isSearchEmpty = files.length > 0 && visible.length === 0;

  const handleOpenViewer = (uuid: string, element: HTMLButtonElement) => {
    setTrigger(element);
    setSelected(uuid);
  };

  const handleCloseViewer = () => {
    setSelected(null);
  };

  return {
    t,
    activeFilter,
    setActiveFilter,
    files,
    visible,
    search,
    setSearch,
    sort,
    setSort,
    compact,
    setCompact,
    isEmpty,
    isSearchEmpty,
    userFilesState,
    loadMoreRef,
    selected,
    setSelected,
    trigger,
    handleOpenViewer,
    handleCloseViewer,
  };
}
