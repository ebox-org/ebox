import { StateFrom } from "xstate";
import { NodeMapMachine } from "./machine";


export const selectNearbyNodes = (state: StateFrom<NodeMapMachine>) => state.context.nearbyNodes;
