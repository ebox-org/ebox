package constants

import (
    "strings"
    "pipes.local/types"
)

_AllModules: [...types.#Module]
_AllModules: [
    {
        name: "web-app"
        path: "web-app"
    },
    {
        name: "server-graphql-router"
        path: "server/graphql-router"
    },
    {
        name: "server-node"
        path: "server/node"
    },
    {
        name: "server-location"
        path: "server/location"
    },
    {
        name: "server-message"
        path: "server/message"
    },
    {
        name: "server-file"
        path: "server/file"
    },
]

AllModules: [...types.#Module]
AllModules: [for k, v in _AllModules {
    name: v.name,
    path: strings.TrimLeft(strings.TrimRight(v.path, "/"), "./"),
}]
