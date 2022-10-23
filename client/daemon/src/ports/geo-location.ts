import { Token } from "../container";

export interface Coordinates {
	latitude: number;
	longitude: number;
	altitude?: number;
	accuracy?: number;
}

export interface GeoLocation {
	getCurrentPosition(): Promise<Coordinates>;
}

export const GeoLocation = Token.create<GeoLocation>("GeoLocation");
