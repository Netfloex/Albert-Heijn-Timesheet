import fs from "fs";
import { dirname, basename } from "path";

class Database<Schema> {
	public data: Schema;
	private path: string;
	private defaults: Schema;
	// @ts-expect-error
	constructor(path: string, defaults: Schema = {}) {
		this.path = path;
		this.defaults = defaults;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(dirname(path), { recursive: true });
			this.data = defaults;
			this.write();
		}
		this.read();
	}

	private serialize = (data: Schema): string => JSON.stringify(data, null, "\t");
	private deserialize = (data: string): Schema => JSON.parse(data);

	public write(): void {
		fs.writeFileSync(this.path, this.serialize(this.data));
	}
	public read(): void {
		const data = fs.readFileSync(this.path).toString();
		try {
			const parsed = this.deserialize(data);
			this.data = parsed;
		} catch (error) {
			this.data = this.defaults;
		}
	}
}
export default Database;
