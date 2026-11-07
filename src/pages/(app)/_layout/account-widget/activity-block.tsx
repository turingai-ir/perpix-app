import { type CSSProperties, type FC } from "react";

import type { DailyActivity } from "./activity";
import {
  AccountBlock,
  AccountLabel,
  AccountUnit,
} from "./account-widget-parts";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

const weekdayFormat = new Intl.DateTimeFormat("fa-IR", { weekday: "narrow" });
const weekdayLongFormat = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
});

const getDay = (index: number, total: number) => {
  const day = new Date();
  day.setDate(day.getDate() - (total - 1 - index));
  return day;
};

const PREFIX = "pages.app.layout.accountWidget";

type ActivityBlockProps = { activity: DailyActivity };

/** Today's usage plus a 7-day bar strip, readable without the bars. */
const ActivityBlock: FC<ActivityBlockProps> = ({ activity }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const hasActivity = activity.maxSpent > 0;

  return (
    <AccountBlock className="flex flex-col gap-3.5">
      <div className="flex justify-between gap-4 tabular-nums">
        <div className="flex flex-col gap-1">
          <AccountLabel>{t(`${PREFIX}.spentToday`)}</AccountLabel>
          <strong className="text-base font-extrabold">
            {formatTokenAmount(activity.todaySpent)}
            <AccountUnit className="ms-1">{t(`${PREFIX}.token`)}</AccountUnit>
          </strong>
        </div>
        <div className="flex flex-col gap-1">
          <AccountLabel>{t(`${PREFIX}.createdToday`)}</AccountLabel>
          <strong className="text-base font-extrabold">
            {activity.todayCount.toLocaleString("fa-IR")}
          </strong>
        </div>
      </div>
      <div
        className="flex items-end gap-2"
        role="img"
        aria-label={
          hasActivity ? t(`${PREFIX}.weekLabel`) : t(`${PREFIX}.weekEmpty`)
        }
      >
        {activity.series.map((spent, index) => {
          const day = getDay(index, activity.series.length);
          const isToday = index === activity.series.length - 1;
          const ratio = hasActivity
            ? Math.max(spent / activity.maxSpent, spent > 0 ? 0.12 : 0.05)
            : 0.05;
          return (
            <span
              key={index}
              className="group/bar flex flex-1 flex-col items-stretch gap-1.5"
              title={`${weekdayLongFormat.format(day)}: ${formatTokenAmount(spent)} ${t(`${PREFIX}.token`)}`}
            >
              <span
                className="ease-out-quint data-today:from-accent-pink data-today:to-accent-violet h-[3.2rem] origin-bottom scale-y-(--bar) rounded-md bg-white/18 transition-transform duration-600 group-hover/bar:bg-white/30 data-today:bg-linear-to-b motion-reduce:transition-none"
                data-today={isToday || undefined}
                style={{ "--bar": ratio } as CSSProperties}
              />
              <small
                className="data-today:text-accent-pink text-center text-[0.7rem] text-white/50 data-today:font-extrabold"
                data-today={isToday || undefined}
              >
                {weekdayFormat.format(day)}
              </small>
            </span>
          );
        })}
      </div>
      <AccountLabel>
        {hasActivity ? t(`${PREFIX}.weekLabel`) : t(`${PREFIX}.weekEmpty`)}
      </AccountLabel>
    </AccountBlock>
  );
};

export default ActivityBlock;
