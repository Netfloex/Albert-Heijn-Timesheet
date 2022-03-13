import { calDavCalendarName, calDavNotifyMinutes } from "@env";

import axios, { AxiosResponse } from "axios";
import { createEvents } from "ics";
import { DateTime } from "luxon";

import { log } from "@server";

import LuxonTimesheet from "@models/LuxonTimesheet";

const createDateArray = (
	date: DateTime
): [number, number, number, number, number] => {
	return date
		.toFormat("yyyy M d H m")
		.split(" ")
		.map((e) => parseInt(e)) as [number, number, number, number, number];
};

const timesheetToEvents = (timesheet: LuxonTimesheet): Promise<string> => {
	return new Promise((res, rej) => {
		createEvents(
			timesheet.shifts.map((shift) => ({
				title: `Werken ${shift.start.setLocale("nl").toFormat("EEEE")}`,
				start: createDateArray(shift.start),
				end: createDateArray(shift.end),
				status: "CONFIRMED",
				description: `Geüpdated op ${timesheet.updated
					.setLocale("nl")
					.toLocaleString(DateTime.DATETIME_MED)}`,
				productId: "Netfloex/Appie",
				calName: calDavCalendarName,
				alarms: calDavNotifyMinutes.map((minutes) => ({
					action: "display",
					trigger: {
						before: true,
						minutes
					}
				}))
			})),
			(err, data) => {
				if (err) return rej(err);
				res(data);
			}
		);
	});
};

export const updateCalendar = async (
	timesheet: LuxonTimesheet,
	{
		calDavUrl,
		calDavUsername,
		calDavPassword
	}: {
		calDavUrl: string;
		calDavUsername: string;
		calDavPassword: string;
	}
): Promise<AxiosResponse | void> => {
	const data = await timesheetToEvents(timesheet);
	console.log(data);

	return axios
		.put(calDavUrl!, data, {
			headers: {
				"User-Agent": "Caldav",
				Authorization:
					"Basic " +
					Buffer.from(`${calDavUsername}:${calDavPassword}`).toString(
						"base64"
					)
			},

			validateStatus: (s) => s == 201
		})
		.catch((err) => {
			if (axios.isAxiosError(err) && err.response?.status == 401) {
				return log.CaldavInvalidCredentials();
			}
			throw err;
		});
};
