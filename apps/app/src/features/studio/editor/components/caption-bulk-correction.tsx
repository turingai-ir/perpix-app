import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { formatDuration } from "../../projects/model/clips";
import {
  replacementForMatch,
  type CaptionMatch,
} from "../model/caption-matches";

const LABEL = "features.studio.editor.corrections";
const MATCHES_PER_PAGE = 20;

interface CaptionBulkCorrectionProps {
  onFind: (query: string) => CaptionMatch[];
  onApply: (matches: readonly CaptionMatch[], replacement: string) => void;
}

export function CaptionBulkCorrection({
  onFind,
  onApply,
}: CaptionBulkCorrectionProps) {
  const { t } = useAppTranslate();
  const [query, setQuery] = useState("");
  const [replacement, setReplacement] = useState("");
  const [matches, setMatches] = useState<CaptionMatch[]>();
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
  const [page, setPage] = useState(0);
  const first = page * MATCHES_PER_PAGE;

  const search = (event: FormEvent) => {
    event.preventDefault();
    setMatches(onFind(query));
    setExcluded(new Set());
    setPage(0);
  };

  return (
    <div className="gap-block flex flex-col">
      <form className="gap-group flex flex-col" onSubmit={search}>
        <label className="gap-group flex flex-col">
          {t(`${LABEL}.findPhrase`)}
          <Input
            dir="auto"
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setMatches(undefined);
            }}
          />
        </label>
        <label className="gap-group flex flex-col">
          {t(`${LABEL}.replacement`)}
          <Input
            dir="auto"
            value={replacement}
            onChange={(event) => setReplacement(event.currentTarget.value)}
          />
        </label>
        <Button type="submit" variant="outline" disabled={!query.trim()}>
          {t(`${LABEL}.findMatches`)}
        </Button>
      </form>
      {matches?.length === 0 && (
        <p role="status" className="text-muted-foreground text-body">
          {t(`${LABEL}.noMatches`)}
        </p>
      )}
      {matches && matches.length > 0 && (
        <>
          <p role="status" className="text-muted-foreground text-footnote">
            {t(`${LABEL}.selectedMatches`, {
              selected: (matches.length - excluded.size).toLocaleString(
                "fa-IR",
              ),
              total: matches.length.toLocaleString("fa-IR"),
            })}
          </p>
          <ul className="gap-group flex flex-col">
            {matches.slice(first, first + MATCHES_PER_PAGE).map((match) => (
              <li key={match.key}>
                <label
                  aria-label={t(`${LABEL}.includeMatch`, {
                    phrase: match.phrase,
                    time: formatDuration(match.timelineMs),
                  })}
                  className="gap-group rounded-control p-inset-sm flex cursor-pointer items-center border"
                >
                  <input
                    type="checkbox"
                    className="accent-primary size-4 shrink-0"
                    checked={!excluded.has(match.key)}
                    onChange={(event) => {
                      const next = new Set(excluded);
                      if (event.currentTarget.checked) next.delete(match.key);
                      else next.add(match.key);
                      setExcluded(next);
                    }}
                  />
                  <span className="min-w-0">
                    <span dir="auto" className="text-body block wrap-anywhere">
                      {match.before} <strong>{match.phrase}</strong>{" "}
                      {match.after}
                    </span>
                    {replacement.trim() && !excluded.has(match.key) && (
                      <span
                        dir="auto"
                        className="text-foreground text-body block wrap-anywhere"
                      >
                        {match.before}{" "}
                        <strong>
                          {replacementForMatch(match, replacement)}
                        </strong>{" "}
                        {match.after}
                      </span>
                    )}
                    <span className="text-muted-foreground text-footnote block wrap-anywhere">
                      <bdi>{match.clipName}</bdi> ·{" "}
                      <bdi>{formatDuration(match.timelineMs)}</bdi>
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {matches.length > MATCHES_PER_PAGE && (
            <div className="flex justify-between">
              <Button
                variant="ghost"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                {t(`${LABEL}.previousMatches`)}
              </Button>
              <Button
                variant="ghost"
                disabled={first + MATCHES_PER_PAGE >= matches.length}
                onClick={() => setPage(page + 1)}
              >
                {t(`${LABEL}.nextMatches`)}
              </Button>
            </div>
          )}
          <Button
            disabled={!replacement.trim() || excluded.size === matches.length}
            onClick={() =>
              onApply(
                matches.filter(({ key }) => !excluded.has(key)),
                replacement,
              )
            }
          >
            {t(`${LABEL}.applyMatches`)}
          </Button>
        </>
      )}
    </div>
  );
}
