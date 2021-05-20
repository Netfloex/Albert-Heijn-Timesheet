import { RequestHandler } from "express";
import { createPool } from "mariadb";

import env from "../bin/env";

const pool = createPool(env.mariadb);

const sql = async (sql: string) => {
	var conn = await pool.getConnection();
	conn.release();
	return await conn.query(sql);
};

const countValues = async (key: string, name: string) => await sql(`SELECT ${key} as ${name}, count(${key}) AS count FROM requests GROUP BY ${name} ORDER BY count DESC LIMIT 10`);

const json = (value: () => Promise<any>): RequestHandler => async (_, res) => res.json(await value());

const jsonCount = (key: string, name: string) => json(async () => await countValues(key, name));

export const ips = jsonCount("ip", "ip");
export const useragents = jsonCount("`user-agent`", "`user-agent`");
export const urls = jsonCount("concat(`host`, `url`)", "url");
