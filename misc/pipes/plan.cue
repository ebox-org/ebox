package main

import (
	"dagger.io/dagger"
	"pipes.local/acts"
)


dagger.#Plan & {
	client: {
		filesystem: {
			"../../": read: {
				contents: dagger.#FS,
				exclude: [
					"node_modules",
					"out/",
					".git"
				]
			}

			// "../../out": write: contents: actions.releaseExp.output
		}
		env: {
			REGISTRY_USERNAME?: string
			REGISTRY_PASSWORD?: dagger.#Secret
		}
	}

	_rootDir: client.filesystem."../../".read.contents

	actions: {
		build: acts.#BuildAll & {
			workdir: _rootDir
		}

		release: acts.#ReleaseExp & {
			workdir: _rootDir
			username: client.env.REGISTRY_USERNAME
			password: client.env.REGISTRY_PASSWORD
		}
	}
}
