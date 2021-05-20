console.clear();
import express from "express";
import colors from "colors/safe";
import appie from "./pages/appie";
import * as nginx from "./pages/nginx";
const app = express();

console.log(colors.green("Started"));
app.get("/appie", appie);
app.use((req, res, next) => {
	if (req.headers["user-agent"].match(process.env.privatedata)?.length) {
		next();
	} else {
		res.status(403).end("Foei!");
	}
});
app.get("/nginx/ips", nginx.ips);
app.get("/nginx/useragents", nginx.useragents);
app.get("/nginx/urls", nginx.urls);

app.listen(4444);
