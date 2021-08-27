import axios, { AxiosInstance, AxiosResponse } from "axios";
import cheerio from "cheerio";

import type { Store } from "@lib";
import { log } from "@utils";

import Schema, { Month, Shift } from "@models/store";

export class SamLogin {
	private db: Store<Schema>;
	private http: AxiosInstance;

	private username: string;
	private password: string;

	private urls = {
		base: "https://sam.ahold.com/",
		timesheet: "wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp",
		login: "pkmslogin.form"
	};
	private tokenExpiry = 60 * 60 * 1000;
	private cacheExpiry = 60 * 60 * 1000;

	private getToken = (): string | undefined => this.db.data.token;

	private isLoggedIn = (): boolean =>
		this.db.data.expiry != undefined && Date.now() < this.db.data.expiry;

	private updateExpiry = async (): Promise<void> => {
		this.db.data.expiry = Date.now() + this.tokenExpiry;
		await this.db.write();
	};

	private updateToken = async (token: string): Promise<void> => {
		this.db.data.token = token;
		this.db.data.created = new Date().toLocaleString();
		await this.updateExpiry();
	};

	constructor({
		username,
		password,
		store
	}: {
		username: string;
		password: string;
		store: Store<Schema>;
	}) {
		this.http = axios.create({
			baseURL: this.urls.base,
			timeout: 5000
		});

		this.http.interceptors.request.use((c) => {
			log.AxiosRequest(c);
			return c;
		});

		this.username = username;
		this.password = password;
		this.db = store;
	}

	public async get(): Promise<Month> {
		const date = new Date();
		await this.db.read();

		if (!this.isLoggedIn() && !this.getCache(date)) {
			log.Login();
			await this.login();
		}

		return await this.timesheet({ date });
	}

	private async login(): Promise<void> {
		if (this.db.data.error) {
			log.ErrorKey();
			throw new Error("Password was incorrect last time");
		}

		const session = await this.requests.session();

		const token = await this.requests
			.login(session)
			.catch(async (error) => {
				if (
					axios.isAxiosError(error) &&
					error.response?.status == 200
				) {
					this.db.data.error = true;
					await this.db.write();

					log.LoginFailed();
					throw new Error("Login Failed!");
				}

				throw error;
			});

		if (token) {
			await this.updateToken(token);
			log.LoggedIn();
		}
	}

	private getCache(date: Date): Month | false {
		const key = this.monthYear(date);

		const cache = this.db.data.shifts;

		if (key in cache) {
			const value = cache[key];

			if (
				this.monthPassed(date) ||
				Date.now() - new Date(value.updated).getTime() <
					this.cacheExpiry
			) {
				return value;
			}
		}
		return false;
	}

	private async timesheet({
		date = new Date()
	}: {
		date?: Date;
	}): Promise<Month> {
		const when = this.monthYear(date);

		const cache = this.getCache(date);
		if (cache) return cache;

		const html = await this.requests.timesheet(when);

		const parsed: Month = {
			updated: new Date().toJSON(),
			parsed: this.parseTimesheet(html)
		};

		this.db.data.shifts[when] = parsed;

		await this.db.write();

		log.TimesheetDone();

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
	private monthPassed(date: Date): boolean {
		const now = new Date();
		const thisMonthTheFirst = new Date(
			now.getFullYear(),
			now.getMonth(),
			1
		);
		return thisMonthTheFirst > date;
	}

	private requests = {
		session: async (): Promise<string> => {
			log.RequestSession();
			const res = await this.http(this.urls.timesheet);
			return this.firstCookie(res.headers);
		},

		login: async (session: string): Promise<string> => {
			log.RequestLogin();
			const res = await this.http.post(
				this.urls.login,
				`username=${this.username}&password=${this.password}&login-form-type=pwd`,
				{
					headers: { Cookie: session },
					maxRedirects: 0,
					validateStatus: (s) => s == 302
				}
			);
			return this.firstCookie(res.headers);
		},

		timesheet: async (when = ""): Promise<string> => {
			log.RequestTimesheet();
			const res = await this.http(
				`${this.urls.timesheet}?NEW_MONTH_YEAR=${when}`,
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
					log.TokenIncorrect();

					delete this.db.data.expiry;

					await this.db.write();

					return await this.login().then(
						async () => await this.requests.timesheet(when)
					);
				}
			}
			console.error("Unknown Error");
			console.log(res.data);
			throw new Error("Unknown Error");
		}
	};
}
