import * as R from "ramda";
import { MessageMachineState } from "./machine-list";

export const selectRecentThreads = (state: MessageMachineState) => {
	return R.pipe(
		() => R.groupBy((m) => m.fromID, state.context.messages),
		R.keys
	)();
};
