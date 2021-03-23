import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import FileAsync from "lowdb/adapters/FileAsync";
import low from "lowdb";
import colors from "colors/safe";
import cheerio from "cheerio";

type Schema = {
	token: string;
	expiry: number;
	shifts: Record<
		string,
		{
			updated: string;
			parsed: {
				start: string;
				end: string;
			};
		}
	>;
};
const timesheetURL = "wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp";
const EXPIRY = 60 * 60 * 1000;

export default class SamLogin {
	private db: low.LowdbAsync<Schema>;
	private http: AxiosInstance;

	private username: string;
	private password: string;

	get token() {
		return this.db.get("token").value();
	}

	get expiry() {
		return this.db.get("expiry").value() ?? 0;
	}

	set token(value) {
		this.db.set("expiry", Date.now() + EXPIRY).write();
		if (value) {
			this.db //
				.set("token", value)
				.set("created", new Date().toLocaleString())
				.write();
		}
	}

	constructor({ username, password }: { username: string; password: string }) {
		this.http = axios.create({
			baseURL: "https://sam.ahold.com/",
		});
		this.http.interceptors.request.use(c => {
			console.log(`${colors.yellow("[REQUEST]")}: ${c.url}`);
			return c;
		});
		this.username = username;
		this.password = password;
	}

	async init() {
		this.db = await low(new FileAsync<Schema>("store.json"));
	}

	async login({ expired = false } = {}) {
		await this.db.read();

		if (expired || Date.now() > this.expiry) {
			console.log(colors.gray("Token is expired"));
			var session = await this.requests.session();
			var token = await this.requests.login(session).catch((err: AxiosError) => {
				if (err?.response?.status === 200) {
					throw true;
				} else {
					throw err;
				}
			});
			if (token) {
				this.token = token;
			}
		}

		return;
	}

	async timesheet(date?: Date) {
		this.db.read();
		var when = this.monthYear(date);
		var cache = `shifts.${when}`;
		if (this.db.has(cache).value()) {
			var value = this.db.get(cache).value();
			if (this.monthYear() != when || Date.now() - new Date(value.updated).getTime() < EXPIRY) {
				return value as {
					updated: Date;
					parsed: {
						start: Date;
						end: Date;
					}[];
				};
			}
		}
		var html = await this.requests.timesheet(when);
		var parsed = {
			updated: new Date(),
			parsed: this.parseTimesheet(html),
		};
		this.db.set(cache, parsed).write();

		return parsed;
	}

	private parseTimesheet(html: string) {
		var $ = cheerio.load(html);
		var shiftsElements = $("td[class*=calendarCellRegular]:not(.calendarCellRegularCurrent:has(.calCellData)) table").toArray();
		var shifts = shiftsElements.map(element => {
			var date = element.attribs["title"].replace("Details van ", "");

			var [start, end] = $("p span", element)
				.toArray()
				.map(el => new Date(`${date} ${$(el.firstChild).text()}`));

			return {
				start,
				end,
			};
		});
		return shifts;
	}

	private firstCookie(headers: AxiosResponse["headers"]) {
		return headers["set-cookie"][0].split(";")[0] as string;
	}
	private monthYear(date = new Date()) {
		return `${date.getMonth() + 1}/${date.getFullYear()}`;
	}

	private requests = {
		session: async () => {
			var res = await this.http(timesheetURL);
			return this.firstCookie(res.headers);
		},

		login: async (session: string) => {
			var res = await this.http.post(
				"pkmslogin.form", //
				`username=${this.username}&password=${this.password}&login-form-type=pwd`,
				{
					headers: { Cookie: session },
					maxRedirects: 0,
					validateStatus: s => s == 302,
				}
			);
			return this.firstCookie(res.headers);
		},

		timesheet: async (when?: string): Promise<string> => {
			var res = await this.http(`${timesheetURL}?NEW_MONTH_YEAR=${when ?? ""}`, {
				headers: { Cookie: this.token },
				maxRedirects: 0,
			});
			if (typeof res.data == "string") {
				console.log(colors.green("Opgehaald!"));
				this.token = ""; // Renew the expiry date
				return res.data;
			} else {
				if (res.data.operation == "login") {
					console.log("Token Expired During request, ms ago: " + (Date.now() - this.expiry));
					await this.login({ expired: true });
					return await this.requests.timesheet(when);
				}
			}
			console.error("Unknown Error");
			console.log(res.data);
			return "Unknown Error";
		},
	};
}
