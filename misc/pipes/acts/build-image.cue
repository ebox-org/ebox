package acts

import (
	"dagger.io/dagger"
	// "dagger.io/dagger/core"
	"universe.dagger.io/docker"
	"pipes.local/types"
	"pipes.local/constants"
)


#BuildImage: {
	workdir: dagger.#FS
	_workdir: workdir

	module: types.#Module
	_module: module

	auth?: [registry=string]: {
		username: string
		secret:   dagger.#Secret
	}

	_auth: auth

	build: docker.#Dockerfile & {
		source: _workdir

		buildArg: {
			"-f": _module.context
		}

		dockerfile: {
			path: _module.dockerfile
		}

		if auth != _|_ {
			auth: _auth
		}

		platforms: [
			"linux/arm64"
			// Canot support multi-arch build for now
			// See: https://github.com/dagger/dagger/issues/437

			// "linux/amd64"
			// "linux/riscv64"
		]
	}

	output: build.output
}

#BuildAll: {	
	workdir: dagger.#FS
	_workdir: workdir

	auth?: [registry=string]: {
		username: string
		secret:   dagger.#Secret
	}

	_auth: auth

	build: {
		for k,v in constants.AllModules {
			"\(v.name)": #BuildImage & {
				workdir: _workdir
				module: v
				if auth != _|_ {
					auth: _auth
				}
			}
		}
	}
}
