import localforage from "localforage";
import { WebAppContainer } from "../container";
import { Ports } from "@ebox/daemon";
import { injectable } from "inversify";

class KVGroupImpl implements Ports.KVGroup {
	private _forage;
	constructor(name: string) {
		this._forage = localforage.createInstance({
			name,
		});
	}

	async getItem<T>(key: string): Promise<T | undefined> {
		const re = await this._forage.getItem<T>(key);
		return re ?? undefined;
	}
	async setItem<T>(key: string, value: T): Promise<void> {
		await this._forage.setItem(key, value);
	}
	remove(key: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	clear(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

@injectable()
class KVStorageImpl implements Ports.KVStorage {
	async open(name: string): Promise<Ports.KVGroup> {
		const re = new KVGroupImpl(name);
		return Promise.resolve(re);
	}

	destroy(name: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

WebAppContainer.bind(Ports.KVStorage).to(KVStorageImpl);
