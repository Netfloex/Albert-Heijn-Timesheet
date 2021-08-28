import { password, storePath, username } from "@env";

import { SamLogin, Store } from "@lib";

import ErrorType, { Error } from "@models/getTimesheetErrors";
import Schema, { Timesheet } from "@models/store";

export const getTimesheet = async (): Promise<Timesheet | Error> => {
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
