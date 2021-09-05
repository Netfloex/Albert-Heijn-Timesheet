import { password, storePath, username } from "@env";

import axios from "axios";

import { SamLogin, Store } from "@lib";
import { TimesheetError } from "@utils";

import { ErrorType } from "@models/ErrorType";
import Schema, { Timesheet } from "@models/Schema";

export const getTimesheet = async (): Promise<Timesheet | TimesheetError> => {
	if (!username || !password) {
		return {
			error: "Env is incomplete",
			type: ErrorType.Incomplete
		};
	}
	const store = new Store<Schema>(storePath, { shifts: {}, token: {} });

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
		console.log("Error catched in getTimesheet.ts:");
		console.error(error);

		if (error instanceof TimesheetError) {
			if (error.type == ErrorType.Incorrect) {
				return {
					error: "Username/Password is incorrect",
					type: ErrorType.Incorrect
				};
			}
			if (error.type == ErrorType.IncorrectSaved) {
				return {
					error: "Username/Password was incorrect last try, didn't try again",
					type: ErrorType.IncorrectSaved
				};
			}
		}

		if (axios.isAxiosError(error)) {
			return {
				error: `Error while requesting: '${error.config.url}', ${error.message}`,
				type: ErrorType.AxiosError
			};
		}

		return {
			error: error instanceof Error ? error.toString() : "",
			type: ErrorType.Unknown
		};
	}
};
