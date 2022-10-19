import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon, useDaemonActor } from "../../state-machine";
import { ActorRef, ActorRefFrom } from "xstate";
import { MessageMachine, SendMachine } from "src/daemon/modules/message";
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from "@mui/material";
// import {RadioGroup} from '@mui/base'

export const MessageInput = () => {
	const nodeRef = useDaemonActor((s) => {
		return s.context.nodeRef!;
	});

	const sendRef = useSelector(nodeRef!, (s) => {
		return s.context.messageRef?.getSnapshot()?.context.sendRef;
	});

	if (!sendRef) {
		return <div>Not ready</div>;
	}

	return <MessageInputReady sendRef={sendRef} />;
};

interface MessageInputReady {
	sendRef: ActorRefFrom<SendMachine>;
}

function MessageInputReady({ sendRef }: MessageInputReady) {
	const toRef = React.useRef<HTMLInputElement>(null);

	const [cType, setCType] = React.useState<"text" | "file">("text");

	const textRef = React.useRef<HTMLInputElement>(null);
	const fileRef = React.useRef<HTMLInputElement>(null);

	const handleSend = async () => {
		if (cType === "text") {
			sendRef.send({
				type: "SEND",
				toID: toRef.current!.value,
				content: textRef.current!.value,
			});
			textRef.current!.value = "";
		} else if (cType === "file") {
			const file = fileRef.current!.files![0];

			const fid = await Daemon.upload(file);

			fileRef.current!.value = "";

			sendRef.send({
				type: "SEND",
				toID: toRef.current!.value,
				msgType: "file",
				content: fid,
			});
		}
	};

	return (
		<div>
			<div>
				To:
				<input ref={toRef} />
			</div>

			<div>
				Content:
				<div>
					<FormControl>
						<FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
						<RadioGroup
							aria-labelledby="demo-controlled-radio-buttons-group"
							name="controlled-radio-buttons-group"
							value={cType}
							onChange={(e) => {
								setCType(e.target.value as "text" | "file");
							}}
						>
							<FormControlLabel value="text" control={<Radio />} label="Text" />
							<FormControlLabel value="file" control={<Radio />} label="File" />
						</RadioGroup>
					</FormControl>
				</div>
				{cType === "text" && <input ref={textRef} type="text" />}
				{cType === "file" && <input ref={fileRef} type="file" />}
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
}
