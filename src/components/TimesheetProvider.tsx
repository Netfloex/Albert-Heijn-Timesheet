import { createContext, FC, useState } from "react";

import type { Timesheet } from "@models/Schema";
import type Context from "@models/TimesheetContext";

export const TimesheetContext = createContext<Context>({
	timesheet: undefined,
	updateTimesheet: undefined
});

export const TimesheetProvider: FC<{ timesheet?: Timesheet }> = ({
	timesheet,
	children
}) => {
	const [stateTimesheet, updateTimesheet] = useState(timesheet);

	return (
		<TimesheetContext.Provider
			value={{
				timesheet: stateTimesheet,
				updateTimesheet
			}}
		>
			{children}
		</TimesheetContext.Provider>
	);
};
