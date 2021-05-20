export type Shift = {
	start: string;
	end: string;
};
export type Month = {
	updated: string;
	parsed: Shift[];
};
type Store = {
	token: string;
	expiry: number;
	error: boolean;
	shifts: Record<string, Month>;
};

export default Store;
