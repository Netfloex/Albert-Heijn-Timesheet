import { store } from "./store"
import { password, username } from "@env"
import axios from "axios"
import { DateTime } from "luxon"

import { SamLogin } from "@lib"
import { TimesheetData, TimesheetError } from "@utils"

import { ErrorType } from "@models/ErrorType"

const go = new SamLogin({
	username,
	password,
	store,
})

export const getTimesheet = async (date?: DateTime): Promise<TimesheetData> => {
	if (!username || !password) {
		return {
			error: "Env is incomplete",
			type: ErrorType.Incomplete,
		}
	}

	await store.init()
	return await go
		.get(date)
		.then(([timesheet]) => {
			return timesheet
		})
		.catch((error: unknown) => {
			const timesheetError = ((): TimesheetError => {
				if (error instanceof TimesheetError) {
					if (error.type == ErrorType.Incorrect) {
						return {
							error: "Username/Password is incorrect",
							type: ErrorType.Incorrect,
						}
					}
					if (error.type == ErrorType.IncorrectSaved) {
						return {
							error: "Username/Password was incorrect last try, didn't try again",
							type: ErrorType.IncorrectSaved,
						}
					}

					if (error.type == ErrorType.NoCookies) {
						return {
							error: "No cookies were received from one of the requests, you could try again",
							type: ErrorType.NoCookies,
						}
					}

					if (error.type == ErrorType.NoToken) {
						return {
							error: "Token was not found before a request, you could try again.",
							type: ErrorType.NoToken,
						}
					}
				}

				if (axios.isAxiosError(error)) {
					return {
						error: `Error while requesting: '${error.config?.url}', ${error.message}`,
						type: ErrorType.AxiosError,
					}
				}

				console.log("Error catched in getTimesheet.ts:")
				console.error(error)

				return {
					error: error instanceof Error ? error.toString() : "",
					type: ErrorType.Unknown,
				}
			})()

			console.log("Error in getTimesheet.ts: ", timesheetError)

			return timesheetError
		})
}
