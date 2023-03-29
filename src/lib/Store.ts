import { outputJson, pathExists, readJson } from "fs-extra"

export class Store<Schema> {
	public data: Schema
	private path: string
	private defaults: Schema
	private initialized = false

	constructor(path: string, defaults: Schema) {
		this.path = path
		this.defaults = defaults
		this.data = defaults
	}

	public async init(): Promise<void> {
		if (this.initialized) return

		if (await pathExists(this.path)) {
			await this.read()
		} else {
			this.data = this.defaults
			await this.write()
		}

		this.initialized = true
	}

	public async write(): Promise<void> {
		await outputJson(this.path, this.data, { spaces: "\t" })
	}

	public async read(): Promise<void> {
		const data: Schema = await readJson(this.path, { throws: false })
		this.data = data ?? this.defaults
	}
}
