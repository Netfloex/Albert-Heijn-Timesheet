export type Shift = {
	start: string;
	end: string;
};
export type Timesheet = {
	updated: string;
	parsed: Shift[];
};

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
