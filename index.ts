console.clear();
console.log("Started");
import express from "express";
import SamLogin from "./bin/SamLogin";
import config from "./config.json";
const Sam = new SamLogin(config);
const app = express();

app.get("/appie", async (_, res) => {
	res.json(await Sam.login());
});
app.listen(4444);
