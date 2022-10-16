package acts

import (
    "universe.dagger.io/docker"
)

#RunScript: {
    name: string
    _name: name

    args: [...string]
    _args: args

    docker.#Run & {
        workdir: "/src"
        name: "zx",
        args: ["./misc/scripts/src/\(_name).mjs"] + _args
    }
}
