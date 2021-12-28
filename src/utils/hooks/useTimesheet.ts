import { useContext } from "react";

import { TimesheetContext } from "@components/TimesheetProvider";

import { useLuxonLocale } from "@hooks";

import { parseTimesheet } from "@utils";

import type LuxonTimesheet from "@models/LuxonTimesheet";

export const useTimesheet = (): LuxonTimesheet => {
	const { timesheet } = useContext(TimesheetContext);
	return useLuxonLocale(() => parseTimesheet(timesheet));
};
