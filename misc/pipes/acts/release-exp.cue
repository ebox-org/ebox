package acts

import (
	"dagger.io/dagger"
	"universe.dagger.io/docker"
	"pipes.local/constants"
)

#ReleaseExp: {
	workdir: dagger.#FS
	_workdir: workdir

	username: string
	_username: username
	password: dagger.#Secret
	_password: password

	_auth: {
		username: _username
		secret: _password
	}
	
	build: {
		for k,v in constants.AllModules {
			"\(v.name)": #BuildImage & {
				workdir: _workdir
				module: v
				auth: "ghcr.io": _auth
			}
		}
	}

	release: {
		for k,v in constants.AllModules {
			"\(v.name)": docker.#Push & {
				image: build["\(v.name)"].output

				dest: "ghcr.io/ebox-org/ebox-\(v.name)"

				auth: _auth
			}
		}
	}
}
