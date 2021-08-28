import { Dispatch, SetStateAction } from "react";

import type { Timesheet } from "@models/store";

type Context = {
	timesheet?: Timesheet;
	updateTimesheet?: Dispatch<SetStateAction<Timesheet | undefined>>;
};

export default Context;
