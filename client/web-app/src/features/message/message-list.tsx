import * as React from "react";
import { useActor, useSelector } from "@xstate/react";
import { Daemon } from "../../state-machine";
import { ActorRef, ActorRefFrom } from "xstate";
import { interfaces } from "@ebox/daemon";

export interface MessageList {
	actor: ActorRefFrom<interfaces.NodeMachine>;
}

export const MessageList = (props: MessageList) => {
	const messageRef = useSelector(props.actor, (s) => {
		return s.context.messageRef;
	});

	const messages = useSelector(messageRef, (s) => {
		return s.context.messages;
	});

	return (
		<div>
			<div key="title">Messages:</div>
			{messages.map((m) => {
				const Comp = MessageTypeMap[m.messageType];

				return <Comp key={m.messageID} message={m} />;
			})}
		</div>
	);
};

const MessageTypeMap: {
	[key: string]: MessageRenderer;
} = {
	text: Text,
	file: File,
};

interface MessageRendererProps {
	message: interfaces.Message;
}

type MessageRenderer = (props: MessageRendererProps) => JSX.Element;

function Text({ message }: { message: interfaces.Message }) {
	return (
		<div>
			{message.fromID}: {message.content}
		</div>
	);
}

const FILE_API =
	import.meta.env.PROD || !import.meta.env.VITE_API
		? "/file"
		: `${import.meta.env.VITE_API}/file`;
const UPLOAD_API = `${FILE_API}/upload`;
const DOWNLOAD_API = `${FILE_API}/download`;

function File({ message }: { message: interfaces.Message }) {
	return (
		<div>
			{message.fromID}:{" "}
			<a
				href={`${DOWNLOAD_API}/${message.content}`}
				target="_blank"
				download="file"
			>
				File
			</a>
		</div>
	);
}
