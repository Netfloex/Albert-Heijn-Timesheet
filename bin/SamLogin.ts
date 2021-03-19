import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { stringify } from "querystring";
export default class SamLogin {
	private http: AxiosInstance;

	private username: string;
	private password: string;

	private session: string;
	private token: string;

	constructor({ username, password }: { username: string; password: string }) {
		this.http = axios.create({
			baseURL: "https://sam.ahold.com/",
		});
		this.username = username;
		this.password = password;
	}

	async login() {
		this.session = await this.getSession();
		this.token = await this.loginRequest();
		return this.token;
	}

	private async getSession() {
		var res = await this.http("wrkbrn_jct/etm/time/timesheet/etmTnsMonth.jsp");
		var cookies = res.headers["set-cookie"];
		return cookies[0].split(";")[0];
	}

	private async loginRequest() {
		var res: AxiosResponse;
		try {
			var res = await this.http.post(
				"pkmslogin.form",
				stringify({
					username: this.username,
					password: this.password,
					"login-form-type": "pwd",
				}),
				{
					headers: { Cookie: this.session },
					maxRedirects: 0,
					validateStatus: s => s == 302,
				}
			);
		} catch (error) {
			console.log(error.response);

			return "Awww";
		}
		return res.headers["set-cookie"][0].split(";")[0];
	}
}
