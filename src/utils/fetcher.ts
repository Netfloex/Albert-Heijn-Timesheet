import axios from "axios";

export const fetcher = <Data>(url: string): Promise<Data> =>
	axios.get<Data>(url).then((res) => res.data);
