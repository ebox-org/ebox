package constants

import (
    "strings"
    "pipes.local/types"
)

_AllModules: [
    {
        name: "web-app"
        context: "client/web-app"
    },
    {
        name: "server-graphql-router"
        context: "server/graphql-router"
    },
    {
        name: "server-node"
        context: "server/node"
    },
    {
        name: "server-location"
        context: "server/location"
    },
    {
        name: "server-message"
        context: "server/message"
    },
    {
        name: "server-file"
        context: "server/file"
    },
]

AllModules: [...types.#Module]
AllModules: [for k, v in _AllModules {
    name: v.name,
    _context: strings.TrimLeft(strings.TrimRight(v.context, "/"), "./")
    context: _context
    dockerfile: _context + "/Dockerfile"
}]
