import { WebAppContainer } from "../container";
import { Ports } from "@ebox/daemon";
import pDefer from "p-defer";
import { injectable } from "inversify";

@injectable()
class GeoLocationImpl implements Ports.GeoLocation {
	getCurrentPosition(): Promise<Ports.Coordinates> {
		const defer = pDefer<Ports.Coordinates>();

		navigator.geolocation.getCurrentPosition((pos) => {
			defer.resolve({
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude,
				altitude: pos.coords.altitude ?? undefined,
				accuracy: pos.coords.accuracy,
			});
		}, defer.reject);

		return defer.promise;
	}
}

WebAppContainer.bind(Ports.GeoLocation).to(GeoLocationImpl);
