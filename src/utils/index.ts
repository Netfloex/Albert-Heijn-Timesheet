import { TimesheetError } from "@utils";

import { Timesheet } from "@models/Schema";

export { cx } from "./classnames";
export { fetcher } from "./fetcher";
export { humanize } from "./humanize";
export { languageOf } from "./languageOf";
export { parseTimesheet } from "./parseTimesheet";
export { TimesheetError } from "./TimesheetError";

export type TimesheetData = Timesheet | TimesheetError;

export const isError = (props: TimesheetData): props is TimesheetError =>
	"error" in props;
