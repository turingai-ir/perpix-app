import "dayjs/locale";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import jalaliday from "jalali-plugin-dayjs";

dayjs.extend(jalaliday);
dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(isLeapYear);
dayjs.extend(minMax);
dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export { dayjs };
