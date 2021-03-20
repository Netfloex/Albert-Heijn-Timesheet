import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import FileAsync from "lowdb/adapters/FileAsync";
import low from "lowdb";

type Schema = {
	token: string;
	expiry: number;
};

export default class SamLogin {
	private db: low.LowdbAsync<Schema>;
	private http: AxiosInstance;

	private username: string;
	private password: string;

	get token() {
		return this.db.get("token").value();
	}
	get expiry() {
		return this.db.get("expiry").value();
	}
	set token(value) {
		this.db
			.set("token", value)
			.set("expiry", Date.now() + 60000)
			.write();
	}
	constructor({ username, password }: { username: string; password: string }) {
		this.http = axios.create({
			baseURL: "https://sam.ahold.com/",
		});
		this.username = username;
		this.password = password;
	}
	async init() {
		this.db = await low(new FileAsync<Schema>("store.json"));
	}
	async login() {
		await this.db.read();
		if (Date.now() > this.expiry) {
			console.log("Token is expired");
			var session = await this.getSession();
			var token = await this.loginRequest(session).catch((err: AxiosError) => {
				if (err?.response?.status === 200) {
					console.log(`Wachtwoord Fout`.toUpperCase());
				} else {
					throw err;
				}
			});
			if (token) {
				this.token = token;
			}
		}
		return this.token;
	}

	private firstCookie(headers: AxiosResponse["headers"]) {
		return headers["set-cookie"][0].split(";")[0] as string;
	}

	private async getSession() {
		var res = await this.http("wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp");
		return this.firstCookie(res.headers);
	}

	private async loginRequest(session: string) {
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
	}
}
