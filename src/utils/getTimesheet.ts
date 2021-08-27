import SamLogin from "@lib/SamLogin";
import Store from "@lib/store";
import { password, storePath, username } from "@utils/env";

import ErrorType, { Error } from "@models/getTimesheetErrors";
import Schema, { Month } from "@models/store";

const getTimesheet = async (): Promise<Month | Error> => {
	if (!username || !password) {
		return {
			error: "Env is incomplete",
			type: ErrorType.Incomplete
		};
	}
	const store = new Store<Schema>(storePath, { shifts: {} });

	const go = new SamLogin({
		username,
		password,
		store
	});

	await store.init();

	try {
		const timesheet = await go.get();

		return timesheet;
	} catch (error) {
		console.error(error);

		return {
			error: error?.toString(),
			type: ErrorType.Unknown
		};
	}
};

export default getTimesheet;
