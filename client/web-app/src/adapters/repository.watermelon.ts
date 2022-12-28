import { WebAppContainer } from "../container";
import { Ports } from "@ebox/daemon";
import {
	appSchema,
	Collection,
	Database,
	tableSchema,
	Q,
} from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";
import { Model } from "@nozbe/watermelondb";
import { injectable } from "inversify";
import { text, field } from "@nozbe/watermelondb/decorators";
import pDefer from "p-defer";

const schema = appSchema({
	version: 1,
	tables: [
		tableSchema({
			name: "messages",
			columns: [
				{ name: "message_id", type: "string", isIndexed: true },
				{ name: "from_id", type: "string", isIndexed: true },
				{ name: "to_id", type: "string", isIndexed: true },
				{ name: "message_type", type: "string" },
				{ name: "content", type: "number" },
			],
		}),
	],
});

class Messages extends Model {
	static table = "messages";

	@field("message_id")
  messageID!: string;

	@field("from_id")
  fromID!: string;

	@field("to_id")
  toID!: string;

	@field("message_type")
  messageType!: string;

	@field("content")
	content!: string;
}

const migrations = schemaMigrations({
	migrations: [
		// We'll add migration definitions here later
	],
});

const adapter = new LokiJSAdapter({
	schema,
	// (You might want to comment out migrations for development purposes -- see Migrations documentation)
	migrations,
	useWebWorker: false,
	useIncrementalIndexedDB: true,
	dbName: "myapp", // optional db name

	// --- Optional, but recommended event handlers:

	onQuotaExceededError: (error) => {
		// Browser ran out of disk space -- offer the user to reload the app or log out
	},
	onSetUpError: (error) => {
		// Database failed to load -- offer the user to reload the app or log out
	},
	extraIncrementalIDBOptions: {
		onDidOverwrite: () => {
			// Called when this adapter is forced to overwrite contents of IndexedDB.
			// This happens if there's another open tab of the same app that's making changes.
			// Try to synchronize the app now, and if user is offline, alert them that if they close this
			// tab, some data may be lost
		},
		onversionchange: () => {
			// database was deleted in another browser tab (user logged out), so we must make sure we delete
			// it in this tab as well - usually best to just refresh the page
			window.location.reload();
		},
	},
});

const database = new Database({
	adapter,
	modelClasses: [Messages],
});

class RepositoryImpl<T> implements Ports.Repository<T> {
	constructor(private readonly tableName: string) {}

	get collection() {
		return database.get<any>(this.tableName);
	}

	findById(id: string): Promise<Ports.Document<T> | undefined> {
		throw new Error("Method not implemented.");
	}

	find(arg: Ports.FindArg<T>): Promise<Ports.Document<T>[]> {

		// this.collection.query('message_id', Q.eq(ar))

		return Promise.resolve([])
	}

	async create(entity: T): Promise<Ports.Document<T>> {
		const defer = pDefer<Ports.Document<T>>();

		database.write(async () => {
			const keys = Object.keys(entity as any);

			const committed = await database
				.get<any>(this.tableName)
				.create((model) => {
					for (const k of keys) {
						// https://github.com/Nozbe/WatermelonDB/issues/819
						model._raw[k] = (entity as any)[k];
					}

					return model;
				});

			const committedEntity = keys.reduce((acc, key) => {
				acc[key] = committed[key];
				return acc;
			}, {} as any);

			committedEntity.id = committed.id;

			defer.resolve(committedEntity);
		});

		return defer.promise;
	}

	update(entity: Ports.Document<T>): Promise<Ports.Document<T>> {
		throw new Error("Method not implemented.");
	}

	delete(id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}

@injectable()
export class RepositoryManager implements Ports.RepositoryManager {
	open<T>(name: string): Promise<Ports.Repository<T>> {
		const impl = new RepositoryImpl<T>(name);

		return Promise.resolve(impl);
	}
}

WebAppContainer.bind<Ports.RepositoryManager>(Ports.RepositoryManager).to(
	RepositoryManager
);
