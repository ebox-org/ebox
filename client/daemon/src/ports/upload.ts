export interface Upload {
	upload(file: File): Promise<string>;
}

export const Upload = Symbol("Upload");
