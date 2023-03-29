import { ErrorType } from "@models/ErrorType"

export class TimesheetError {
	type: ErrorType
	error?: string

	constructor(type: ErrorType) {
		this.type = type
	}
}
