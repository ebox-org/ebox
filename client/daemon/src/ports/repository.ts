export type Document<Content extends {} = {}> = {
	[key in keyof Content | "_id"]: key extends keyof Content
		? Content[key]
		: string;
};

export type FindArg<T extends {} = {}> = {
	after?: string;
	useIndex?: string;
	direction?: "asc" | "desc";
	limit?: number;
	predicate?: (doc: Document<T>) => boolean;
};

export interface Repository<Content extends {} = {}> {
	findById(id: string): Promise<Document<Content> | undefined>;

	find(arg: FindArg<Content>): Promise<Document<Content>[]>;

	create(doc: Content): Promise<Document<Content>>;

	update(doc: Document<Content>): Promise<Document<Content>>;

	delete(id: string): Promise<boolean>;
}

export interface RepositoryManager {
	open<T extends {} = {}>(name: string): Promise<Repository<T>>;
}
export const RepositoryManager = Symbol("RepositoryManager");
