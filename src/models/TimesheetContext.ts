import { Dispatch, SetStateAction } from "react";

import { Month } from "@models/store";

type Context = {
	timesheet?: Month;
	updateTimesheet?: Dispatch<SetStateAction<Month | undefined>>;
};

export default Context;
