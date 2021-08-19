import { outputJson, pathExists, readJson } from "fs-extra";

class Store<Schema> {
	public data: Schema;
	private path: string;
	private defaults: Schema;

	constructor(path: string, defaults: Schema) {
		this.path = path;
		this.defaults = defaults;
		this.data = defaults;
	}

	public async init(): Promise<void> {
		if (await pathExists(this.path)) {
			await this.read();
		} else {
			this.data = this.defaults;
			await this.write();
		}
	}

	public async write(): Promise<void> {
		await outputJson(this.path, this.data, { spaces: "\t" });
	}

	public async read(): Promise<void> {
		const data: Schema = await readJson(this.path, { throws: false });
		this.data = data ?? this.defaults;
	}
}

export default Store;
