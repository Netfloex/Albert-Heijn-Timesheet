import { AxiosRequestConfig } from "axios";
import chalk from "chalk";

const isNotifications = { value: false };

const type = (): string =>
	isNotifications.value ? chalk`[{yellow Notifications}] ` : "";

const done = (msg: string): void =>
	console.log(chalk`${type()}[{green DONE}] ${msg}`);
const info = (msg: string): void =>
	console.info(chalk`${type()}[{blue INFO}] ${msg}`);
const error = (msg: string): void =>
	console.error(chalk`${type()}[{red ERROR}] ${msg}`);

// Requests:
const AxiosRequest = (c: AxiosRequestConfig): void =>
	info(
		chalk`{yellow [${c.method?.toUpperCase()}]} {dim ${c.baseURL}${c.url}}`
	);

// Request names
const RequestSession = (): void => info(`Retrieving a session token:`);
const RequestLogin = (): void => info(`Logging in:`);
const RequestTimesheet = (): void => info(`Updating timesheet:`);

// Requests progress
const Login = (): void => info(`Starting login procedure...`);
const LoggedIn = (): void => done(`Logged in`);
const TimesheetDone = (): void => done("Timesheet updated");

// Errors

const ErrorKey = (): void =>
	error(
		"The username/password was incorrect last time, not trying to login."
	);
const LoginFailed = (): void =>
	error(
		"Login Failed, please check your environment variables. After 3 failed attempts you may get temporary blocked. Disabled login. "
	);
const TokenIncorrect = (): void =>
	error("The token was incorrect, retrying login.");

// Notifications

const NotifStart = (): void => info("(Re)scheduling notifications");

const NoNotifiers = (): void =>
	info(
		chalk`Disabled notifications because no notifiers are set, to enable add the {dim {bold NOTIFIERS}} env variable`
	);

const ScheduledNotifications = (count: number): void =>
	done(chalk`Scheduled {green ${count}} notifications`);

export const log = {
	isNotifications,
	AxiosRequest,
	RequestSession,
	RequestLogin,
	RequestTimesheet,
	Login,
	LoggedIn,
	TimesheetDone,
	ErrorKey,
	LoginFailed,
	TokenIncorrect,
	NotifStart,
	NoNotifiers,
	ScheduledNotifications
};
