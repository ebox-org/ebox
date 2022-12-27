import { StateFrom } from 'xstate';

import { DaemonMachineFactory } from './machine';

export const selectActorCenter = (state: StateFrom<DaemonMachine>) => {
	return state.context.actorCenterRef!;
};

export const selectNodeActor = (state: StateFrom<DaemonMachine>) => {
	return state.context.nodeRef!;
};

export const selectNodeMap = (state: StateFrom<DaemonMachine>) => {
	return state.context.nodeMapRef!;
};
