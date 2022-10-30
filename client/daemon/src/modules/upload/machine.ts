import { AnyEventObject, assign, createMachine } from "xstate";
import { DaemonContainer } from "../../container";
import * as Ports from "../../_ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";

export interface UploadMachineCtx {
	file: File;
	fid?: string;
	error?: Error;
}

export const createUploadMachine = (container: DaemonContainer, file: File) => {
	const logger = container.get(Ports.LoggerFactory).createLogger("upload");

	return createMachine<UploadMachineCtx, AnyEventObject>(
		{
			context: { file },
			id: "upload",
			initial: "idle",
			states: {
				idle: {
					always: {
						target: "uploading",
					},
				},
				uploading: {
					invoke: {
						src: "upload",
						onDone: [
							{
								actions: ["setFID"],
								target: "uploaded",
							},
						],
						onError: [
							{
								actions: ["setError"],
								target: "uploadFailed",
							},
						],
					},
				},
				uploaded: {
					type: "final",
				},
				uploadFailed: {
					type: "final",
				},
			},
		},
		{
			actions: {
				setFID: assign((ctx, event: any) => {
					return { fid: event.data };
				}),
				setError: assign((ctx, event: any) => {
					return { error: event.data };
				}),
			},
			services: {
				upload: async (ctx, event) => {
					const upload = container.get(Ports.Upload);

					const fid = await upload.upload(ctx.file);

					logger.info("upload success", { fid });

					return fid;
				},
			},
		}
	);
};

export type UploadMachine = ReturnType<typeof createUploadMachine>;
