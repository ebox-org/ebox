import { Token } from "../container";

export interface Upload {
	upload(file: File): Promise<string>;
}

export const Upload = Token.create<Upload>("Upload");
