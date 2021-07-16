import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Database from "./storage";
import colors from "chalk";
import cheerio from "cheerio";

import { join } from "path";
import Store, { Month, Shift } from "@models/store";
import env from "./env";

const timesheetURL = "wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp";
const EXPIRY = 60 * 60 * 1000;

export default class SamLogin {
	private db: Database<Store>;
	private http: AxiosInstance;

	private username: string;
	private password: string;

	private getToken = () => this.db.data.token;

	private isExpired = () => Date.now() > (this.db.data.expiry ?? 0);

	private updateExpiry = async (): Promise<void> => {
		this.db.data.expiry = Date.now() + EXPIRY;
		await this.db.write();
	};

	private setToken = async (token: string): Promise<void> => {
		await this.updateExpiry();
		this.db.data.token = token;
		this.db.data.created = new Date().toLocaleString();
		await this.db.write();
	};

	constructor({
		username,
		password
	}: {
		username: string;
		password: string;
	}) {
		this.http = axios.create({
			baseURL: "https://sam.ahold.com/",
			timeout: 5000
		});

		this.http.interceptors.request.use((c) => {
			console.log(
				`${colors.yellow(`[${c.method.toUpperCase()}]`)}: ${c.url}`
			);
			return c;
		});

		this.username = username;
		this.password = password;

		this.db = new Database<Store>(
			join(env.path ?? process.cwd(), "store.json"),
			{ shifts: {} }
		);
	}

	async login({ expired = false } = {}) {
		await this.db.init();

		if (this.db.data.error) {
			console.log(colors.yellow("Error var is set, see store.json"));
			return "Password was incorrect last time.";
		}

		if (expired || this.isExpired()) {
			console.log(colors.gray("Token is expired"));

			var session = await this.requests.session();
			await this.requests
				.login(session)
				.then(this.setToken)
				.catch(async (error) => {
					const err = error as AxiosError;

					if (err.response.status === 200) {
						const msg = "Password Login Failed!";
						console.log(colors.red(msg));

						this.db.data.error = true;
						await this.db.write();
						return msg;
					} else {
						throw err;
					}
				});
		}
	}

	async timesheet({
		date,
		cachedOnly
	}: {
		date?: Date;
		cachedOnly?: boolean;
	}): Promise<Month> {
		var when = this.monthYear(date);

		var cache = this.db.data.shifts;

		if (when in cache) {
			const now = new Date();
			var thisMonthTheFirst = new Date(
				now.getFullYear(),
				now.getMonth(),
				1
			);
			var value = cache[when];

			if (
				thisMonthTheFirst > date ||
				Date.now() - new Date(value.updated).getTime() < EXPIRY ||
				cachedOnly
			) {
				return value;
			}
		}

		if (cachedOnly) return;

		var html = await this.requests.timesheet(when);

		var parsed: Month = {
			updated: new Date().toJSON(),
			parsed: this.parseTimesheet(html)
		};
		this.db.data.shifts[when] = parsed;

		await this.db.write();

		return parsed;
	}

	private parseTimesheet(html: string): Shift[] {
		var $ = cheerio.load(html);
		var shiftsElements = $(
			"td[class*=calendarCellRegular]:not(.calendarCellRegularCurrent:has(.calCellData)) table"
		).toArray();
		var shifts = shiftsElements.map((element) => {
			var date = element.attribs["title"].replace("Details van ", "");

			var [start, end] = $("p span", element)
				.toArray()
				.map((el) =>
					new Date(`${date} ${$(el.firstChild).text()}`).toJSON()
				);

			return {
				start,
				end
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
					validateStatus: (s) => s == 302
				}
			);
			return this.firstCookie(res.headers);
		},

		timesheet: async (when?: string): Promise<string> => {
			var res = await this.http(
				`${timesheetURL}?NEW_MONTH_YEAR=${when ?? ""}`,
				{
					headers: { Cookie: this.getToken() },
					maxRedirects: 0
				}
			);
			if (typeof res.data == "string") {
				await this.updateExpiry();
				return res.data;
			} else {
				if (res.data.operation == "login") {
					console.log("Token Expired During request");
					await this.login({ expired: true });
					return await this.requests.timesheet(when);
				}
			}
			console.error("Unknown Error");
			console.log(res.data);
			return "Unknown Error";
		}
	};
}
