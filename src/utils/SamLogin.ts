import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import colors from "chalk";
import cheerio from "cheerio";
import { join } from "path";

import { storePath } from "@utils/env";
import Database from "@utils/storage";

import Store, { Month, Shift } from "@models/store";

const timesheetURL = "wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp";
const EXPIRY = 60 * 60 * 1000;

export default class SamLogin {
	private db: Database<Store>;
	private http: AxiosInstance;

	private username: string;
	private password: string;

	private getToken = (): string | undefined => this.db.data.token;

	private isExpired = (): boolean => Date.now() > (this.db.data.expiry ?? 0);

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
				`${colors.yellow(`[${c.method?.toUpperCase()}]`)}: ${c.url}`
			);
			return c;
		});

		this.username = username;
		this.password = password;

		this.db = new Database<Store>(join(storePath), { shifts: {} });
	}

	async login({ expired = false } = {}): Promise<void> {
		await this.db.init();

		if (this.db.data.error) {
			console.log(colors.yellow("Error var is set, see store.json"));
			throw new Error("Password was incorrect last time");
		}

		if (expired || this.isExpired()) {
			console.log(colors.gray("Token is expired"));

			const session = await this.requests.session();
			await this.requests
				.login(session)
				.then(this.setToken)
				.catch(async (error) => {
					const err = error as AxiosError;

					if (err?.response?.status === 200) {
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

	async timesheet({ date = new Date() }: { date?: Date }): Promise<Month> {
		const when = this.monthYear(date);

		const cache = this.db.data.shifts;

		if (when in cache) {
			const now = new Date();
			const thisMonthTheFirst = new Date(
				now.getFullYear(),
				now.getMonth(),
				1
			);
			const value = cache[when];

			if (
				thisMonthTheFirst > date ||
				Date.now() - new Date(value.updated).getTime() < EXPIRY
			) {
				return value;
			}
		}

		const html = await this.requests.timesheet(when);

		const parsed: Month = {
			updated: new Date().toJSON(),
			parsed: this.parseTimesheet(html)
		};
		this.db.data.shifts[when] = parsed;

		await this.db.write();

		return parsed;
	}

	private parseTimesheet(html: string): Shift[] {
		const $ = cheerio.load(html);
		const shiftsElements = $(
			"td[class*=calendarCellRegular]:not(.calendarCellRegularCurrent:has(.calCellData)) table"
		).toArray();
		const shifts = shiftsElements.map((element) => {
			const date = element.attribs["title"].replace("Details van ", "");

			const [start, end] = $("p span", element)
				.toArray()
				.map((el) =>
					new Date(`${date} ${$(el.firstChild!).text()}`).toJSON()
				);

			return {
				start,
				end
			};
		});
		return shifts;
	}

	private firstCookie(headers: AxiosResponse["headers"]): string {
		return headers["set-cookie"][0].split(";")[0] as string;
	}
	private monthYear(date: Date): string {
		return `${date.getMonth() + 1}/${date.getFullYear()}`;
	}

	private requests = {
		session: async (): Promise<string> => {
			const res = await this.http(timesheetURL);
			return this.firstCookie(res.headers);
		},

		login: async (session: string): Promise<string> => {
			const res = await this.http.post(
				"pkmslogin.form",
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
			const res = await this.http(
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

					await this.login({ expired: true }).then(
						async () => await this.requests.timesheet(when)
					);
				}
			}
			console.error("Unknown Error");
			console.log(res.data);
			return "Unknown Error";
		}
	};
}
