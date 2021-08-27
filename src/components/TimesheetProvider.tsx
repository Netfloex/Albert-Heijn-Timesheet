import { createContext, FC, useState } from "react";

import Context from "@models/TimesheetContext";
import { Month } from "@models/store";

export const TimesheetContext = createContext<Context>({
	timesheet: undefined,
	updateTimesheet: undefined
});

const TimesheetProvider: FC<{ timesheet?: Month }> = ({
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

export default TimesheetProvider;
