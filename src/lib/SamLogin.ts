import { timesheetCacheDuration } from "@env"
import axios, { AxiosInstance, AxiosResponse } from "axios"
import cheerio from "cheerio"
import { DateTime, Settings } from "luxon"

import type { Store } from "@lib"
import { log } from "@server"
import { TimesheetError } from "@utils"

import { ErrorType } from "@models/ErrorType"
import Schema, { GetTimesheet, Shift, Timesheet } from "@models/Schema"

export class SamLogin {
	private db: Store<Schema>
	private http: AxiosInstance

	private username?: string
	private password?: string

	private urls = {
		base: "https://sam.ahold.com/",
		timesheet: "wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp",
		login: "pkmslogin.form",
	}
	private tokenExpiry = 60 * 60 * 1000
	private cacheExpiry = timesheetCacheDuration

	private getToken = (): string | undefined => this.db.data.token.token

	private isLoggedIn = (): boolean =>
		this.db.data.token.updated != undefined &&
		DateTime.fromISO(this.db.data.token.updated)
			.diffNow()
			.negate()
			.valueOf() < this.tokenExpiry

	private updateExpiry = async (): Promise<void> => {
		this.db.data.token.updated = DateTime.now().toJSON()
		await this.db.write()
	}

	private updateToken = async (token: string): Promise<void> => {
		this.db.data.token.token = token
		this.db.data.token.created = DateTime.now().toJSON()
		await this.updateExpiry()
	}

	constructor({
		username,
		password,
		store,
	}: {
		username?: string
		password?: string
		store: Store<Schema>
	}) {
		this.http = axios.create({
			baseURL: this.urls.base,
		})

		this.http.interceptors.request.use((c) => {
			log.AxiosRequest(c)
			return c
		})

		this.username = username
		this.password = password

		this.db = store
	}

	public async get(date = DateTime.now()): Promise<GetTimesheet> {
		Settings.defaultLocale = "en"
		await this.db.read()

		const timesheetDates: DateTime[] = [date]

		if (date.day >= 15) {
			const currentMonth = this.currentMonthTheFirst()
			const nextMonth = currentMonth.plus({ months: 1 })
			timesheetDates.push(nextMonth)
		}

		const needsFetch = !timesheetDates.every((date) => this.getCache(date))

		if (needsFetch) {
			if (!this.isLoggedIn()) {
				log.Login()
				await this.login()
			}

			log.RequestTimesheet()
		}

		const timesheets = await Promise.all(
			timesheetDates.map((date) => this.timesheet({ date })),
		)

		if (needsFetch) {
			log.TimesheetDone()
		}

		return [
			{
				updated: timesheets[0].updated,
				parsed: timesheets.flatMap((t) => t.parsed),
			},
			needsFetch,
		]
	}

	private async login(): Promise<void> {
		if (this.db.data.error) {
			log.ErrorKey()
			throw new TimesheetError(ErrorType.IncorrectSaved)
		}

		const session = await this.requests.session()

		const token = await this.requests
			.login(session)
			.catch(async (error) => {
				if (
					axios.isAxiosError(error) &&
					error.response?.status == 200
				) {
					this.db.data.error = true
					await this.db.write()

					log.LoginFailed()
					throw new TimesheetError(ErrorType.Incorrect)
				}

				throw error
			})

		if (token) {
			await this.updateToken(token)
			log.LoggedIn()
		}
	}

	private getCache(date: DateTime): Timesheet | false {
		const key = this.monthYear(date)

		const cache = this.db.data.shifts ?? {}

		if (key in cache) {
			const value = cache[key]

			if (
				this.monthPassed(date) ||
				DateTime.fromISO(value.updated)
					.diffNow()
					.negate()
					.as("seconds") < this.cacheExpiry
			) {
				return value
			}
		}
		return false
	}

	private async timesheet({
		date = this.currentMonthTheFirst(),
	}: {
		date?: DateTime
	}): Promise<Timesheet> {
		const when = this.monthYear(date)

		const cache = this.getCache(date)
		if (cache) return cache

		const html = await this.requests.timesheet(when)

		const parsed: Timesheet = {
			updated: new Date().toJSON(),
			parsed: this.parseTimesheet(html),
		}

		this.db.data.shifts[when] = parsed

		await this.db.write()

		return parsed
	}

	private parseTimesheet(html: string): Shift[] {
		const $ = cheerio.load(html)
		const shiftsElements = $(
			"td[class*=calendarCellRegular]:not(.calendarCellRegularCurrent:has(.calCellData)) table",
		).toArray()
		const shifts = shiftsElements.map((element) => {
			const date = element.attribs["title"].replace("Details van ", "")

			const [start, end] = $("p span", element)
				.toArray()
				.map((el) =>
					DateTime.fromFormat(
						`${date} ${$(el.firstChild!).text()}`,
						"MM/dd/yyyy T",
					),
				)

			if (start > end) {
				end.plus({ days: 1 })
			}

			return {
				start: start.toJSON(),
				end: end.toJSON(),
			}
		})
		return shifts
	}

	private firstCookie(headers: AxiosResponse["headers"]): string {
		const header = headers["set-cookie"]
		if (!header?.length) {
			throw new TimesheetError(ErrorType.NoCookies)
		}
		return header[0].split(";")[0]
	}

	private monthYear(date: DateTime): string {
		return date.toFormat("L/y")
	}
	private currentMonthTheFirst(): DateTime {
		return DateTime.fromObject({ day: 1 })
	}
	private monthPassed(date: DateTime): boolean {
		return this.currentMonthTheFirst() > date
	}

	private requests = {
		session: async (): Promise<string> => {
			log.RequestSession()
			const res = await this.http(this.urls.timesheet)
			return this.firstCookie(res.headers)
		},

		login: async (session: string): Promise<string> => {
			log.RequestLogin()
			if (!this.username || !this.password) {
				throw new TimesheetError(ErrorType.Incomplete)
			}
			const res = await this.http.post(
				this.urls.login,
				`username=${this.username}&password=${this.password}&login-form-type=pwd`,
				{
					headers: { Cookie: session },
					maxRedirects: 0,
					validateStatus: (s) => s == 302,
				},
			)
			return this.firstCookie(res.headers)
		},

		timesheet: async (when = ""): Promise<string> => {
			const token = this.getToken()

			if (!token) {
				throw new TimesheetError(ErrorType.NoToken)
			}

			const res = await this.http(
				`${this.urls.timesheet}?NEW_MONTH_YEAR=${when}`,
				{
					headers: { Cookie: token },
					maxRedirects: 0,
				},
			)

			if (typeof res.data == "string") {
				await this.updateExpiry()
				return res.data
			} else {
				if (res.data.operation == "login") {
					log.TokenIncorrect()

					this.db.data.token = {}

					await this.db.write()

					return await this.login().then(
						async () => await this.requests.timesheet(when),
					)
				}
			}
			console.error("Unknown Error")
			console.log(res.data)
			throw new Error("Unknown Error")
		},
	}
}
