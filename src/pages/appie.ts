import { Request, RequestHandler, Response } from "express";
import SamLogin from "../utils/SamLogin";

import env from "../utils/env";

const sam = new SamLogin({
	username: env.ahusername,
	password: env.ahpassword
});
const ifIsNumber = (test: any, set: (n: number) => number) => {
	if (typeof test == "string" && !isNaN(parseInt(test))) {
		set(parseInt(test));
	}
};
const afterLogin = async (error, req: Request, res: Response) => {
	var cachedOnly = error != undefined;
	if (cachedOnly) delete error.config;

	const date = new Date();
	ifIsNumber(req.query.month, (n) => date.setMonth(n - 1));
	ifIsNumber(req.query.year, (n) => date.setFullYear(n));

	var ts = [sam.timesheet({ cachedOnly, date })];

	if (!date && new Date().getDate() >= 15) {
		const now = new Date();
		var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		ts.push(sam.timesheet({ date: nextMonth, cachedOnly }));
	}

	var resolved = (await Promise.all(ts)).filter(Boolean);
	if (!resolved[0]) {
		return res.json({ error });
	}
	res.json({
		updated: resolved[0].updated,
		error,
		parsed: resolved.flatMap((t) => t.parsed)
	});
};

const Appie: RequestHandler = async (req, res) => {
	console.time("Appie");
	sam.login()
		.then((e) => afterLogin(e, req, res))
		.catch((e) => afterLogin(e, req, res))
		.finally(() => {
			console.timeEnd("Appie");
		});
};

export default Appie;
