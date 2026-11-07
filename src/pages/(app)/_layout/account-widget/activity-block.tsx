import { type CSSProperties, type FC } from "react";

import type { DailyActivity } from "./activity";
import styles from "./account-widget.module.css";

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
    <section className={styles.activityBlock}>
      <div className={styles.activityStats}>
        <div>
          <small>{t(`${PREFIX}.spentToday`)}</small>
          <strong>
            {formatTokenAmount(activity.todaySpent)}
            <em>{t(`${PREFIX}.token`)}</em>
          </strong>
        </div>
        <div>
          <small>{t(`${PREFIX}.createdToday`)}</small>
          <strong>{activity.todayCount.toLocaleString("fa-IR")}</strong>
        </div>
      </div>
      <div
        className={styles.bars}
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
              className={styles.barSlot}
              title={`${weekdayLongFormat.format(day)}: ${formatTokenAmount(spent)} ${t(`${PREFIX}.token`)}`}
            >
              <span
                className={styles.bar}
                data-today={isToday || undefined}
                style={{ "--bar": ratio } as CSSProperties}
              />
              <small data-today={isToday || undefined}>
                {weekdayFormat.format(day)}
              </small>
            </span>
          );
        })}
      </div>
      <small className={styles.barsCaption}>
        {hasActivity ? t(`${PREFIX}.weekLabel`) : t(`${PREFIX}.weekEmpty`)}
      </small>
    </section>
  );
};

export default ActivityBlock;
