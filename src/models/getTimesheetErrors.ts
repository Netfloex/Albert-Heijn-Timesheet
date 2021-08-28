export type TimesheetError = {
	error: string;
	type: ErrorType;
};

export enum ErrorType {
	Incomplete = 0,
	Unknown = 1
}
