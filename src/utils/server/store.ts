import { storePath } from "@env"

import { Store } from "@lib"

import Schema from "@models/Schema"

export const store = new Store<Schema>(storePath, { shifts: {}, token: {} })
