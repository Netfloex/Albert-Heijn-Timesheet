import { join, resolve } from "path";
import yn from "yn";

const { env } = process;

export const username = env.AH_USERNAME;
export const password = env.AH_PASSWORD;

export const storePath = env.STORE_PATH
	? resolve(env.STORE_PATH)
	: join(process.cwd(), "data", "store.json");

export const NotifyStart = yn(env.NOTIFY_START) ?? true;

export const notifiers = (env.NOTIFIERS ?? "")
	.split(",")
	.map((e) => e.trim())
	.filter(Boolean);

export const timesheetCacheDuration = env.TIMESHEET_CACHE
	? +env.TIMESHEET_CACHE
	: 3600;
