export type Shift = {
	start: string;
	end: string;
};
export type Month = {
	updated: string;
	parsed: Shift[];
};
type Schema = {
	token?: string;
	expiry?: number;
	error?: boolean;
	created?: string;
	shifts: Record<string, Month>;
};

export default Schema;
