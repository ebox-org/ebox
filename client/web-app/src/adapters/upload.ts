import { WebAppContainer } from "../container";
import { Ports, injectable } from "@ebox/daemon";
const FILE_API = "/file";
// const FILE_API =
// 	import.meta.env.PROD || !import.meta.env.VITE_API
// 		? "/file"
// 		: `${import.meta.env.VITE_API}/file`;
const UPLOAD_API = `${FILE_API}/upload`;
const DOWNLOAD_API = `${FILE_API}/download`;

@injectable()
class UploadImpl implements Ports.Upload {
	async upload(file: File): Promise<string> {
		const formData = new FormData();

		formData.append("file", file);

		const res = await fetch(UPLOAD_API, {
			method: "POST",
			body: formData,
		});

		const body = await res.json();

		const fid = body.fid;

		return fid;
	}
}

WebAppContainer.bind(Ports.Upload).to(UploadImpl);
