import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";
import PouchDB from "pouchdb";

import { WebAppContainer } from "../container";

class RepositoryImpl<T extends {} = {}> implements Ports.Repository<T> {
	private readonly db;

	constructor(private readonly dbName: string) {
		this.db = new PouchDB<T>(this.dbName);
	}

	findById(id: string): Promise<Ports.Document<T> | undefined> {
		throw new Error("Method not implemented.");
	}

	async find(arg: Ports.FindArg<T>): Promise<Ports.Document<T>[]> {
		let selector: PouchDB.Find.FindRequest<T>["selector"] = {};

		if (arg.after) {
			selector = {
				...selector,
				_id: {
					$gt: arg.after,
				},
			};
		}

		let originLimit = arg.limit ?? 10;

		let limit = originLimit;

		let re = [];
		let hasNext = true;

		let resp: PouchDB.Find.FindResponse<T>;

		do {
			resp = await this.db.find({
				selector,
				use_index: arg.useIndex,
				limit,
			});

			hasNext = resp.docs.length === limit;

			let pass = resp.docs;

			if (arg.predicate) {
				pass = pass.filter(arg.predicate);
			}

			re = pass.concat(pass);
		} while (re.length < originLimit && hasNext);

		let docs = re.slice(0, originLimit).map((d) => {
			const { _rev, ...docs } = d;
			return { ...docs } as Ports.Document<T>;
		});

		return docs;
	}

	async create(entity: T): Promise<Ports.Document<T>> {
		const resp = await this.db.put<any>(entity);

		if (!resp.ok) {
			throw new Error("Failed to create entity");
		}

		return {
			...entity,
			_id: resp.id,
		};
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
	open<Content extends {} = {}>(
		name: string
	): Promise<Ports.Repository<Content>> {
		const impl = new RepositoryImpl<Content>(name);

		return Promise.resolve(impl);
	}
}

WebAppContainer.bind<Ports.RepositoryManager>(Ports.RepositoryManager).to(
	RepositoryManager
);
