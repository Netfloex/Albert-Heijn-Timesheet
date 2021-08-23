import { createContext, FC } from "react";

import { Month } from "@models/store";

export const TimesheetContext = createContext<Month | null>(null);

const TimesheetProvider: FC<{ timesheet: Month }> = ({
	timesheet,
	children
}) => (
	<TimesheetContext.Provider value={timesheet}>
		{children}
	</TimesheetContext.Provider>
);

export default TimesheetProvider;
