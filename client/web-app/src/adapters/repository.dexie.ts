import Dexie from "dexie";
import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";
import PouchDB from "pouchdb";
import { WebAppContainer } from "../container";

class RepositoryImpl<T extends {} = {}> implements Ports.Repository<T> {
	private readonly db;

	constructor(private readonly name: string) {
		this.db = new Dexie(name);
		this.setupStores(name);
	}

	private setupStores(name: string) {
		this.db.version(1).stores({
			[name]: "++id, toId, fromId, type, content",
		});
	}

	findById(id: string): Promise<Ports.Document<T> | undefined> {
		throw new Error("Method not implemented.");
	}

	find(arg: Ports.FindArg<T>): Promise<Ports.Document<T>[]> {
		throw new Error("Method not implemented.");
	}

	create(doc: T): Promise<Ports.Document<T>> {
		throw new Error("Method not implemented.");
	}

	update(doc: Ports.Document<T>): Promise<Ports.Document<T>> {
		throw new Error("Method not implemented.");
	}

	delete(id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}

class DexieRepositoryManager implements Ports.RepositoryManager {
	open<T extends {} = {}>(name: string): Promise<Ports.Repository<T>> {
		throw new Error("Method not implemented.");
	}

	private readonly repos = new Map<string, RepositoryImpl<any>>();

	get<T extends {} = {}>(name: string): Ports.Repository<T> {
		if (!this.repos.has(name)) {
			this.repos.set(name, new RepositoryImpl<T>(name));
		}

		return this.repos.get(name) as Ports.Repository<T>;
	}
}

WebAppContainer.bind<Ports.RepositoryManager>(Ports.RepositoryManager).to(
	DexieRepositoryManager
);
