export interface KVGroup {
	getItem<T>(key: string): Promise<T | undefined>;
	setItem<T>(key: string, value: T): Promise<void>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;
}

export interface KVStorage {
	open(name: string): Promise<KVGroup>;
	destroy(name: string): Promise<void>;
}

export const KVStorage = Symbol("KvStorage");
