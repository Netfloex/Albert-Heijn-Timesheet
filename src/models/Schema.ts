export type Shift = {
	start: string;
	end: string;
};
export type Timesheet = {
	updated: string;
	parsed: Shift[];
};

export type GetTimesheet = [timesheet: Timesheet, fromCache: boolean];

type Token = {
	token?: string;
	created?: string;
	updated?: string;
};

type Schema = {
	error?: boolean;

	token: Token;
	shifts: Record<string, Timesheet>;
};

export default Schema;
