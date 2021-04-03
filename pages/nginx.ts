import { RequestHandler } from "express";
import { createPool } from "mariadb";
process.env.mariadb = "mariadb://root:rpI6708!@localhost/nginx";

const pool = createPool(process.env.mariadb);

const sql = async (sql: string) => {
	var conn = await pool.getConnection();
	conn.release();
	return await conn.query(sql);
};
const countValues = async (key: string) => await sql("SELECT key as one, count(key) AS count FROM requests GROUP BY one ORDER BY count DESC".replace(/key/g, key));

const json = (value: () => Promise<any>): RequestHandler => async (_, res) => res.json(await value());

const jsonCount = (key: string) => json(async () => await countValues(key));

export const ips = jsonCount("ip");
export const useragents = jsonCount("`user-agent`");
export const urls = jsonCount("concat(`host`, `url`)");
