import { join, resolve } from "path";
import yn from "yn";

const { env } = process;

export const username = env.AH_USERNAME;
export const password = env.AH_PASSWORD;

export const storePath = env.STORE_PATH
	? resolve(env.STORE_PATH)
	: join(process.cwd(), "data", "store.json");

export const timesheetCacheDuration = env.TIMESHEET_CACHE
	? +env.TIMESHEET_CACHE
	: 3600;

export const updateNotificationHours =
	parseInt(process.env.NOTIFICATIONS_UPDATE_HOURS ?? "") || 48;

export const notifyStart = yn(env.NOTIFY_START) ?? true;

export const notifiers = (env.NOTIFIERS ?? "")
	.split(",")
	.map((e) => e.trim())
	.filter(Boolean);

export const preNotificationMinutes =
	parseInt(process.env.NOTIFICATION_PRE_MINUTES ?? "") || 120;

export const calDavUrl = process.env.CALDAV_URL || false;
export const calDavUsername = process.env.CALDAV_USERNAME || false;
export const calDavPassword = process.env.CALDAV_PASSWORD || false;
export const calDavCalendarName = process.env.CALDAV_CALENDAR_NAME || "Shifts";
