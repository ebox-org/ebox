import { AnyEventObject, assign, createMachine } from "xstate";
import * as Ports from "../../ports";
import { faker } from "@faker-js/faker";
import { over } from "ok-value-error-reason";
import { interfaces } from "inversify";

export interface UploadMachineCtx {
	file: File;
	fid?: string;
	error?: Error;
}

export const createUploadMachine =
	(ctx: interfaces.Context) => (file: File) => {
		const container = ctx.container;

		const logger = container
			.get<Ports.LoggerFactory>(Ports.LoggerFactory)
			.createLogger("upload");

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
						const upload = container.get<Ports.Upload>(Ports.Upload);

						const fid = await upload.upload(ctx.file);

						logger.info("upload success", { fid });

						return fid;
					},
				},
			}
		);
	};

export type UploadMachine = ReturnType<typeof createUploadMachine>;
