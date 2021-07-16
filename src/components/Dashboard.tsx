import Schedule from "@components/Schedule";

import { Month } from "@models/store";
import { FC } from "react";

const Dashboard: FC<{ timesheet: Month }> = ({ timesheet }) => (
	<Schedule timesheet={timesheet} />
);

export default Dashboard;
