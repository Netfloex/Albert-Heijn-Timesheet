export type Shift = {
	start: string;
	end: string;
};
export type Timesheet = {
	updated: string;
	parsed: Shift[];
};
type Schema = {
	token?: string;
	expiry?: number;
	error?: boolean;
	created?: string;
	shifts: Record<string, Timesheet>;
};

export default Schema;
